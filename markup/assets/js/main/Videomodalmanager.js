// ============================================
// 비디오 모달 관리 모듈 (VideoModalBase 활용)
// 공통 모듈 활용 (ErrorHandler, DOMUtils, EventManager, Utils)
// ============================================

class VideoModalManager extends VideoModalBase {
  constructor(config, dependencies = {}) {
    // 입력값 유효성 검증 (super 호출 전에 가능한 작업만)
    if (!config || typeof config !== 'object') {
      config = {};
    }

    // VideoModalBase에 전달할 config 준비
    const baseConfig = {
      videos: config.videos || [],
      modalPath: config.modalPath || "./_modal/video.html",
      modalPathTemplate: config.modalPathTemplate || "./_modal/video-{type}.html",
      enableHeightAdjustment: config.enableHeightAdjustment !== false,
      enableCommentResizer: config.enableCommentResizer !== false,
      enableCommentBox: config.enableCommentBox !== false,
      ...config,
    };

    // 부모 클래스 생성자 호출 (반드시 먼저 호출)
    super(baseConfig);

    // 의존성 주입 (폴백 포함) - super() 호출 후
    this.domUtils = dependencies.domUtils || (typeof DOMUtils !== 'undefined' ? DOMUtils : null);
    this.errorHandler = dependencies.errorHandler || (typeof ErrorHandler !== 'undefined' ? ErrorHandler : null);
    this.eventManager = dependencies.eventManager || (typeof eventManager !== 'undefined' ? eventManager : null);
    this.utils = dependencies.utils || (typeof Utils !== 'undefined' ? Utils : null);
    this.animationUtils = dependencies.animationUtils || (typeof AnimationUtils !== 'undefined' ? AnimationUtils : null);

    // 이벤트 리스너 ID 저장 (정리용)
    this.listenerIds = [];

    try {
      // 추가 초기화 작업
    } catch (error) {
      this._handleError(error, 'constructor');
    }
  }

  /**
   * 에러 처리 헬퍼
   * @private
   */
  _handleError(error, context, additionalInfo = {}) {
    if (this.errorHandler) {
      this.errorHandler.handle(error, {
        context: `VideoModalManager.${context}`,
        component: 'VideoModalManager',
        ...additionalInfo
      }, false);
    } else {
      console.error(`[VideoModalManager] ${context}:`, error, additionalInfo);
    }
  }

  // 초기화
  init() {
    try {
      this.setupCardClickEvents();
    } catch (error) {
      this._handleError(error, 'init');
    }
  }

  // 카드 클릭 이벤트 설정 (DOMUtils, EventManager 활용)
  setupCardClickEvents() {
    try {
      const container = this.domUtils?.$("#videoCardsContainer") || 
                       (typeof DOMUtils !== 'undefined' ? DOMUtils.$("#videoCardsContainer") : null) ||
                       document.querySelector("#videoCardsContainer");
      
      if (!container) {
        console.warn("[VideoModalManager] videoCardsContainer를 찾을 수 없습니다.");
        return;
      }

      // VideoModalManager 인스턴스를 참조하기 위해 변수에 저장
      const self = this;

      const clickHandler = function(e) {
        try {
          e.preventDefault();
          e.stopPropagation();
          
          // this는 .card 요소, self는 VideoModalManager 인스턴스
          const videoIdAttr = this.getAttribute("data-video-id");
          if (!videoIdAttr) {
            console.warn("[VideoModalManager] data-video-id 속성이 없습니다.");
            return;
          }

          const videoId = parseInt(videoIdAttr, 10);
          if (isNaN(videoId) || videoId <= 0) {
            self._handleError(new Error(`유효하지 않은 videoId: ${videoIdAttr}`), 'setupCardClickEvents.clickHandler');
            return;
          }

          self.openVideo(videoId);
        } catch (error) {
          self._handleError(error, 'setupCardClickEvents.clickHandler');
        }
      };

      // EventManager 또는 DOMUtils.delegate 사용
      if (this.eventManager) {
        const delegateId = this.eventManager.delegate(container, "click", ".card", clickHandler);
        this.listenerIds.push({ element: container, id: delegateId, type: 'delegate', selector: '.card' });
      } else if (this.domUtils && this.domUtils.delegate) {
        this.domUtils.delegate(container, "click", ".card", clickHandler);
      } else if (typeof DOMUtils !== 'undefined' && DOMUtils.delegate) {
        DOMUtils.delegate(container, "click", ".card", clickHandler);
      } else {
        // 폴백: 직접 이벤트 위임 구현
        container.addEventListener("click", function(e) {
          const card = e.target.closest(".card");
          if (card) {
            clickHandler.call(card, e);
          }
        });
      }
    } catch (error) {
      this._handleError(error, 'setupCardClickEvents');
    }
  }

