// ============================================
// 비디오 슬라이드 모듈 (페이지네이션)
// 공통 모듈 활용 (ErrorHandler, DOMUtils, EventManager, Utils, AnimationUtils)
// ============================================

class VideoSlider {
  constructor(config, dependencies = {}) {
    // 의존성 주입 (폴백 포함)
    this.domUtils = dependencies.domUtils || (typeof DOMUtils !== 'undefined' ? DOMUtils : null);
    this.errorHandler = dependencies.errorHandler || (typeof ErrorHandler !== 'undefined' ? ErrorHandler : null);
    this.eventManager = dependencies.eventManager || (typeof eventManager !== 'undefined' ? eventManager : null);
    this.utils = dependencies.utils || (typeof Utils !== 'undefined' ? Utils : null);
    this.animationUtils = dependencies.animationUtils || (typeof AnimationUtils !== 'undefined' ? AnimationUtils : null);

    // 이벤트 리스너 ID 저장 (정리용)
    this.listenerIds = [];

    try {
      // 입력값 유효성 검증
      if (!config || typeof config !== 'object') {
        this._handleError(new Error('config가 유효하지 않습니다.'), 'constructor');
        config = {};
      }

      this.config = config;
      this.videos = Array.isArray(config.videos) ? config.videos : [];
      this.currentPage = 0;
      this.videosPerPage = config.videosPerPage || 6;

      // config에 videosPerPage가 없으면 설정
      if (!this.config.videosPerPage) {
        this.config.videosPerPage = this.videosPerPage;
      }
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
        context: `VideoSlider.${context}`,
        component: 'VideoSlider',
        ...additionalInfo
      }, false);
    } else {
      console.error(`[VideoSlider] ${context}:`, error, additionalInfo);
    }
  }

  // 초기화
  init() {
    try {
      this.setupEventListeners();
      this.updatePagination();
    } catch (error) {
      this._handleError(error, 'init');
    }
  }

  // 이벤트 리스너 설정 (EventManager 활용)
  setupEventListeners() {
    try {
      const prevBtn = this.domUtils?.$("#prevBtn") || 
                     (typeof DOMUtils !== 'undefined' ? DOMUtils.$("#prevBtn") : null) ||
                     document.querySelector("#prevBtn");
      const nextBtn = this.domUtils?.$("#nextBtn") || 
                     (typeof DOMUtils !== 'undefined' ? DOMUtils.$("#nextBtn") : null) ||
                     document.querySelector("#nextBtn");

      if (!prevBtn || !nextBtn) {
        console.warn("[VideoSlider] 이전/다음 버튼을 찾을 수 없습니다.");
        return;
      }

      // 이전 버튼 클릭 핸들러
      const prevHandler = async (e) => {
        try {
          e.preventDefault();
          e.stopPropagation();
          if (this.currentPage > 0) {
            this.currentPage--;
            await this.changePage();
          }
        } catch (error) {
          this._handleError(error, 'setupEventListeners.prevHandler');
        }
      };

      // 다음 버튼 클릭 핸들러
      const nextHandler = async (e) => {
        try {
          e.preventDefault();
          e.stopPropagation();
          const totalPages = this.getTotalPages();
          if (this.currentPage < totalPages - 1) {
            this.currentPage++;
            await this.changePage();
          }
        } catch (error) {
          this._handleError(error, 'setupEventListeners.nextHandler');
        }
      };

      // EventManager 사용 (있는 경우)
      if (this.eventManager) {
        const prevId = this.eventManager.on(prevBtn, "click", prevHandler);
        const nextId = this.eventManager.on(nextBtn, "click", nextHandler);
        this.listenerIds.push(
          { element: prevBtn, id: prevId, type: 'click' },
          { element: nextBtn, id: nextId, type: 'click' }
        );
      } else {
        // 폴백: 직접 이벤트 리스너 등록
        prevBtn.addEventListener("click", prevHandler);
        nextBtn.addEventListener("click", nextHandler);
      }
    } catch (error) {
      this._handleError(error, 'setupEventListeners');
    }
  }

  // 현재 페이지 영상 가져오기
  getCurrentPageVideos() {
    try {
      if (!Array.isArray(this.videos)) {
        this._handleError(new Error('videos가 배열이 아닙니다.'), 'getCurrentPageVideos');
        return [];
      }

      const videosPerPage = this.config.videosPerPage || this.videosPerPage || 6;
      const start = this.currentPage * videosPerPage;
      const end = start + videosPerPage;
      return this.videos.slice(start, end);
    } catch (error) {
      this._handleError(error, 'getCurrentPageVideos');
      return [];
    }
  }

  // 페이지 변경 (AnimationUtils 활용)
  async changePage() {
    try {
      const container = this.domUtils?.$("#videoCardsContainer") || 
                      (typeof DOMUtils !== 'undefined' ? DOMUtils.$("#videoCardsContainer") : null) ||
                      document.querySelector("#videoCardsContainer");
      
      if (!container) {
        this._handleError(new Error('videoCardsContainer를 찾을 수 없습니다.'), 'changePage');
        return;
      }

      // 페이드 아웃 효과
      if (this.animationUtils && this.animationUtils.fade) {
        await this.animationUtils.fade(container, "out", 400);
      } else if (typeof AnimationUtils !== 'undefined' && AnimationUtils.fade) {
        await AnimationUtils.fade(container, "out", 400);
      } else {
        // 폴백: 직접 페이드 효과
        container.style.opacity = '0';
        await (this.utils?.delay(400) || new Promise(resolve => setTimeout(resolve, 400)));
      }

      // 외부 렌더링 함수 호출
      if (this.config.onPageChange && typeof this.config.onPageChange === 'function') {
        try {
          this.config.onPageChange(this.getCurrentPageVideos());
        } catch (error) {
          this._handleError(error, 'changePage.onPageChange');
        }
      }

      // 페이지네이션 업데이트
      this.updatePagination();

      // 페이드 인 효과
      if (this.animationUtils && this.animationUtils.fade) {
        await this.animationUtils.fade(container, "in", 400);
      } else if (typeof AnimationUtils !== 'undefined' && AnimationUtils.fade) {
        await AnimationUtils.fade(container, "in", 400);
      } else {
        // 폴백: 직접 페이드 효과
        container.style.opacity = '1';
      }
    } catch (error) {
      this._handleError(error, 'changePage');
    }
  }

  // 페이지네이션 업데이트
  updatePagination() {
    try {
      const pagination = this.domUtils?.$("#pagination") || 
                        (typeof DOMUtils !== 'undefined' ? DOMUtils.$("#pagination") : null) ||
                        document.querySelector("#pagination");
      const prevBtn = this.domUtils?.$("#prevBtn") || 
                     (typeof DOMUtils !== 'undefined' ? DOMUtils.$("#prevBtn") : null) ||
                     document.querySelector("#prevBtn");
      const nextBtn = this.domUtils?.$("#nextBtn") || 
                     (typeof DOMUtils !== 'undefined' ? DOMUtils.$("#nextBtn") : null) ||
                     document.querySelector("#nextBtn");

      if (!pagination) {
        console.warn("[VideoSlider] pagination 요소를 찾을 수 없습니다.");
        return;
      }

      const totalPages = this.getTotalPages();
      const currentPageNum = Math.max(0, Math.min(this.currentPage + 1, totalPages));
      
      // XSS 방지를 위해 텍스트로 설정
      pagination.innerHTML = '';
      const currentSpan = document.createElement('span');
      currentSpan.className = 'current';
      currentSpan.textContent = currentPageNum;
      pagination.appendChild(currentSpan);
      pagination.appendChild(document.createTextNode(` / ${totalPages}`));

      // 이전 버튼 상태
      if (prevBtn) {
        const isDisabled = this.currentPage === 0;
        if (this.domUtils && this.domUtils.toggleClass) {
          this.domUtils.toggleClass(prevBtn, "disabled", isDisabled);
        } else if (typeof DOMUtils !== 'undefined' && DOMUtils.toggleClass) {
          DOMUtils.toggleClass(prevBtn, "disabled", isDisabled);
        } else {
          // 폴백
          if (isDisabled) {
            prevBtn.classList.add("disabled");
          } else {
            prevBtn.classList.remove("disabled");
          }
        }
      }

      // 다음 버튼 상태
      if (nextBtn) {
        const isDisabled = this.currentPage >= totalPages - 1;
        if (this.domUtils && this.domUtils.toggleClass) {
          this.domUtils.toggleClass(nextBtn, "disabled", isDisabled);
        } else if (typeof DOMUtils !== 'undefined' && DOMUtils.toggleClass) {
          DOMUtils.toggleClass(nextBtn, "disabled", isDisabled);
        } else {
          // 폴백
          if (isDisabled) {
            nextBtn.classList.add("disabled");
          } else {
            nextBtn.classList.remove("disabled");
          }
        }
      }
    } catch (error) {
      this._handleError(error, 'updatePagination');
    }
  }

  // 전체 페이지 수
  getTotalPages() {
    try {
      if (!Array.isArray(this.videos)) {
        return 0;
      }

      const videosPerPage = this.config.videosPerPage || this.videosPerPage || 6;
      if (videosPerPage <= 0) {
        this._handleError(new Error('videosPerPage가 0 이하입니다.'), 'getTotalPages');
        return 1;
      }

      return Math.max(1, Math.ceil(this.videos.length / videosPerPage));
    } catch (error) {
      this._handleError(error, 'getTotalPages');
      return 1;
    }
  }

  /**
   * 리소스 정리 (이벤트 리스너 제거)
   */
  destroy() {
    try {
      // 이벤트 리스너 제거
      if (this.eventManager && this.listenerIds.length > 0) {
        this.listenerIds.forEach(({ element, id }) => {
          this.eventManager.off(element, id);
        });
        this.listenerIds = [];
      }

      // 참조 정리
      this.config = null;
      this.videos = [];
      this.currentPage = 0;
    } catch (error) {
      this._handleError(error, 'destroy');
    }
  }
}
