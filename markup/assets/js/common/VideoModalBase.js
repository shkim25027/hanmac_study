/**
 * 비디오 모달 기본 클래스
 * ModalBase와 VideoBase를 활용한 통합 비디오 모달 모듈
 * @module VideoModalBase
 */

class VideoModalBase extends ModalBase {
  constructor(config = {}) {
    super({
      animation: "fade",
      animationDuration: 300,
      closeOnEscape: true,
      closeOnBackdrop: true,
      ...config,
    });

    this.config = {
      // 비디오 관련 설정
      videos: config.videos || [],
      modalPath: config.modalPath || "./_modal/video.html",
      modalPathTemplate: config.modalPathTemplate || "./_modal/video-{type}.html",
      
      // 이벤트 콜백
      onVideoLoad: config.onVideoLoad || null,
      onModalReady: config.onModalReady || null,
      
      // 레이아웃 설정
      enableHeightAdjustment: config.enableHeightAdjustment !== false,
      enableCommentResizer: config.enableCommentResizer !== false,
      enableCommentBox: config.enableCommentBox !== false,
      
      ...config,
    };

    this.currentVideo = null;
    this.currentModalElement = null;
    this.resizeObserver = null;
    this.mutationObserver = null;
    this.heightAdjustTimer = null;
    this.resizerCleanup = null;
    this._retryCount = 0;
    this._isAdjustingHeight = false;
    this._pendingHeightAdjust = null; // 배치 처리를 위한 대기 중인 조정
    this._lastHeightValues = {}; // 마지막 높이 값 캐시 (불필요한 재계산 방지)
  }