  // 기존 메서드 호환성을 위한 래퍼
  async loadVideoModal(videoId) {
    try {
      // 입력값 유효성 검증
      if (!videoId || (typeof videoId !== 'number' && typeof videoId !== 'string')) {
        this._handleError(new Error(`유효하지 않은 videoId: ${videoId}`), 'loadVideoModal');
        return null;
      }

      const id = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
      if (isNaN(id) || id <= 0) {
        this._handleError(new Error(`유효하지 않은 videoId: ${videoId}`), 'loadVideoModal');
        return null;
      }

      return await this.openVideo(id);
    } catch (error) {
      this._handleError(error, 'loadVideoModal', { videoId });
      return null;
    }
  }

  // 기존 코드 호환성을 위한 래퍼 메서드들
  get currentModal() {
    try {
      return this.currentModalElement;
    } catch (error) {
      this._handleError(error, 'currentModal.get');
      return null;
    }
  }

  set currentModal(value) {
    try {
      this.currentModalElement = value;
    } catch (error) {
      this._handleError(error, 'currentModal.set', { value });
    }
  }

  // 기존 메서드 호환성 유지 (VideoModalBase의 메서드 사용)
  adjustVideoListHeight() {
    try {
      if (this.currentModalElement) {
        super.adjustVideoListHeight(this.currentModalElement);
      }
    } catch (error) {
      this._handleError(error, 'adjustVideoListHeight');
    }
  }

  setupCommentResizer() {
    try {
      if (this.currentModalElement) {
        super.setupCommentResizer(this.currentModalElement);
      }
    } catch (error) {
      this._handleError(error, 'setupCommentResizer');
    }
  }

  setupCommentBox() {
    try {
      if (this.currentModalElement) {
        super.setupCommentBox(this.currentModalElement);
      }
    } catch (error) {
      this._handleError(error, 'setupCommentBox');
    }
  }

  showCommentSection() {
    try {
      if (this.currentModalElement) {
        super.showCommentSection(this.currentModalElement);
      }
    } catch (error) {
      this._handleError(error, 'showCommentSection');
    }
  }

  adjustCommentOnlyLayout() {
    try {
      if (this.currentModalElement) {
        super.adjustCommentOnlyLayout(this.currentModalElement);
      }
    } catch (error) {
      this._handleError(error, 'adjustCommentOnlyLayout');
    }
  }

  setupEssentialLayout() {
    try {
      if (this.currentModalElement) {
        super.setupEssentialLayout(this.currentModalElement);
      }
    } catch (error) {
      this._handleError(error, 'setupEssentialLayout');
    }
  }

  setupLearningLayout() {
    try {
      if (this.currentModalElement) {
        super.setupLearningLayout(this.currentModalElement);
      }
    } catch (error) {
      this._handleError(error, 'setupLearningLayout');
    }
  }

  initializeHeightAdjustment() {
    try {
      if (this.currentModalElement) {
        super.initializeHeightAdjustment(this.currentModalElement);
      }
    } catch (error) {
      this._handleError(error, 'initializeHeightAdjustment');
    }
  }

  setupResizeObserver() {
    try {
      if (this.currentModalElement) {
        super.setupResizeObserver(this.currentModalElement);
      }
    } catch (error) {
      this._handleError(error, 'setupResizeObserver');
    }
  }

  setupMutationObserver() {
    try {
      if (this.currentModalElement) {
        super.setupMutationObserver(this.currentModalElement);
      }
    } catch (error) {
      this._handleError(error, 'setupMutationObserver');
    }
  }

  async waitForImagesAndAdjust() {
    try {
      if (this.currentModalElement) {
        await super.waitForImagesAndAdjust(this.currentModalElement);
      }
    } catch (error) {
      this._handleError(error, 'waitForImagesAndAdjust');
    }
  }

  destroyModal() {
    try {
      // 이벤트 리스너 제거
      if (this.eventManager && this.listenerIds.length > 0) {
        this.listenerIds.forEach(({ element, id, type }) => {
          if (type === 'delegate') {
            this.eventManager.undelegate(element, id);
          } else {
            this.eventManager.off(element, id);
          }
        });
        this.listenerIds = [];
      }

      // 부모 클래스의 destroy 호출
      if (super.destroy && typeof super.destroy === 'function') {
        super.destroy();
      } else if (this.destroy && typeof this.destroy === 'function') {
        this.destroy();
      }
    } catch (error) {
      this._handleError(error, 'destroyModal');
    }
  }
}
