// ============================================
// 비디오 카드 렌더링 모듈
// ============================================

class VideoCardRenderer {
  constructor(config) {
    this.config = config;
    this.animationDelay = config.animationDelay || 50;
  }

  // 비디오 카드들 렌더링
  renderCards(videos, containerId = "videoCardsContainer") {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    videos.forEach((video, index) => {
      const card = this.createVideoCard(video);
      container.appendChild(card);

      // 순차적 애니메이션
      setTimeout(() => {
        card.classList.add("show");
      }, index * this.animationDelay);
    });
  }

  // 비디오 카드 생성
  createVideoCard(video) {
    const card = document.createElement("div");
    card.className = "video-card";

    const keywordTags = video.keywords
      .map((kw) => `<span class="key-badge">${kw}</span>`)
      .join(" ");

    const categoryClass = this.getCategoryClass(video.category);
    const pickBadge = video.bookmark
      ? `<div class="pick"><i class="ico-pick"></i>${video.picker}님<em>Pick!</em></div>`
      : "";
    const gaugeBar = video.gauge
      ? `<div class="gauge-bar"><div class="gauge-fill" style="width: ${video.gauge}%"></div></div>`
      : "";

    card.innerHTML = `
      <a href="#" class="card" data-video-id="${video.id}">
        <div class="thumb">
          <img src="https://img.youtube.com/vi/${video.url}/sddefault.jpg" />
        </div>
        <div class="txt-box">
          <label class="bookmark" for="like_chk${video.id}" onclick="event.stopPropagation();">
            <input type="checkbox" id="like_chk${video.id}">
          </label>
          <div class="category ${categoryClass}">${video.category}</div>
          <div class="title">${video.title}</div>
          <div class="author">${keywordTags}</div>
        </div>
        ${pickBadge}
      </a>
      ${gaugeBar}
    `;

    return card;
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
