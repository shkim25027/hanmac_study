// ============================================
// 비디오 모달 관리 모듈 (Ajax 방식)
// ============================================

export class VideoModalManager {
  constructor(config) {
    this.config = config;
    this.videos = config.videos || [];
    this.currentModal = null;
    this.resizerCleanup = null;
    this.resizeObserver = null;
    this.mutationObserver = null;
    this.heightAdjustTimer = null;
  }

  // 초기화
  init() {
    this.setupCardClickEvents();
  }

  // 카드 클릭 이벤트 설정
  setupCardClickEvents() {
    const container = document.getElementById("videoCardsContainer");
    if (!container) return;

    container.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      if (card) {
        e.preventDefault();
        const videoId = parseInt(card.getAttribute("data-video-id"));
        this.loadVideoModal(videoId);
      }
    });
  }

  // Ajax로 비디오 모달 로드
  async loadVideoModal(videoId) {
    try {
      // 기존 모달이 있으면 제거
      this.destroyModal();

      const videoData = this.videos.find((v) => v.id === videoId);
      if (!videoData) {
        throw new Error("비디오 데이터를 찾을 수 없습니다");
      }

      const modalType = videoData.type || "main";
      let modalPath = "./_modal/video.html";

      if (modalType !== "main") {
        modalPath = `./_modal/video-${modalType}.html`;
      }

      const response = await fetch(
        `${modalPath}?id=${videoId}&t=${Date.now()}`
      );
      if (!response.ok) {
        throw new Error(`모달 로드 실패: ${modalPath}`);
      }

      const modalHTML = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(modalHTML, "text/html");

      const modalElement = doc.querySelector(".modal.video");
      if (!modalElement) {
        throw new Error("모달 요소를 찾을 수 없습니다");
      }

      modalElement.id = "videoModal";
      modalElement.setAttribute("data-type", modalType);

      // DOM에 먼저 추가
      document.body.appendChild(modalElement);
      this.currentModal = modalElement;

      // iframe에 비디오 URL 설정
      const iframe = modalElement.querySelector("#videoFrame");
      if (iframe) {
        iframe.src = `https://www.youtube.com/embed/${videoData.url}?autoplay=1`;
      }

      // 모달 컨텐츠 업데이트
      this.updateModalContent(modalElement, videoData);

      // DOM에 추가된 후 스크립트 실행
      this.executeModalScripts(modalElement);

      // 모달 표시 및 이벤트 설정 (충분한 지연시간 확보)
      setTimeout(() => {
        modalElement.style.display = "block";
        // display 후 브라우저 렌더링 대기
        setTimeout(() => {
          this.setupModalEvents(modalType);
        }, 100);
      }, 50);

      // 닫기 이벤트 설정
      this.setupModalCloseEvents(modalElement);
    } catch (error) {
      console.error("모달 로드 오류:", error);
      alert("비디오를 로드하는 중 오류가 발생했습니다.");
    }
  }

  // 스크립트 실행
  executeModalScripts(modalElement) {
    const scripts = modalElement.querySelectorAll("script");

    scripts.forEach((oldScript, index) => {
      const newScript = document.createElement("script");

      if (oldScript.type) {
        newScript.type = oldScript.type;
      }

      if (oldScript.src) {
        // 외부 스크립트
        newScript.src = oldScript.src;
        newScript.onload = () => {
          console.log(`외부 스크립트 로드 완료: ${oldScript.src}`);
        };
        newScript.onerror = (e) => {
          console.error(`외부 스크립트 로드 실패: ${oldScript.src}`, e);
        };
      } else {
        // 인라인 스크립트
        newScript.textContent = oldScript.textContent;
        console.log(`인라인 스크립트 실행 #${index + 1}`);
      }

      // 기존 스크립트를 새 스크립트로 교체
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  // 타입별 이벤트 설정
  setupModalEvents(modalType) {
    console.log("모달 이벤트 설정:", modalType);

    switch (modalType) {
      case "main":
        this.setupCommentResizer();
        this.setupCommentBox();
        // 다단계 높이 측정 시스템
        this.initializeHeightAdjustment();
        break;

      case "comment":
        this.setupCommentBox();
        this.adjustCommentOnlyLayout();
        break;

      case "essential":
        this.setupEssentialLayout();
        break;

      case "learning":
        this.setupLearningLayout();
        break;

      default:
        console.warn("알 수 없는 모달 타입:", modalType);
    }
  }

  // 높이 조정 초기화 - 다단계 시도 + Observer
  initializeHeightAdjustment() {
    // 1단계: 즉시 시도
    this.adjustVideoListHeight();

    // 2단계: requestAnimationFrame (2프레임 대기)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.adjustVideoListHeight();
      });
    });

    // 3단계: 50ms 후 시도
    setTimeout(() => {
      this.adjustVideoListHeight();
    }, 50);

    // 4단계: 100ms 후 시도
    setTimeout(() => {
      this.adjustVideoListHeight();
    }, 100);

    // 5단계: 200ms 후 시도
    setTimeout(() => {
      this.adjustVideoListHeight();
    }, 200);

    // 6단계: ResizeObserver 설정 (컨테이너 크기 변화 감지)
    this.setupResizeObserver();

    // 7단계: MutationObserver 설정 (DOM 변화 감지)
    this.setupMutationObserver();

    // 8단계: 이미지 로딩 대기
    this.waitForImagesAndAdjust();
  }

  // ResizeObserver 설정
  setupResizeObserver() {
    const videoSide = this.currentModal?.querySelector(".video-side");
    const commentWrap = this.currentModal?.querySelector(".comment-wrap");

    if (!videoSide) return;

    // 기존 observer 정리
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      // 디바운스 처리
      clearTimeout(this.heightAdjustTimer);
      this.heightAdjustTimer = setTimeout(() => {
        console.log("ResizeObserver 감지: 높이 재조정");
        this.adjustVideoListHeight();
      }, 50);
    });

    this.resizeObserver.observe(videoSide);
    if (commentWrap) {
      this.resizeObserver.observe(commentWrap);
    }
  }

  // MutationObserver 설정
  setupMutationObserver() {
    const videoList = this.currentModal?.querySelector(".video-list");

    if (!videoList) return;

    // 기존 observer 정리
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    this.mutationObserver = new MutationObserver((mutations) => {
      // 디바운스 처리
      clearTimeout(this.heightAdjustTimer);
      this.heightAdjustTimer = setTimeout(() => {
        console.log("MutationObserver 감지: 높이 재조정");
        this.adjustVideoListHeight();
      }, 50);
    });

    this.mutationObserver.observe(videoList, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
  }

  // 이미지 로딩 대기 후 높이 조정
  async waitForImagesAndAdjust() {
    const videoSide = this.currentModal?.querySelector(".video-side");
    if (!videoSide) return;

    const images = videoSide.querySelectorAll("img");

    if (images.length === 0) {
      console.log("이미지 없음");
      return;
    }

    console.log(`이미지 ${images.length}개 로딩 대기 중...`);

    const imagePromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();

      return new Promise((resolve) => {
        img.onload = () => {
          console.log("이미지 로드 완료:", img.src);
          resolve();
        };
        img.onerror = () => {
          console.warn("이미지 로드 실패:", img.src);
          resolve();
        };

        // 10초 타임아웃
        setTimeout(resolve, 10000);
      });
    });

    await Promise.all(imagePromises);

    console.log("모든 이미지 로딩 완료: 높이 재조정");
    this.adjustVideoListHeight();
  }

  // 댓글 전용 레이아웃 조정
  adjustCommentOnlyLayout() {
    const commentWrap = this.currentModal?.querySelector(".comment-wrap");
    if (commentWrap) {
      this.setupCommentResizer();
      this.setupCommentBox();
    }
  }

  // 필수 교육 레이아웃 설정
  setupEssentialLayout() {
    console.log("필수 교육 레이아웃 설정");
    // 예: 진도율 표시, 완료 체크 등
  }

  // 학습 레이아웃 설정
  setupLearningLayout() {
    console.log("학습 레이아웃 설정");
    // 예: 퀴즈, 학습 노트 등
  }

  // 높이 조정 (main 타입 전용)
  adjustVideoListHeight() {
    const videoSide = this.currentModal?.querySelector(".video-side");
    const videoHeader = this.currentModal?.querySelector(".video-header");
    const videoList = this.currentModal?.querySelector(".video-list");
    const commentWrap = this.currentModal?.querySelector(".comment-wrap");

    if (!videoSide || !videoHeader || !videoList) {
      console.warn("필요한 요소를 찾을 수 없습니다 (main 타입만 사용)");
      return;
    }

    // 전체 높이
    const totalHeight = videoSide.clientHeight;

    // 높이가 0이거나 비정상적으로 작으면 DOM이 아직 렌더링되지 않은 것
    if (totalHeight < 100) {
      console.warn(
        `videoSide 높이가 비정상적으로 작습니다: ${totalHeight}px. 재측정 예약...`
      );
      // 최대 3번까지만 재시도
      if (!this._retryCount) this._retryCount = 0;
      if (this._retryCount < 3) {
        this._retryCount++;
        setTimeout(() => this.adjustVideoListHeight(), 100);
      } else {
        console.error("높이 측정 재시도 횟수 초과");
        this._retryCount = 0;
      }
      return;
    }

    // 재시도 카운터 초기화
    this._retryCount = 0;

    // 헤더와 댓글박스 높이
    const headerHeight = videoHeader.offsetHeight;
    const commentHeight = commentWrap ? commentWrap.offsetHeight : 0;

    // 리스트에 사용 가능한 최대 높이
    const availableHeight = totalHeight - headerHeight - commentHeight;

    // 사용 가능한 높이가 음수이거나 너무 작으면 경고
    if (availableHeight < 50) {
      console.warn(`사용 가능한 높이가 너무 작습니다: ${availableHeight}px`);
      return;
    }

    // 리스트의 실제 컨텐츠 높이
    const listContentHeight = videoList.scrollHeight;

    // 컨텐츠가 적으면 컨텐츠 높이만큼, 많으면 사용 가능한 높이만큼
    const listHeight = Math.min(listContentHeight, availableHeight);

    // 최소 높이 보장
    const finalHeight = Math.max(listHeight, 100);

    console.log("높이 측정 성공:", {
      totalHeight,
      headerHeight,
      commentHeight,
      availableHeight,
      listContentHeight,
      listHeight,
      finalHeight,
    });

    videoList.style.height = finalHeight + "px";
    videoList.style.overflowY =
      listContentHeight > availableHeight ? "auto" : "hidden";
  }

  // 댓글 리사이저 (main, comment 타입에서 사용)
  setupCommentResizer() {
    const resizer = this.currentModal?.querySelector(".comment-resizer");
    const commentListWrap =
      this.currentModal?.querySelector(".comment-list-wrap");
    const commentWrap = this.currentModal?.querySelector(".comment-wrap");
    const videoSide = this.currentModal?.querySelector(".video-side");

    if (!resizer || !commentListWrap || !commentWrap) {
      console.warn("리사이저 요소를 찾을 수 없습니다");
      return;
    }

    let isResizing = false;
    let startY = 0;
    let startHeight = 0;
    const minHeight = 52;
    const maxHeight = 600;

    // 댓글 유무 확인
    const commentList = commentListWrap.querySelector(".comment-list");
    const hasComments = commentList && commentList.children.length > 0;

    // 초기 높이 설정: 댓글이 있으면 52px, 없으면 0px
    const initialHeight = hasComments ? 52 : 0;
    commentListWrap.style.height = initialHeight + "px";

    console.log(
      `댓글 리사이저 초기화: 댓글 ${hasComments ? "있음" : "없음"} (${initialHeight}px)`
    );

    // 댓글이 없으면 리사이저 숨김
    if (!hasComments) {
      resizer.style.display = "none";
    } else {
      resizer.style.display = "block";
    }

    resizer.addEventListener("mousedown", (e) => {
      isResizing = true;
      startY = e.clientY;
      startHeight = commentListWrap.offsetHeight;

      resizer.classList.add("resizing");
      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";

      e.preventDefault();
    });

    const onMouseMove = (e) => {
      if (!isResizing) return;

      const delta = startY - e.clientY;
      const newHeight = Math.min(
        Math.max(startHeight + delta, minHeight),
        maxHeight
      );

      commentListWrap.style.height = newHeight + "px";

      if (videoSide) {
        // 리사이즈 중에는 requestAnimationFrame으로 부드럽게
        requestAnimationFrame(() => {
          this.adjustVideoListHeight();
        });
      }
    };

    const onMouseUp = () => {
      if (!isResizing) return;

      isResizing = false;
      resizer.classList.remove("resizing");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    this.resizerCleanup = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }

  // 댓글 입력 기능
  setupCommentBox() {
    const textarea = this.currentModal?.querySelector(".comment-box textarea");
    const btnCancel = this.currentModal?.querySelector(".btn-cancel");
    const btnSave = this.currentModal?.querySelector(".btn-save");

    if (!textarea || !btnCancel || !btnSave) {
      console.warn("댓글 박스 요소를 찾을 수 없습니다");
      return;
    }

    textarea.addEventListener("input", (e) => {
      const hasValue = e.target.value.trim().length > 0;

      if (hasValue) {
        btnCancel.removeAttribute("disabled");
        btnSave.removeAttribute("disabled");
        btnSave.classList.add("btn-active");
      } else {
        btnCancel.setAttribute("disabled", "disabled");
        btnSave.setAttribute("disabled", "disabled");
        btnSave.classList.remove("btn-active");
      }
    });

    btnCancel.addEventListener("click", (e) => {
      e.preventDefault();
      textarea.value = "";
      btnCancel.setAttribute("disabled", "disabled");
      btnSave.setAttribute("disabled", "disabled");
      btnSave.classList.remove("btn-active");
      textarea.focus();
    });

    btnSave.addEventListener("click", (e) => {
      e.preventDefault();
      const comment = textarea.value.trim();
      if (comment) {
        console.log("댓글 작성:", comment);

        // TODO: 실제 댓글 추가 로직
        // 댓글이 추가되면 리사이저와 comment-list-wrap 표시
        this.showCommentSection();

        textarea.value = "";
        btnCancel.setAttribute("disabled", "disabled");
        btnSave.setAttribute("disabled", "disabled");
        btnSave.classList.remove("btn-active");
      }
    });
  }

  // 댓글 섹션 표시 (첫 댓글 작성 시)
  showCommentSection() {
    const commentListWrap =
      this.currentModal?.querySelector(".comment-list-wrap");
    const resizer = this.currentModal?.querySelector(".comment-resizer");

    if (!commentListWrap || !resizer) return;

    // 현재 높이가 0이면 댓글 섹션 표시
    if (commentListWrap.offsetHeight === 0) {
      commentListWrap.style.height = "52px";
      resizer.style.display = "block";

      console.log("첫 댓글 추가: 댓글 섹션 표시 (52px)");

      // 높이 재조정
      requestAnimationFrame(() => {
        this.adjustVideoListHeight();
      });
    }
  }

  // 모달 컨텐츠 업데이트
  updateModalContent(modal, videoData) {
    const metaEm = modal.querySelector(".meta em");
    const hasSubcate = videoData.subcate && videoData.subcate.trim() !== "";

    const categorySpan = modal.querySelector(".meta span");
    if (categorySpan) {
      categorySpan.textContent = hasSubcate
        ? videoData.category + " ＞ "
        : videoData.category;
    }

    const titleH3 = modal.querySelector(".tit-box h3");
    if (titleH3) {
      titleH3.textContent = videoData.title;
    }

    if (metaEm) {
      if (hasSubcate) {
        metaEm.textContent = videoData.subcate;
        metaEm.style.display = "";
      } else {
        metaEm.textContent = "";
        metaEm.style.display = "none";
      }
    }
  }

  // 모달 닫기 이벤트 설정
  setupModalCloseEvents(modal) {
    const closeBtn = modal.querySelector(".close");
    if (closeBtn) {
      closeBtn.onclick = () => {
        this.destroyModal();
      };
    }

    modal.onclick = (e) => {
      if (e.target === modal) {
        this.destroyModal();
      }
    };

    const escHandler = (e) => {
      if (e.key === "Escape") {
        this.destroyModal();
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);
  }

  // 모달 소멸
  destroyModal() {
    if (this.currentModal) {
      // Observer들 정리
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }

      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }

      // 타이머 정리
      if (this.heightAdjustTimer) {
        clearTimeout(this.heightAdjustTimer);
        this.heightAdjustTimer = null;
      }

      // 리사이저 이벤트 리스너 제거
      if (this.resizerCleanup) {
        this.resizerCleanup();
        this.resizerCleanup = null;
      }

      // 재시도 카운터 초기화
      this._retryCount = 0;

      // 비디오 중지
      const iframe = this.currentModal.querySelector("#videoFrame");
      if (iframe) {
        iframe.src = "";
      }

      // 페이드아웃 효과
      this.currentModal.style.opacity = "0";

      setTimeout(() => {
        if (this.currentModal && this.currentModal.parentNode) {
          this.currentModal.parentNode.removeChild(this.currentModal);
        }
        this.currentModal = null;
      }, 300);
    }
  }
}
