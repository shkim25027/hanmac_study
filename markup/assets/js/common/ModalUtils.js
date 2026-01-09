/**
 * 모달 공통 유틸리티 모듈
 * 모든 모달에서 공통으로 사용되는 기능들을 모듈화
 * @module ModalUtils
 */

class ModalUtils {
  /**
   * 모달 닫기 이벤트 설정 (공통)
   * @param {HTMLElement} modalElement - 모달 요소
   * @param {Object} options - 옵션
   * @param {Function} options.onClose - 닫기 시 실행할 콜백 함수
   * @param {Function} options.onCleanup - 정리 작업 콜백 함수
   * @param {string} options.closeSelector - 닫기 버튼 셀렉터 (기본: ".close")
   * @param {boolean} options.closeOnBackdrop - 배경 클릭 시 닫기 (기본: true)
   * @param {boolean} options.closeOnEscape - ESC 키로 닫기 (기본: true)
   * @returns {Object} 정리 함수들을 담은 객체
   */
  static setupCloseEvents(modalElement, options = {}) {
    const {
      onClose = null,
      onCleanup = null,
      closeSelector = ".close",
      closeOnBackdrop = true,
      closeOnEscape = true,
    } = options;

    const cleanupFunctions = [];

    // 닫기 함수
    const closeModal = () => {
      if (onClose && typeof onClose === "function") {
        onClose();
      } else {
        // 기본 닫기 동작
        ModalUtils.stopVideo(modalElement);
        modalElement.style.display = "none";
        setTimeout(() => {
          if (modalElement && modalElement.parentNode) {
            modalElement.parentNode.removeChild(modalElement);
          }
        }, 300);
      }

      // 정리 작업 실행
      if (onCleanup && typeof onCleanup === "function") {
        onCleanup();
      }

      // 등록된 정리 함수들 실행
      cleanupFunctions.forEach((fn) => {
        if (typeof fn === "function") {
          fn();
        }
      });
    };

    // 닫기 버튼 이벤트
    const closeBtn = modalElement.querySelector(closeSelector);
    if (closeBtn) {
      closeBtn.onclick = closeModal;
    }

    // 배경 클릭 이벤트
    if (closeOnBackdrop) {
      modalElement.onclick = (e) => {
        if (e.target === modalElement) {
          closeModal();
        }
      };
    }

    // ESC 키 이벤트
    let escHandler = null;
    if (closeOnEscape) {
      escHandler = (e) => {
        if (e.key === "Escape") {
          closeModal();
          document.removeEventListener("keydown", escHandler);
        }
      };
      document.addEventListener("keydown", escHandler);
    }

    // 정리 함수 반환
    return {
      close: closeModal,
      cleanup: () => {
        if (escHandler) {
          document.removeEventListener("keydown", escHandler);
        }
        if (closeBtn) {
          closeBtn.onclick = null;
        }
        modalElement.onclick = null;
      },
      addCleanup: (fn) => {
        if (typeof fn === "function") {
          cleanupFunctions.push(fn);
        }
      },
    };
  }

  /**
   * 비디오 정지 (공통)
   * @param {HTMLElement} modalElement - 모달 요소
   */
  static stopVideo(modalElement) {
    // iframe 비디오 정지
    const iframe = modalElement.querySelector("#videoFrame");
    if (iframe) {
      // VideoBase가 있으면 사용, 없으면 직접 정지
      if (typeof VideoBase !== "undefined" && VideoBase.stop) {
        VideoBase.stop(iframe);
      } else {
        iframe.src = "";
      }
    }

    // video 태그 비디오 정지
    const video = modalElement.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }

  /**
   * Observer 정리 (공통)
   * @param {HTMLElement} modalElement - 모달 요소
   */
  static cleanupObservers(modalElement) {
    // ResizeObserver 정리
    if (modalElement._resizeObserver) {
      modalElement._resizeObserver.disconnect();
      modalElement._resizeObserver = null;
    }

    // MutationObserver 정리
    if (modalElement._mutationObserver) {
      modalElement._mutationObserver.disconnect();
      modalElement._mutationObserver = null;
    }

    // 타이머 정리
    if (modalElement._heightAdjustTimer) {
      clearTimeout(modalElement._heightAdjustTimer);
      modalElement._heightAdjustTimer = null;
    }

    // window resize 이벤트 리스너 제거
    if (modalElement._windowResizeHandler) {
      window.removeEventListener("resize", modalElement._windowResizeHandler);
      modalElement._windowResizeHandler = null;
    }
  }

  /**
   * 모달 완전 정리 (비디오 정지 + Observer 정리)
   * @param {HTMLElement} modalElement - 모달 요소
   */
  static cleanup(modalElement) {
    ModalUtils.stopVideo(modalElement);
    ModalUtils.cleanupObservers(modalElement);
  }

  /**
   * 모달 제거 (애니메이션 포함)
   * @param {HTMLElement} modalElement - 모달 요소
   * @param {Object} options - 옵션
   * @param {number} options.duration - 애니메이션 지속 시간 (기본: 300ms)
   * @param {Function} options.onComplete - 완료 콜백
   */
  static remove(modalElement, options = {}) {
    const { duration = 300, onComplete = null } = options;

    // 정리 작업
    ModalUtils.cleanup(modalElement);

    // 애니메이션
    modalElement.style.opacity = "0";
    modalElement.style.transition = `opacity ${duration}ms ease`;

    setTimeout(() => {
      if (modalElement && modalElement.parentNode) {
        modalElement.parentNode.removeChild(modalElement);
      }
      if (onComplete && typeof onComplete === "function") {
        onComplete();
      }
    }, duration);
  }
}
