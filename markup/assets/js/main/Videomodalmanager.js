// ============================================
// 비디오 모달 관리 모듈 (VideoModalBase 활용)
// ============================================

class VideoModalManager extends VideoModalBase {
  constructor(config) {
    super({
      videos: config.videos || [],
      modalPath: config.modalPath || "./_modal/video.html",
      modalPathTemplate: config.modalPathTemplate || "./_modal/video-{type}.html",
      enableHeightAdjustment: config.enableHeightAdjustment !== false,
      enableCommentResizer: config.enableCommentResizer !== false,
      enableCommentBox: config.enableCommentBox !== false,
      ...config,
    });
  }

  // 초기화
  init() {
    this.setupCardClickEvents();
  }

  // 카드 클릭 이벤트 설정 (DOMUtils 활용)
  setupCardClickEvents() {
    const container = DOMUtils.$("#videoCardsContainer");
    if (!container) return;

    // VideoModalManager 인스턴스를 참조하기 위해 변수에 저장
    const self = this;

    DOMUtils.delegate(container, "click", ".card", function(e) {
      e.preventDefault();
      // this는 .card 요소, self는 VideoModalManager 인스턴스
      const videoId = parseInt(this.getAttribute("data-video-id"));
      self.openVideo(videoId);
    });
  }

  // 기존 메서드 호환성을 위한 래퍼
  async loadVideoModal(videoId) {
    return await this.openVideo(videoId);
  }

  // 기존 코드 호환성을 위한 래퍼 메서드들
  get currentModal() {
    return this.currentModalElement;
  }

  set currentModal(value) {
    this.currentModalElement = value;
  }

  // 기존 메서드 호환성 유지 (VideoModalBase의 메서드 사용)
  adjustVideoListHeight() {
    if (this.currentModalElement) {
      super.adjustVideoListHeight(this.currentModalElement);
    }
  }

  setupCommentResizer() {
    if (this.currentModalElement) {
      super.setupCommentResizer(this.currentModalElement);
    }
  }

  setupCommentBox() {
    if (this.currentModalElement) {
      super.setupCommentBox(this.currentModalElement);
    }
  }

  showCommentSection() {
    if (this.currentModalElement) {
      super.showCommentSection(this.currentModalElement);
    }
  }

  adjustCommentOnlyLayout() {
    if (this.currentModalElement) {
      super.adjustCommentOnlyLayout(this.currentModalElement);
    }
  }

  setupEssentialLayout() {
    if (this.currentModalElement) {
      super.setupEssentialLayout(this.currentModalElement);
    }
  }

  setupLearningLayout() {
    if (this.currentModalElement) {
      super.setupLearningLayout(this.currentModalElement);
    }
  }

  initializeHeightAdjustment() {
    if (this.currentModalElement) {
      super.initializeHeightAdjustment(this.currentModalElement);
    }
  }

  setupResizeObserver() {
    if (this.currentModalElement) {
      super.setupResizeObserver(this.currentModalElement);
    }
  }

  setupMutationObserver() {
    if (this.currentModalElement) {
      super.setupMutationObserver(this.currentModalElement);
    }
  }

  async waitForImagesAndAdjust() {
    if (this.currentModalElement) {
      await super.waitForImagesAndAdjust(this.currentModalElement);
    }
  }

  destroyModal() {
    this.destroy();
  }
}
