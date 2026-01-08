// ============================================
// 비디오 카드 렌더링 모듈
// 공통 모듈(DOMUtils, AnimationUtils, VideoBase) 활용
// ============================================

class VideoCardRenderer {
  constructor(config) {
    this.config = config;
    this.animationDelay = config.animationDelay || 50;
  }

  // 비디오 카드들 렌더링 (AnimationUtils 활용)
  async renderCards(videos, containerId = "videoCardsContainer") {
    const container = DOMUtils.$(`#${containerId}`);
    if (!container) return;

    DOMUtils.empty(container);

    const cards = videos.map((video) => this.createVideoCard(video));
    cards.forEach((card) => container.appendChild(card));

    // 순차적 애니메이션 (AnimationUtils 활용)
    await AnimationUtils.sequentialAnimate(cards, "show", this.animationDelay);
  }

  // 비디오 카드 생성 (DOMUtils, VideoBase 활용)
  createVideoCard(video) {
    // VideoModel 사용 (있는 경우)
    const videoModel = video instanceof VideoModel ? video : new VideoModel(video);
    
    const keywordTags = (videoModel.keywords || [])
      .map((kw) => `<span class="key-badge">${kw}</span>`)
      .join(" ");

    const categoryClass = this.getCategoryClass(videoModel.category);
    const pickBadge = videoModel.bookmark
      ? `<div class="pick"><i class="ico-pick"></i>${videoModel.picker}님<em>Pick!</em></div>`
      : "";
    const gaugeBar = videoModel.gauge
      ? `<div class="gauge-bar"><div class="gauge-fill" style="width: ${videoModel.gauge}%"></div></div>`
      : "";

    // VideoBase를 사용하여 썸네일 URL 생성
    const thumbnailUrl = videoModel.getThumbnailUrl ? 
      videoModel.getThumbnailUrl("sd") : 
      VideoBase.getYouTubeThumbnail(videoModel.url || videoModel.getVideoId(), "sd");

    const cardContent = `
      <a href="#" class="card" data-video-id="${videoModel.id}">
        <div class="thumb">
          <img src="${thumbnailUrl}" alt="${videoModel.title}" />
        </div>
        <div class="txt-box">
          <label class="bookmark" for="like_chk${videoModel.id}" onclick="event.stopPropagation();">
            <input type="checkbox" id="like_chk${videoModel.id}">
          </label>
          <div class="category ${categoryClass}">${videoModel.category}</div>
          <div class="title">${videoModel.title}</div>
          <div class="author">${keywordTags}</div>
        </div>
        ${pickBadge}
      </a>
      ${gaugeBar}
    `;

    // DOMUtils.createElement 사용
    return DOMUtils.createElement("div", { class: "video-card" }, cardContent);
  }

  // 유틸리티: 카테고리 클래스
  getCategoryClass(category) {
    const map = {
      리더십: "leader",
      인사이트: "insight",
      비즈트렌드: "biz",
    };
    return map[category] || "default";
  }
}
