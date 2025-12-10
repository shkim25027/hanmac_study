// ============================================
// 비디오 관리 모듈 (Ajax 모달 버전)
// ============================================

export class VideoManager {
  constructor(config) {
    this.config = config;
    this.videos = config.videos || [];
    this.currentPage = 0;
    this.cachedVideos = [];
    this.currentModal = null;
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
    const allowKeywords = Array.isArray(keywords)
      ? keywords
      : keywords.allow || [];
    const denyKeywords = Array.isArray(keywords) ? [] : keywords.deny || [];

    if (allowKeywords.length === 0 && denyKeywords.length === 0) {
      return this.shuffleArray([...this.videos]);
    }

    let matchedPick = [];
    let matchedNormal = [];
    let unmatchedPick = [];
    let unmatchedNormal = [];

    this.videos.forEach((video) => {
      const allowMatched =
        allowKeywords.length === 0 || this.isVideoMatched(video, allowKeywords);
      const denyMatched =
        denyKeywords.length > 0 && this.isVideoMatched(video, denyKeywords);

      if (denyMatched) {
        return;
      }

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
      <a href="#" class="card" data-video-id="${video.id}">
        <div class="thumb">
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
      this.loadVideoModal(video.id);
    });

    return card;
  }

  // Ajax로 비디오 모달 로드
  async loadVideoModal(videoId) {
    try {
      // 기존 모달이 있으면 제거
      this.destroyModal();

      // Ajax로 모달 HTML 로드
      const response = await fetch(`../_modal/video.html?id=${videoId}`);
      if (!response.ok) {
        throw new Error("모달 로드 실패");
      }

      const modalHTML = await response.text();

      // 모달을 body에 추가
      const modalContainer = document.createElement("div");
      modalContainer.innerHTML = modalHTML;
      const modal = modalContainer.firstElementChild;

      // 모달 ID 설정
      modal.id = "videoModal";
      document.body.appendChild(modal);
      this.currentModal = modal;

      // 비디오 데이터 찾기
      const videoData = this.videos.find((v) => v.id === videoId);
      if (videoData) {
        // iframe에 비디오 URL 설정
        const iframe = modal.querySelector("#videoFrame");
        if (iframe) {
          iframe.src = `https://www.youtube.com/embed/${videoData.url}?autoplay=1`;
        }

        // 비디오 정보 업데이트
        this.updateModalContent(modal, videoData);
      }

      // 모달 표시
      setTimeout(() => {
        modal.style.display = "block";

        // 높이 조정 및 댓글 박스 이벤트 설정
        setTimeout(() => {
          this.adjustVideoListHeight();
          this.setupCommentBox(); // 🔥 추가
        }, 100);
      }, 10);

      // 닫기 이벤트 설정
      this.setupModalCloseEvents(modal);
    } catch (error) {
      console.error("모달 로드 오류:", error);
      alert("비디오를 로드하는 중 오류가 발생했습니다.");
    }
  }

  // 🔥 이 메서드를 VideoManager 클래스에 추가
  setupCommentBox() {
    const textarea = this.currentModal?.querySelector(".comment-box textarea");
    const btnCancel = this.currentModal?.querySelector(".btn-cancel");
    const btnSave = this.currentModal?.querySelector(".btn-save");

    console.log("댓글 박스 요소:", { textarea, btnCancel, btnSave }); // 디버깅용

    if (!textarea || !btnCancel || !btnSave) {
      console.warn("댓글 박스 요소를 찾을 수 없습니다");
      return;
    }

    // textarea 입력 이벤트
    textarea.addEventListener("input", (e) => {
      const hasValue = e.target.value.trim().length > 0;

      console.log("입력 감지:", hasValue); // 디버깅용

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

    // 취소 버튼 클릭
    btnCancel.addEventListener("click", (e) => {
      e.preventDefault();
      textarea.value = "";
      btnCancel.setAttribute("disabled", "disabled");
      btnSave.setAttribute("disabled", "disabled");
      btnSave.classList.remove("btn-active");
      textarea.focus();
    });

    // 작성 버튼 클릭
    btnSave.addEventListener("click", (e) => {
      e.preventDefault();
      const comment = textarea.value.trim();
      if (comment) {
        console.log("댓글 작성:", comment);
        // TODO: 댓글 저장 로직 추가
        alert("댓글이 작성되었습니다: " + comment);

        // 초기화
        textarea.value = "";
        btnCancel.setAttribute("disabled", "disabled");
        btnSave.setAttribute("disabled", "disabled");
        btnSave.classList.remove("btn-active");
      }
    });
  }

  // 리스트 높이 계산
  adjustVideoListHeight() {
    const videoSide = this.currentModal?.querySelector(".video-side");
    const videoHeader = this.currentModal?.querySelector(".video-header");
    const videoList = this.currentModal?.querySelector(".video-list");
    const commentWrap = this.currentModal?.querySelector(".comment-wrap");

    console.log("높이 조정 시작:", {
      videoSide,
      videoHeader,
      videoList,
      commentWrap,
    });

    if (!videoSide || !videoHeader || !videoList || !commentWrap) {
      console.warn("필요한 요소를 찾을 수 없습니다");
      return;
    }

    // 전체 높이
    const totalHeight = videoSide.clientHeight;

    // 헤더와 댓글박스 높이
    const headerHeight = videoHeader.offsetHeight;
    const commentHeight = commentWrap.offsetHeight;

    // 리스트에 사용 가능한 최대 높이
    const availableHeight = totalHeight - headerHeight - commentHeight - 20;

    // 리스트의 실제 컨텐츠 높이
    const listContentHeight = videoList.scrollHeight;

    // 컨텐츠가 적으면 컨텐츠 높이만큼, 많으면 사용 가능한 높이만큼
    const listHeight = Math.min(listContentHeight, availableHeight);

    console.log("높이 계산:", {
      totalHeight,
      headerHeight,
      commentHeight,
      availableHeight,
      listContentHeight,
      listHeight,
    });

    videoList.style.height = listHeight + "px";
    videoList.style.overflowY =
      listContentHeight > availableHeight ? "auto" : "hidden";
  }
  // 모달 컨텐츠 업데이트
  updateModalContent(modal, videoData) {
    // 카테고리 업데이트
    const categorySpan = modal.querySelector(".meta span");
    if (categorySpan) {
      categorySpan.textContent = videoData.category;
    }

    // 제목 업데이트
    const titleH3 = modal.querySelector(".tit-box h3");
    if (titleH3) {
      titleH3.textContent = videoData.title;
    }

    // 키워드 태그 업데이트 (선택사항)
    const metaEm = modal.querySelector(".meta em");
    if (metaEm && videoData.keywords) {
      metaEm.textContent = videoData.keywords.join(", ");
    }
  }

  // 모달 닫기 이벤트 설정
  setupModalCloseEvents(modal) {
    // X 버튼 클릭
    const closeBtn = modal.querySelector(".close");
    if (closeBtn) {
      closeBtn.onclick = () => {
        this.destroyModal();
      };
    }

    // 모달 배경 클릭
    modal.onclick = (e) => {
      if (e.target === modal) {
        this.destroyModal();
      }
    };

    // ESC 키 이벤트
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

  // 현재 페이지 영상 가져오기
  getCurrentPageVideos() {
    const sortedVideos = this.getFilteredVideos();
    const start = this.currentPage * this.config.videosPerPage;
    const end = start + this.config.videosPerPage;
    return sortedVideos.slice(start, end);
  }

  // 필터링된 영상 가져오기
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

  // 영상 목록 갱신
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
