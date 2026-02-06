// ============================================
// 비디오 카드 렌더링 모듈
// 공통 모듈 활용 (ErrorHandler, DOMUtils, EventManager, Utils, AnimationUtils)
// ============================================

class VideoCardRenderer {
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
      this.animationDelay = config.animationDelay || 50;
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
        context: `VideoCardRenderer.${context}`,
        component: 'VideoCardRenderer',
        ...additionalInfo
      }, false);
    } else {
      console.error(`[VideoCardRenderer] ${context}:`, error, additionalInfo);
    }
  }

  // 비디오 카드들 렌더링 (AnimationUtils 활용)
  async renderCards(videos, containerId = "videoCardsContainer") {
    try {
      // 입력값 유효성 검증
      if (!videos || !Array.isArray(videos)) {
        this._handleError(new Error('videos가 배열이 아닙니다.'), 'renderCards', { containerId });
        return;
      }

      if (!containerId || typeof containerId !== 'string') {
        this._handleError(new Error('containerId가 유효하지 않습니다.'), 'renderCards', { videos });
        return;
      }

      const container = this.domUtils?.$(`#${containerId}`) || document.querySelector(`#${containerId}`);
      if (!container) {
        this._handleError(new Error(`컨테이너를 찾을 수 없습니다: #${containerId}`), 'renderCards', { containerId });
        return;
      }

      if (this.domUtils) {
        this.domUtils.empty(container);
      } else {
        container.innerHTML = '';
      }

      const cards = [];
      videos.forEach((video, index) => {
        try {
          const card = this.createVideoCard(video);
          if (card) {
            cards.push(card);
            container.appendChild(card);
          }
        } catch (error) {
          this._handleError(error, 'renderCards.createCard', { index, video });
        }
      });

      // 순차적 애니메이션 (AnimationUtils 활용)
      if (this.animationUtils && cards.length > 0) {
        await this.animationUtils.sequentialAnimate(cards, "show", this.animationDelay);
      } else if (typeof AnimationUtils !== 'undefined' && cards.length > 0) {
        await AnimationUtils.sequentialAnimate(cards, "show", this.animationDelay);
      }
    } catch (error) {
      this._handleError(error, 'renderCards', { videos, containerId });
    }
  }

  // 비디오 카드 생성 (DOMUtils, VideoBase 활용)
  createVideoCard(video) {
    try {
      // 입력값 유효성 검증
      if (!video || typeof video !== 'object') {
        this._handleError(new Error('video가 유효하지 않습니다.'), 'createVideoCard');
        return null;
      }

      // VideoModel 사용 (있는 경우)
      let videoModel;
      if (typeof VideoModel !== 'undefined' && video instanceof VideoModel) {
        videoModel = video;
      } else if (typeof VideoModel !== 'undefined') {
        try {
          videoModel = new VideoModel(video);
        } catch (error) {
          this._handleError(error, 'createVideoCard.VideoModel', { video });
          // VideoModel 생성 실패 시 원본 video 사용
          videoModel = video;
        }
      } else {
        videoModel = video;
      }
      
      const keywords = videoModel.keywords || [];
      const keywordTags = Array.isArray(keywords)
        ? keywords.map((kw) => {
            const escapedKw = this._escapeHtml(String(kw || ''));
            return `<span class="key-badge">${escapedKw}</span>`;
          }).join(" ")
        : "";

      const categoryClass = this.getCategoryClass(videoModel.category);
      const pickerName = videoModel.picker && String(videoModel.picker).trim();
      const pickBadge = pickerName
        ? `<div class="pick"><i class="ico-pick"></i>${this._escapeHtml(pickerName)}님<em>Pick!</em></div>`
        : "";
      
      const gauge = videoModel.gauge;
      const gaugeBar = (typeof gauge === 'number' && gauge >= 0 && gauge <= 100)
        ? `<div class="gauge-bar"><div class="gauge-fill" style="width: ${gauge}%"></div></div>`
        : "";

      // VideoBase를 사용하여 썸네일 URL 생성
      let thumbnailUrl = '';
      try {
        if (videoModel.getThumbnailUrl && typeof videoModel.getThumbnailUrl === 'function') {
          thumbnailUrl = videoModel.getThumbnailUrl("sd");
        } else if (typeof VideoBase !== 'undefined' && VideoBase.getYouTubeThumbnail) {
          const videoId = videoModel.url || videoModel.getVideoId?.() || videoModel.id;
          thumbnailUrl = VideoBase.getYouTubeThumbnail(videoId, "sd");
        } else {
          // 기본 썸네일 URL 생성
          const videoId = videoModel.url || videoModel.id;
          thumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
        }
      } catch (error) {
        this._handleError(error, 'createVideoCard.thumbnailUrl', { videoModel });
        thumbnailUrl = '';
      }

      const videoId = videoModel.id || videoModel.url || '';
      const title = this._escapeHtml(String(videoModel.title || ''));
      const category = this._escapeHtml(String(videoModel.category || ''));
      const isBookmarked = !!videoModel.bookmark;
      const checkboxChecked = isBookmarked ? ' checked' : '';

      const cardContent = `
        <a href="#" class="card" data-video-id="${this._escapeHtml(String(videoId))}">
          <div class="thumb">
            <img src="${this._escapeHtml(thumbnailUrl)}" alt="${title}" loading="lazy" />
          </div>
          <div class="txt-box">
            <label class="bookmark" for="like_chk${this._escapeHtml(String(videoId))}" onclick="event.stopPropagation();">
              <input type="checkbox" id="like_chk${this._escapeHtml(String(videoId))}"${checkboxChecked}>
            </label>
            <div class="category ${categoryClass}">${category}</div>
            <div class="title">${title}</div>
            <div class="author">${keywordTags}</div>
          </div>
          ${pickBadge}
        </a>
        ${gaugeBar}
      `;

      // DOMUtils.createElement 사용
      if (this.domUtils && this.domUtils.createElement) {
        return this.domUtils.createElement("div", { class: "video-card" }, cardContent);
      } else if (typeof DOMUtils !== 'undefined' && DOMUtils.createElement) {
        return DOMUtils.createElement("div", { class: "video-card" }, cardContent);
      } else {
        // 폴백: 직접 DOM 요소 생성
        const div = document.createElement("div");
        div.className = "video-card";
        div.innerHTML = cardContent;
        return div;
      }
    } catch (error) {
      this._handleError(error, 'createVideoCard', { video });
      return null;
    }
  }

  /**
   * HTML 이스케이프 (XSS 방지)
   * @private
   */
  _escapeHtml(text) {
    if (typeof text !== 'string') {
      text = String(text || '');
    }
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  // 유틸리티: 카테고리 클래스
  getCategoryClass(category) {
    try {
      if (!category || typeof category !== 'string') {
        return "default";
      }

      const map = {
        리더십: "leader",
        인사이트: "insight",
        비즈트렌드: "biz",
      };
      return map[category] || "default";
    } catch (error) {
      this._handleError(error, 'getCategoryClass', { category });
      return "default";
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
      this.animationDelay = 50;
    } catch (error) {
      this._handleError(error, 'destroy');
    }
  }
}