  /**
   * 비디오 모달 로드 및 열기
   * @param {number|string|Object} videoIdOrData - 비디오 ID 또는 비디오 데이터 객체
   * @returns {Promise}
   */
  async openVideo(videoIdOrData) {
    try {
      // 기존 모달 정리
      this.destroy();

      // 비디오 데이터 가져오기
      let videoData;
      if (typeof videoIdOrData === "object") {
        videoData = videoIdOrData;
      } else {
        const videoId = typeof videoIdOrData === "string" ? parseInt(videoIdOrData) : videoIdOrData;
        videoData = this.config.videos.find((v) => v.id === videoId);
      }

      if (!videoData) {
        throw new Error("비디오 데이터를 찾을 수 없습니다");
      }

      this.currentVideo = videoData;

      // 모달 타입 결정
      const modalType = videoData.type || "main";
      
      // 모달 HTML 로드
      const modalHTML = await this.loadModalHTML(modalType);
      
      // 모달 생성
      const modalElement = this.createModalFromHTML(modalHTML, modalType);
      
      // DOM에 추가
      document.body.appendChild(modalElement);
      this.currentModalElement = modalElement;

      // 비디오 설정
      this.setupVideo(modalElement, videoData);

      // 모달 컨텐츠 업데이트
      this.updateModalContent(modalElement, videoData);

      // 스크립트 실행
      this.executeModalScripts(modalElement);

      // 모달 열기 (애니메이션)
      await Utils.delay(50);
      await AnimationUtils.fade(modalElement, "in", 300);

      // user-text 높이 조정 (모달이 완전히 열린 후)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.adjustUserTextHeights(modalElement);
        });
      });
      await Utils.delay(100);

      // 이벤트 설정
      this.setupModalEvents(modalType, modalElement);

      // onVideoLoad 콜백
      if (this.config.onVideoLoad) {
        await this.config.onVideoLoad(videoData, modalElement);
      }

      // onModalReady 콜백
      if (this.config.onModalReady) {
        await this.config.onModalReady(modalElement);
      }

      // body 스크롤 잠금
      if (typeof bodyLock === "function") {
        bodyLock();
      }

      return this;
    } catch (error) {
      console.error("비디오 모달 로드 오류:", error);
      if (typeof alert === "function") {
        alert("비디오를 로드하는 중 오류가 발생했습니다.");
      }
      throw error;
    }
  }

  /**
   * 모달 HTML 로드
   * @param {string} modalType - 모달 타입
   * @returns {Promise<string>}
   */
  async loadModalHTML(modalType) {
    let modalPath = this.config.modalPath;

    if (modalType !== "main" && this.config.modalPathTemplate) {
      modalPath = this.config.modalPathTemplate.replace("{type}", modalType);
    }

    if (!modalPath) {
      throw new Error("모달 경로가 설정되지 않았습니다");
    }

    const response = await fetch(`${modalPath}?t=${Date.now()}`);
    if (!response.ok) {
      throw new Error(`모달 로드 실패: ${modalPath}`);
    }

    return await response.text();
  }

  /**
   * HTML에서 모달 요소 생성
   * @param {string} modalHTML - 모달 HTML 문자열
   * @param {string} modalType - 모달 타입
   * @returns {HTMLElement}
   */
  createModalFromHTML(modalHTML, modalType) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(modalHTML, "text/html");
    const modalElement = doc.querySelector(".modal.video");

    if (!modalElement) {
      throw new Error("모달 요소를 찾을 수 없습니다");
    }

    modalElement.id = "videoModal";
    modalElement.setAttribute("data-type", modalType);

    return modalElement;
  }

  /**
   * 비디오 설정
   * @param {HTMLElement} modalElement - 모달 요소
   * @param {Object} videoData - 비디오 데이터
   */
  setupVideo(modalElement, videoData) {
    const iframe = DOMUtils.$("#videoFrame", modalElement);
    if (iframe) {
      let videoId;
      
      // VideoModel 사용 (있는 경우)
      if (typeof VideoModel !== "undefined") {
        const videoModel = videoData instanceof VideoModel 
          ? videoData 
          : new VideoModel(videoData);
        
        videoId = videoModel.getVideoId 
          ? videoModel.getVideoId() 
          : videoData.url || videoData.id;
      } else {
        // VideoModel이 없으면 직접 사용
        videoId = videoData.url || videoData.id;
      }
      
      // VideoBase를 사용하여 YouTube URL 생성
      iframe.src = VideoBase.getYouTubeUrl(videoId, { autoplay: 1 });
    }
  }

  /**
   * 모달 컨텐츠 업데이트
   * @param {HTMLElement} modalElement - 모달 요소
   * @param {Object} videoData - 비디오 데이터
   */
  updateModalContent(modalElement, videoData) {
    const metaEm = modalElement.querySelector(".meta em");
    const hasSubcate = videoData.subcate && videoData.subcate.trim() !== "";

    const categorySpan = modalElement.querySelector(".meta span");
    if (categorySpan) {
      categorySpan.textContent = hasSubcate
        ? videoData.category
        : videoData.category;
    }

    const titleH3 = modalElement.querySelector(".tit-box h3");
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

  /**
   * 모달 스크립트 실행
   * @param {HTMLElement} modalElement - 모달 요소
   */
  executeModalScripts(modalElement) {
    const scripts = DOMUtils.$$("script", modalElement);

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

  /**
   * 타입별 이벤트 설정
   * @param {string} modalType - 모달 타입
   * @param {HTMLElement} modalElement - 모달 요소
   */
  setupModalEvents(modalType, modalElement) {
    console.log("모달 이벤트 설정:", modalType);

    // 닫기 이벤트 설정
    this.setupModalCloseEvents(modalElement);

    // 타입별 이벤트 설정
    switch (modalType) {
      case "main":
        if (this.config.enableCommentResizer) {
          this.setupCommentResizer(modalElement);
        }
        if (this.config.enableCommentBox) {
          this.setupCommentBox(modalElement);
        }
        if (this.config.enableHeightAdjustment) {
          this.initializeHeightAdjustment(modalElement);
        }
        break;

      case "comment":
        if (this.config.enableCommentBox) {
          this.setupCommentBox(modalElement);
        }
        this.adjustCommentOnlyLayout(modalElement);
        break;

      case "essential":
        this.setupEssentialLayout(modalElement);
        break;

      case "learning":
        this.setupLearningLayout(modalElement);
        break;

      default:
        console.warn("알 수 없는 모달 타입:", modalType);
    }
  }

  /**
   * 모달 닫기 이벤트 설정
   * @param {HTMLElement} modalElement - 모달 요소
   */
  setupModalCloseEvents(modalElement) {
    const closeBtn = modalElement.querySelector(".close");
    if (closeBtn) {
      closeBtn.onclick = () => {
        this.close();
      };
    }

    modalElement.onclick = (e) => {
      if (e.target === modalElement) {
        this.close();
      }
    };

    const escHandler = (e) => {
      if (e.key === "Escape") {
        this.close();
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);
  }

  /**
   * 모달 닫기 (오버라이드)
   * @returns {Promise}
   */
  async close() {
    if (this.currentModalElement) {
      // 비디오 중지
      const iframe = this.currentModalElement.querySelector("#videoFrame");
      if (iframe) {
        VideoBase.stop(iframe);
      }

      // Observer들 정리
      this.cleanupObservers();

      // 페이드아웃 효과
      await AnimationUtils.fade(this.currentModalElement, "out", 300);

      // DOM에서 제거
      if (this.currentModalElement.parentNode) {
        this.currentModalElement.parentNode.removeChild(this.currentModalElement);
      }
    }

    this.currentModalElement = null;
    this.currentVideo = null;

    // body 스크롤 해제
    if (typeof bodyUnlock === "function") {
      bodyUnlock();
    }

    return this;
  }

  /**
   * 모달 파괴 (오버라이드)
   */
  destroy() {
    this.cleanupObservers();
    this.close();
  }

  /**
   * Observer 정리
   */
  cleanupObservers() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    if (this.heightAdjustTimer) {
      clearTimeout(this.heightAdjustTimer);
      this.heightAdjustTimer = null;
    }

    if (this.resizerCleanup) {
      this.resizerCleanup();
      this.resizerCleanup = null;
    }

    this._retryCount = 0;
  }

  // ========================================
  // 레이아웃 관련 메서드 (기존 로직 유지)
  // ========================================

  /**
   * 높이 조정 초기화 (리플로우 최적화)
   * @param {HTMLElement} modalElement - 모달 요소
   */
  initializeHeightAdjustment(modalElement) {
    // 1단계: 즉시 시도 (첫 렌더링)
    this._scheduleHeightAdjust(modalElement);

    // 2단계: requestAnimationFrame (2프레임 대기)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this._scheduleHeightAdjust(modalElement);
      });
    });

    // 3-5단계: 지연 시도 (배치 처리)
    [50, 100, 200].forEach((delay) => {
      setTimeout(() => {
        this._scheduleHeightAdjust(modalElement);
      }, delay);
    });

    // 6단계: ResizeObserver 설정
    this.setupResizeObserver(modalElement);

    // 7단계: MutationObserver 설정
    this.setupMutationObserver(modalElement);

    // 8단계: 이미지 로딩 대기
    this.waitForImagesAndAdjust(modalElement);
  }

  /**
   * 높이 조정 스케줄링 (리플로우 최소화를 위한 배치 처리)
   * @private
   * @param {HTMLElement} modalElement - 모달 요소
   */
  _scheduleHeightAdjust(modalElement) {
    if (this._pendingHeightAdjust) {
      cancelAnimationFrame(this._pendingHeightAdjust);
    }
    this._pendingHeightAdjust = requestAnimationFrame(() => {
      this.adjustVideoListHeight(modalElement);
      this._pendingHeightAdjust = null;
    });
  }

  /**
   * ResizeObserver 설정
   * @param {HTMLElement} modalElement - 모달 요소
   */
  setupResizeObserver(modalElement) {
    const videoSide = modalElement?.querySelector(".video-side");
    const commentWrap = modalElement?.querySelector(".comment-wrap");

    if (!videoSide) return;

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    // throttled 높이 조정 함수 (리플로우 최소화)
    const throttledAdjustHeight = Utils.throttle(() => {
      this._scheduleHeightAdjust(modalElement);
    }, 100); // 100ms throttle

    this.resizeObserver = new ResizeObserver((entries) => {
      throttledAdjustHeight();
    });

    this.resizeObserver.observe(videoSide);
    if (commentWrap) {
      this.resizeObserver.observe(commentWrap);
    }
  }

  /**
   * MutationObserver 설정
   * @param {HTMLElement} modalElement - 모달 요소
   */
  setupMutationObserver(modalElement) {
    const videoList = modalElement?.querySelector(".video-list");

    if (!videoList) return;

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    // throttled 높이 조정 함수 (리플로우 최소화)
    const throttledAdjustHeight = Utils.throttle(() => {
      this._scheduleHeightAdjust(modalElement);
    }, 100); // 100ms throttle

    this.mutationObserver = new MutationObserver((mutations) => {
      throttledAdjustHeight();
    });

    this.mutationObserver.observe(videoList, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
  }

  /**
   * 이미지 로딩 대기 후 높이 조정
   * @param {HTMLElement} modalElement - 모달 요소
   */
  async waitForImagesAndAdjust(modalElement) {
    const videoSide = modalElement?.querySelector(".video-side");
    if (!videoSide) return;

    const images = videoSide.querySelectorAll("img");

    if (images.length === 0) {
      return;
    }

    console.log(`이미지 ${images.length}개 로딩 대기 중...`);

    const imagePromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();

      return new Promise((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        setTimeout(resolve, 10000); // 10초 타임아웃
      });
    });

    await Promise.all(imagePromises);
    console.log("모든 이미지 로딩 완료: 높이 재조정");
    this.adjustVideoListHeight(modalElement);
  }

  /**
   * 높이 조정 (main, learning, onboarding 타입 지원)
   * @param {HTMLElement} modalElement - 모달 요소
   */
  adjustVideoListHeight(modalElement) {
    const videoSide = modalElement?.querySelector(".video-side");
    const videoHeader = modalElement?.querySelector(".video-header");
    const videoList = modalElement?.querySelector(".video-list");
    const learningList = modalElement?.querySelector(".learning-list");
    const commentWrap = modalElement?.querySelector(".comment-wrap");

    // learning-list가 있으면 더 상세한 계산 사용, 없으면 video-list 사용
    const targetList = learningList || videoList;

    if (!videoSide || !videoHeader || !targetList) {
      console.warn("[VideoModalBase] 필요한 요소를 찾을 수 없습니다");
      return false;
    }

    // 높이 조정 중 플래그 설정
    if (!this._isAdjustingHeight) {
      this._isAdjustingHeight = true;
    }

    // 스크롤 위치 저장
    const savedScrollTop = targetList.scrollTop;

    // 전체 높이
    const totalHeight = videoSide.clientHeight;

    // 높이가 0이거나 비정상적으로 작으면 DOM이 아직 렌더링되지 않은 것
    if (totalHeight < 100) {
      console.warn(
        `[VideoModalBase] videoSide 높이가 비정상적으로 작습니다: ${totalHeight}px. 재측정 예약...`
      );

      // 최대 3번까지만 재시도
      if (!this._retryCount) this._retryCount = 0;
      if (this._retryCount < 3) {
        this._retryCount++;
        this._isAdjustingHeight = false;
        setTimeout(() => this.adjustVideoListHeight(modalElement), 100);
      } else {
        console.error("[VideoModalBase] 높이 측정 재시도 횟수 초과");
        this._retryCount = 0;
        this._isAdjustingHeight = false;
      }
      return false;
    }

    // 재시도 카운터 초기화
    this._retryCount = 0;

    // 헤더 높이
    const headerHeight = videoHeader.offsetHeight;

    // comment-wrap 높이
    const commentWrapHeight = commentWrap ? commentWrap.offsetHeight : 0;

    // learning-list가 있는 경우 더 상세한 계산
    let availableHeight;
    if (learningList) {
      // video-list가 있으면 제목과 padding 고려 (learning-list는 video-list 내부에 있음)
      let titleHeight = 0;
      let paddingTop = 0;
      let paddingBottom = 0;
      
      if (videoList) {
        // video-list의 제목 높이
        const videoListTitle = videoList.querySelector("h5.tit");
        titleHeight = videoListTitle ? videoListTitle.offsetHeight : 0;

        // video-list의 padding 값 계산
        const videoListStyle = window.getComputedStyle(videoList);
        paddingTop = parseInt(videoListStyle.paddingTop) || 0;
        paddingBottom = parseInt(videoListStyle.paddingBottom) || 0;
      }

      // learning-list에 사용 가능한 최대 높이
      // learning-list는 video-list 내부에 있으므로 video-list의 제목과 padding을 고려해야 함
      // comment-wrap이 없어도 (commentWrapHeight = 0) 정상 작동
      // commentInfoOffset은 comment-wrap 내부 요소이므로 이미 commentWrapHeight에 포함됨
      availableHeight =
        totalHeight -
        headerHeight -
        commentWrapHeight -
        titleHeight -
        paddingTop -
        paddingBottom -
        10;
    } else {
      // video-list만 있는 경우 (기존 로직)
      availableHeight = totalHeight - headerHeight - commentWrapHeight;
    }

    // 사용 가능한 높이가 음수이거나 너무 작으면 경고
    if (availableHeight < 50) {
      console.warn(
        `[VideoModalBase] 사용 가능한 높이가 너무 작습니다: ${availableHeight}px`
      );
      this._isAdjustingHeight = false;
      return false;
    }

    // 리스트의 실제 컨텐츠 높이 측정 (스타일 제거 후)
    const originalHeight = targetList.style.height;
    const originalOverflow = targetList.style.overflowY;

    targetList.style.height = "auto";
    targetList.style.overflowY = "visible";

    const listContentHeight = targetList.scrollHeight;

    targetList.style.height = originalHeight;
    targetList.style.overflowY = originalOverflow;

    // 컨텐츠가 적으면 컨텐츠 높이만큼, 많으면 사용 가능한 높이만큼
    const listHeight = Math.min(listContentHeight, availableHeight);

    // 최소 높이 보장
    const finalHeight = Math.max(listHeight, 100);

    // 현재 설정된 높이 확인
    const currentHeight = targetList.style.height
      ? parseInt(targetList.style.height)
      : targetList.offsetHeight;

    // 스크롤 필요 여부 확인
    const needsScroll = listContentHeight > availableHeight;

    console.log("[VideoModalBase] 높이 측정 성공:", {
      totalHeight,
      headerHeight,
      commentWrapHeight,
      availableHeight,
      listContentHeight,
      listHeight,
      finalHeight,
      currentHeight,
      needsScroll,
      savedScrollTop,
      hasLearningList: !!learningList,
    });

    // 높이가 실제로 변경되는 경우에만 스타일 업데이트 (리플로우 최소화)
    const heightChanged = Math.abs(currentHeight - finalHeight) > 1;
    
    // 캐시 키 생성
    const cacheKey = `${targetList.className}-${modalElement.id || 'default'}`;
    const lastHeight = this._lastHeightValues[cacheKey];
    
    // 높이가 변경되지 않고, 스크롤 여부도 동일하면 스타일 업데이트 생략
    if (!heightChanged && lastHeight === finalHeight && 
        targetList.style.overflowY === (needsScroll ? "auto" : "hidden")) {
      this._isAdjustingHeight = false;
      return true; // 변경 없음, 조기 종료
    }

    // 스타일 업데이트를 requestAnimationFrame으로 배치
    // learning-list의 height와 overflow-y는 CSS로 관리 (인라인 스타일 제거)
    requestAnimationFrame(() => {
      // learning-list가 아닌 경우에만 height 설정 (video-list만 있는 경우)
      if (heightChanged && !learningList) {
        targetList.style.height = finalHeight + "px";
      }
      // learning-list의 overflow-y는 CSS로 관리
      if (!learningList) {
        targetList.style.overflowY = needsScroll ? "hidden" : "hidden";
      }
      
      // 캐시 업데이트
      this._lastHeightValues[cacheKey] = finalHeight;
    });
    
    // video-list가 별도로 있는 경우에도 스크롤 여부 체크 (리플로우 최소화)
    // overflow-y: hidden 제거, CSS 기본값 사용
    if (videoList && learningList) {
      // learning-list가 있는 경우 video-list는 CSS 기본값 사용 (overflow-y 설정 안 함)
      // learning-list만 스크롤 처리
    } else if (videoList && !learningList) {
      // video-list만 있는 경우 스크롤 여부 체크
      const videoListContentHeight = videoList.scrollHeight;
      const videoListAvailableHeight = videoList.clientHeight;
      const videoListNeedsScroll = videoListContentHeight > videoListAvailableHeight;
      
      // requestAnimationFrame으로 배치하여 리플로우 최소화
      requestAnimationFrame(() => {
        // 스크롤이 필요할 때만 auto 설정, 필요 없을 때는 CSS 기본값 사용
        if (videoListNeedsScroll) {
          videoList.style.overflowY = "auto";
        } else {
          videoList.style.overflowY = ""; // CSS 기본값 사용
        }
      });
    }

    // 컨텐츠 높이를 CSS 변수로 설정 (::before 요소에서 사용)
    if (learningList) {
      learningList.style.setProperty("--scroll-height", `${listContentHeight}px`);
    }

    // 스크롤 위치 복원 (높이 변경 여부와 관계없이)
    requestAnimationFrame(() => {
      targetList.scrollTop = savedScrollTop;
      // 높이 조정 완료 후 플래그 해제
      this._isAdjustingHeight = false;
    });

    return true;
  }

  /**
   * 댓글 전용 레이아웃 조정
   * @param {HTMLElement} modalElement - 모달 요소
   */
  adjustCommentOnlyLayout(modalElement) {
    const commentWrap = modalElement?.querySelector(".comment-wrap");
    if (commentWrap) {
      if (this.config.enableCommentResizer) {
        this.setupCommentResizer(modalElement);
      }
      if (this.config.enableCommentBox) {
        this.setupCommentBox(modalElement);
      }
    }
  }

  /**
   * 필수 교육 레이아웃 설정
   * @param {HTMLElement} modalElement - 모달 요소
   */
  setupEssentialLayout(modalElement) {
    console.log("필수 교육 레이아웃 설정");
    // 예: 진도율 표시, 완료 체크 등
  }

  /**
   * 학습 레이아웃 설정
   * @param {HTMLElement} modalElement - 모달 요소
   */
  setupLearningLayout(modalElement) {
    console.log("학습 레이아웃 설정");
    // 예: 퀴즈, 학습 노트 등
  }

  /**
   * 댓글 리사이저 설정
   * @param {HTMLElement} modalElement - 모달 요소
   */
  setupCommentResizer(modalElement) {
    const resizer = modalElement?.querySelector(".comment-resizer");
    const commentListWrap = modalElement?.querySelector(".comment-list-wrap");
    const commentWrap = modalElement?.querySelector(".comment-wrap");
    const videoSide = modalElement?.querySelector(".video-side");

    if (!resizer || !commentListWrap || !commentWrap) {
      console.warn("리사이저 요소를 찾을 수 없습니다");
      return;
    }

    let isResizing = false;
    let startY = 0;
    let startHeight = 0;
    const minHeight = 52;
    const maxHeight = 600;

    const commentList = commentListWrap.querySelector(".comment-list");
    const hasComments = commentList && commentList.children.length > 0;

    console.log(`댓글 리사이저 초기화: 댓글 ${hasComments ? "있음" : "없음"}`);

    if (!hasComments) {
      resizer.style.display = "none";
      // 댓글이 없으면 높이를 0으로
      commentListWrap.style.height = "0px";
    } else {
      resizer.style.display = "block";
      // 댓글이 있으면 컨텐츠 높이만큼 설정
      this.adjustCommentListWrapHeight(commentListWrap);
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
      const newHeight = Math.min(Math.max(startHeight + delta, minHeight), maxHeight);
      commentListWrap.style.height = newHeight + "px";

      if (videoSide && this.config.enableHeightAdjustment) {
        requestAnimationFrame(() => {
          this.adjustVideoListHeight(modalElement);
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

  /**
   * 댓글 입력 기능 설정
   * @param {HTMLElement} modalElement - 모달 요소
   */
  setupCommentBox(modalElement) {
    const textarea = modalElement?.querySelector(".comment-box textarea");
    const btnCancel = modalElement?.querySelector(".btn-cancel");
    const btnSave = modalElement?.querySelector(".btn-save");

    if (!textarea || !btnCancel || !btnSave) {
      console.warn("댓글 박스 요소를 찾을 수 없습니다");
      return;
    }

    const adjustTextareaHeight = (textareaEl) => {
      // 높이 설정: 1줄=32px, 2줄=52px, 3줄 이상=72px
      const singleLineHeight = 32;
      const twoLineHeight = 52;
      const maxHeight = 72; // 3줄 이상 최대 높이
      
      // 입력값이 없으면 기본 32px로 설정
      if (!textareaEl.value || textareaEl.value.trim().length === 0) {
        textareaEl.style.height = singleLineHeight + "px";
        textareaEl.style.overflowY = "hidden";
        textareaEl.style.overflowX = "hidden";
        return;
      }
      
      // 스크롤바가 보이지 않도록 먼저 overflow를 hidden으로 설정
      textareaEl.style.overflowY = "hidden";
      textareaEl.style.overflowX = "hidden";
      
      // 높이를 auto로 설정하여 실제 컨텐츠 높이 측정
      textareaEl.style.height = "auto";
      
      // 강제 리플로우 (높이 계산을 위해)
      void textareaEl.offsetHeight;
      
      const scrollHeight = textareaEl.scrollHeight;
      const computedStyle = window.getComputedStyle(textareaEl);
      const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
      const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
      const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
      
      // 실제 줄 수 계산을 위한 높이 기준
      const actualSingleLineHeight = lineHeight + paddingTop + paddingBottom;
      const actualTwoLineHeight = (lineHeight * 2) + paddingTop + paddingBottom;
      const actualThreeLineHeight = (lineHeight * 3) + paddingTop + paddingBottom;
      
      // 높이 설정: 1줄=32px, 2줄=52px, 3줄 이상=72px
      if (scrollHeight <= actualSingleLineHeight) {
        // 1줄: 32px
        textareaEl.style.height = singleLineHeight + "px";
        textareaEl.style.overflowY = "hidden";
      } else if (scrollHeight <= actualTwoLineHeight) {
        // 2줄: 52px
        textareaEl.style.height = twoLineHeight + "px";
        textareaEl.style.overflowY = "hidden";
      } else if (scrollHeight <= actualThreeLineHeight) {
        // 3줄: 72px
        textareaEl.style.height = maxHeight + "px";
        textareaEl.style.overflowY = "hidden";
      } else {
        // 3줄 초과: 72px 고정, 스크롤 활성화
        textareaEl.style.height = maxHeight + "px";
        textareaEl.style.overflowY = "auto";
      }
      
      textareaEl.style.overflowX = "hidden";
    };

    adjustTextareaHeight(textarea);

    textarea.addEventListener("input", (e) => {
      const hasValue = e.target.value.trim().length > 0;
      adjustTextareaHeight(e.target);

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
      adjustTextareaHeight(textarea);
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
        this.showCommentSection(modalElement);
        textarea.value = "";
        adjustTextareaHeight(textarea);
        btnCancel.setAttribute("disabled", "disabled");
        btnSave.setAttribute("disabled", "disabled");
        btnSave.classList.remove("btn-active");
      }
    });
  }

  /**
   * 댓글 섹션 표시 (첫 댓글 작성 시)
   * @param {HTMLElement} modalElement - 모달 요소
   */
  showCommentSection(modalElement) {
    const commentListWrap = modalElement?.querySelector(".comment-list-wrap");
    const resizer = modalElement?.querySelector(".comment-resizer");

    if (!commentListWrap || !resizer) return;

    if (commentListWrap.offsetHeight === 0) {
      resizer.style.display = "block";
      // 댓글이 있으면 컨텐츠 높이만큼 설정
      this.adjustCommentListWrapHeight(commentListWrap);
      console.log("첫 댓글 추가: 댓글 섹션 표시 (컨텐츠 높이)");

      if (this.config.enableHeightAdjustment) {
        requestAnimationFrame(() => {
          this.adjustVideoListHeight(modalElement);
        });
      }
    }

    // user-text 높이 조정
    this.adjustUserTextHeights(modalElement);
  }

  /**
   * .comment-list-wrap의 높이를 컨텐츠에 맞게 조정
   * @param {HTMLElement} commentListWrap - 댓글 리스트 래퍼 요소
   */
  adjustCommentListWrapHeight(commentListWrap) {
    if (!commentListWrap) return;

    const modalElement = commentListWrap.closest(".modal");
    if (!modalElement) return;

    const commentList = commentListWrap.querySelector(".comment-list");
    if (!commentList || commentList.children.length === 0) {
      commentListWrap.style.height = "0px";
      // 댓글이 없을 때도 video-list 스크롤 재측정
      if (this.config.enableHeightAdjustment) {
        requestAnimationFrame(() => {
          this.adjustVideoListHeight(modalElement);
        });
      }
      return;
    }

    // 현재 높이 저장
    const originalHeight = commentListWrap.style.height;
    const originalOverflow = commentListWrap.style.overflowY;

    // 높이를 auto로 설정하여 실제 컨텐츠 높이 측정
    commentListWrap.style.height = "auto";
    commentListWrap.style.overflowY = "hidden";

    const scrollHeight = commentListWrap.scrollHeight;
    const computedStyle = window.getComputedStyle(commentListWrap);
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;

    // 컨텐츠 높이 + padding
    const contentHeight = scrollHeight + paddingTop + paddingBottom;

    // 최소 높이 보장 (52px)
    const minHeight = 52;
    const finalHeight = Math.max(contentHeight, minHeight);

    // CSS max-height 제한 확인
    const maxHeight = parseFloat(computedStyle.maxHeight) || Infinity;
    const adjustedHeight = Math.min(finalHeight, maxHeight);

    commentListWrap.style.height = adjustedHeight + "px";
    // overflow-y는 CSS로 관리 (인라인 스타일 제거)
    commentListWrap.style.overflowY = "";

    console.log("[VideoModalBase] comment-list-wrap 높이 조정:", {
      scrollHeight,
      paddingTop,
      paddingBottom,
      contentHeight,
      finalHeight,
      adjustedHeight,
      maxHeight
    });

    // comment-list-wrap 높이가 변경되었으므로 video-list 스크롤 재측정
    if (this.config.enableHeightAdjustment) {
      requestAnimationFrame(() => {
        this.adjustVideoListHeight(modalElement);
      });
    }
  }

  /**
   * .user-text 요소들의 높이를 컨텐츠에 맞게 조정
   * @param {HTMLElement} modalElement - 모달 요소
   */
  adjustUserTextHeights(modalElement) {
    const userTexts = modalElement?.querySelectorAll(".user-text");
    if (!userTexts || userTexts.length === 0) {
      console.log("[VideoModalBase] .user-text 요소를 찾을 수 없습니다");
      return;
    }

    console.log(`[VideoModalBase] .user-text 요소 ${userTexts.length}개 발견`);

    // 먼저 모든 textarea를 완전히 숨김 (깜박임 방지)
    userTexts.forEach((textarea) => {
      // 초기 상태 저장
      const originalVisibility = textarea.style.visibility;
      const originalOpacity = textarea.style.opacity;
      const originalOverflow = textarea.style.overflowY;
      
      // 완전히 숨김 처리
      textarea.style.visibility = "hidden";
      textarea.style.opacity = "0";
      // 스크롤이 보이지 않도록 확실히 설정
      textarea.style.overflowY = "hidden";
      
      // 원래 값 저장 (나중에 복원용)
      textarea._originalStyles = {
        visibility: originalVisibility,
        opacity: originalOpacity,
        overflow: originalOverflow
      };
    });

    // 높이 계산 및 설정
    userTexts.forEach((textarea, index) => {
      // 기본 높이 32px (1줄)
      const defaultHeight = 32;
      
      // 스크롤바가 보이지 않도록 먼저 overflow를 hidden으로 설정
      textarea.style.overflowY = "hidden";
      textarea.style.overflowX = "hidden";
      
      // 높이를 auto로 설정하여 실제 컨텐츠 높이 측정
      // 이때도 overflow는 hidden으로 유지하여 스크롤이 보이지 않도록
      textarea.style.height = "auto";

      // 강제 리플로우 (높이 계산을 위해)
      void textarea.offsetHeight;

      const scrollHeight = textarea.scrollHeight;
      const computedStyle = window.getComputedStyle(textarea);
      const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
      const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
      const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;

      // 1줄 높이 계산
      const singleLineHeight = lineHeight + paddingTop + paddingBottom;
      // 2줄 높이 계산 (2줄 이상부터 컨텐츠 높이 적용)
      const twoLineHeight = (lineHeight * 2) + paddingTop + paddingBottom;

      console.log(`[VideoModalBase] textarea #${index + 1}:`, {
        scrollHeight,
        lineHeight,
        paddingTop,
        paddingBottom,
        singleLineHeight,
        twoLineHeight,
        defaultHeight,
        isTwoLinesOrMore: scrollHeight > twoLineHeight
      });

      // 2줄 이상이면 컨텐츠 높이만큼 설정, 1줄이면 기본 32px 유지
      if (scrollHeight > twoLineHeight) {
        textarea.style.height = scrollHeight + "px";
        textarea.style.overflowY = "hidden";
        textarea.style.overflowX = "hidden";
        console.log(`[VideoModalBase] textarea #${index + 1} 높이 조정: ${scrollHeight}px (2줄 이상)`);
      } else {
        // 1줄이면 기본 32px 유지 (인라인 스타일 제거하여 CSS 기본값 사용)
        textarea.style.height = "";
        textarea.style.overflowY = "hidden"; // overflow는 hidden 유지
        textarea.style.overflowX = "hidden";
        console.log(`[VideoModalBase] textarea #${index + 1} 높이 유지: CSS 기본값 32px (1줄)`);
      }
    });

    // 모든 높이 계산이 완료된 후 한 번에 표시 (2프레임 대기하여 확실히)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        userTexts.forEach((textarea) => {
          // 원래 스타일 복원 또는 기본값으로 설정
          if (textarea._originalStyles) {
            textarea.style.visibility = textarea._originalStyles.visibility || "";
            textarea.style.opacity = textarea._originalStyles.opacity || "";
            // overflow는 hidden 유지 (스크롤 방지)
            textarea.style.overflowY = "hidden";
            delete textarea._originalStyles;
          } else {
            textarea.style.visibility = "";
            textarea.style.opacity = "";
            textarea.style.overflowY = "hidden";
          }
        });
      });
    });
  }
}

// ES6 모듈 내보내기
if (typeof module !== "undefined" && module.exports) {
  module.exports = { VideoModalBase };
}

