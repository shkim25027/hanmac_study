// ============================================
// 비디오 관리 모듈
// ============================================

export class VideoManager {
  constructor(config) {
    this.config = config;
    this.videos = config.videos || [];
    this.currentPage = 0;
    this.cachedVideos = [];
  }

  // 초기화
  init() {
    this.renderVideos();
    this.setupEventListeners();
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (prevBtn && nextBtn) {
      prevBtn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.currentPage > 0) {
          this.currentPage--;
          await this.changePage();
        }
      };

      nextBtn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const totalPages = this.getTotalPages();
        if (this.currentPage < totalPages - 1) {
          this.currentPage++;
          await this.changePage();
        }
      };
    }
  }

  // 키워드로 영상 필터링
  filterVideos(keywords) {
    // keywords가 객체 형태 {allow: [], deny: []}인 경우 처리
    const allowKeywords = Array.isArray(keywords)
      ? keywords
      : keywords.allow || [];
    const denyKeywords = Array.isArray(keywords) ? [] : keywords.deny || [];

    // allow, deny 둘 다 없으면 전체 영상 랜덤 반환
    if (allowKeywords.length === 0 && denyKeywords.length === 0) {
      return this.shuffleArray([...this.videos]);
    }

    let matchedPick = []; // 키워드 매칭 + Pick
    let matchedNormal = []; // 키워드 매칭 (Pick 없음)
    let unmatchedPick = []; // 키워드 미매칭 + Pick
    let unmatchedNormal = []; // 키워드 미매칭 (Pick 없음)

    this.videos.forEach((video) => {
      const allowMatched =
        allowKeywords.length === 0 || this.isVideoMatched(video, allowKeywords);
      const denyMatched =
        denyKeywords.length > 0 && this.isVideoMatched(video, denyKeywords);

      // deny 키워드에 매칭되면 제외
      if (denyMatched) {
        return;
      }

      // allow 키워드 매칭 여부로 분류
      const isMatched = allowMatched;
      const isPick = video.pick;

      if (isMatched && isPick) {
        matchedPick.push(video);
      } else if (isMatched && !isPick) {
        matchedNormal.push(video);
      } else if (!isMatched && isPick) {
        unmatchedPick.push(video);
      } else {
        unmatchedNormal.push(video);
      }
    });

    // 우선순위: 1. 매칭+Pick → 2. 매칭 → 3. 미매칭+Pick → 4. 미매칭
    return [
      ...this.shuffleArray(matchedPick),
      ...this.shuffleArray(matchedNormal),
      ...this.shuffleArray(unmatchedPick),
      ...this.shuffleArray(unmatchedNormal),
    ];
  }

  // 키워드 매칭 체크
  isVideoMatched(video, keywords) {
    const videoWords = video.keywords.map((k) => k.toLowerCase());
    const searchWords = keywords
      .map((kw) => this.splitKeywords(kw))
      .flat()
      .map((w) => w.toLowerCase());

    return searchWords.some((word) => {
      return videoWords.some((tag) => {
        if (tag === word) return true;
        if (word.length > 1 && tag.includes(word)) return true;
        if (word.length > 2 && this.isSimilar(tag, word)) return true;
        return false;
      });
    });
  }

  // 영상 렌더링
  renderVideos() {
    const container = document.getElementById("videoCardsContainer");
    if (!container) return;

    const videos = this.getCurrentPageVideos();
    container.innerHTML = "";

    videos.forEach((video, index) => {
      const card = this.createVideoCard(video);
      container.appendChild(card);

      setTimeout(() => {
        card.classList.add("show");
      }, index * this.config.animationDelay);
    });

    this.updatePagination();
  }

  // 비디오 카드 생성
  createVideoCard(video) {
    const card = document.createElement("div");
    card.className = "video-card";

    const keywordTags = video.keywords
      .map((kw) => `<span class="key-badge">${kw}</span>`)
      .join(" ");

    const categoryClass = this.getCategoryClass(video.category);
    const pickBadge = video.pick
      ? `<div class="pick"><i class="ico-pick"></i>${video.person}님<em>Pick!</em></div>`
      : "";
    const gaugeBar = video.gauge
      ? `<div class="gauge-bar"><div class="gauge-fill" style="width: ${video.gauge}%"></div></div>`
      : "";

    card.innerHTML = `
      <a href="#" class="card" data-video-url="${video.url}">
        <div class="thumbnail">
          <img src="https://img.youtube.com/vi/${video.url || video.id}/sddefault.jpg" />
        </div>
        <div class="txt-box">
          <label class="checkbox" for="like_chk${video.id}" onclick="event.stopPropagation();">
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

    // 카드 클릭 이벤트
    const cardLink = card.querySelector(".card");
    cardLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.openVideoModal(video.url);
    });

    return card;
  }

  // 비디오 모달 열기
  openVideoModal(videoUrl) {
    // 모달 생성 또는 기존 모달 찾기
    let videoModal = document.getElementById("videoModal");

    if (!videoModal) {
      videoModal = document.createElement("div");
      videoModal.id = "videoModal";
      videoModal.className = "modal video";
      videoModal.innerHTML = `
        <div class="modal-content">

          <div class="modal-body">
            <div class="video-contents">
              <div class="video-box">
                <iframe 
                    id="videoFrame"
                    width="100%" 
                    height="100%" 
                    src="" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                  </iframe>
              </div>
              <div class="video-info">
                <div class="tit-box">
                  <div class="meta"> <span>인사이트</span> <em>경제와사회</em></div>
                  <h3>회계를 조금이라도 이해하면 인생이 달라지는 이유 (회계사 이재용)</h3>
                </div>
                <div class="desc">
                메타버스 시대가 열리며 우리의 삶과 정체성이 디지털 중심으로 재편되고 있습니다.<br>
                이 변화는 새로운 기회와 동시에 사회적·윤리적 과제도 함께 가져옵니다.
                </div>
              </div>
            </div>
             <div class="video-list">
                       <div class="list-header">
           <span class="close">&times;</span>
          </div>
          <div>
          </div>
          <div class="comment-wrap">
          <div class="comment-box">
          <textarea placeholder="댓글을 작성해주세요"></textarea>
             <div class="btn-area">
          <button class="btn-cancel" >취소 </button>
          <button class="btn-save" >작성</button>
          </div>
          </div>
               </div>          
             </div>
          </div>
        </div>
      `;
      document.body.appendChild(videoModal);

      // 모달 닫기 이벤트
      const closeBtn = videoModal.querySelector(".close");
      closeBtn.onclick = () => {
        this.closeVideoModal();
      };

      // 모달 외부 클릭 시 닫기
      videoModal.onclick = (e) => {
        if (e.target === videoModal) {
          this.closeVideoModal();
        }
      };
    }

    // 유튜브 iframe URL 설정
    const iframe = videoModal.querySelector("#videoFrame");
    iframe.src = `https://www.youtube.com/embed/${videoUrl}?autoplay=1`;

    // 모달 표시
    videoModal.style.display = "block";
  }

  // 비디오 모달 닫기
  closeVideoModal() {
    const videoModal = document.getElementById("videoModal");
    if (videoModal) {
      const iframe = videoModal.querySelector("#videoFrame");
      iframe.src = ""; // 비디오 중지
      videoModal.style.display = "none";
    }
  }

  // 현재 페이지 영상 가져오기
  getCurrentPageVideos() {
    const sortedVideos = this.getFilteredVideos();
    const start = this.currentPage * this.config.videosPerPage;
    const end = start + this.config.videosPerPage;
    return sortedVideos.slice(start, end);
  }

  // 필터링된 영상 가져오기 (캐시 사용)
  getFilteredVideos(forceRefresh = false) {
    if (this.cachedVideos.length > 0 && !forceRefresh) {
      return this.cachedVideos;
    }

    const keywords = this.config.getKeywords
      ? this.config.getKeywords()
      : { allow: [], deny: [] };
    this.cachedVideos = this.filterVideos(keywords);
    return this.cachedVideos;
  }

  // 페이지 변경
  async changePage() {
    const container = document.getElementById("videoCardsContainer");
    if (!container) return;

    container.classList.add("fade-out");
    await this.delay(400);

    this.renderVideos();
    container.classList.remove("fade-out");
  }

  // 페이지네이션 업데이트
  updatePagination() {
    const pagination = document.getElementById("pagination");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (!pagination) return;

    const totalPages = this.getTotalPages();
    pagination.innerHTML = `<span class="current">${this.currentPage + 1}</span> / ${totalPages}`;

    if (prevBtn) {
      prevBtn.classList.toggle("disabled", this.currentPage === 0);
    }
    if (nextBtn) {
      nextBtn.classList.toggle("disabled", this.currentPage >= totalPages - 1);
    }
  }

  // 전체 페이지 수
  getTotalPages() {
    const sortedVideos = this.getFilteredVideos();
    return Math.ceil(sortedVideos.length / this.config.videosPerPage);
  }

  // 영상 목록 갱신 (키워드 변경 시)
  async refresh() {
    this.currentPage = 0;
    this.cachedVideos = [];
    await this.changePage();
  }

  // 유틸리티: 배열 섞기
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
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

  // 유틸리티: 키워드 분리
  splitKeywords(input) {
    return input
      .split(/[\s,\/\-]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
  }

  // 유틸리티: 문자열 유사도
  isSimilar(a, b, maxDistance = 1) {
    a = a.toLowerCase();
    b = b.toLowerCase();

    const dp = Array.from({ length: a.length + 1 }, () =>
      Array(b.length + 1).fill(0)
    );

    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }

    return dp[a.length][b.length] <= maxDistance;
  }

  // 유틸리티: 딜레이
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
