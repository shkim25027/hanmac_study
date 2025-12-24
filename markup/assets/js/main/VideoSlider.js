// ============================================
// 비디오 슬라이드 모듈 (페이지네이션)
// ============================================

class VideoSlider {
  constructor(config) {
    this.config = config;
    this.videos = config.videos || [];
    this.currentPage = 0;
  }

  // 초기화
  init() {
    this.setupEventListeners();
    this.updatePagination();
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

  // 현재 페이지 영상 가져오기
  getCurrentPageVideos() {
    const start = this.currentPage * this.config.videosPerPage;
    const end = start + this.config.videosPerPage;
    return this.videos.slice(start, end);
  }

  // 페이지 변경
  async changePage() {
    const container = document.getElementById("videoCardsContainer");
    if (!container) return;

    // 페이드 아웃 효과
    container.classList.add("fade-out");
    await this.delay(400);

    // 외부 렌더링 함수 호출
    if (this.config.onPageChange) {
      this.config.onPageChange(this.getCurrentPageVideos());
    }

    // 페이지네이션 업데이트
    this.updatePagination();

    // 페이드 인 효과
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

    // 이전 버튼 상태
    if (prevBtn) {
      prevBtn.classList.toggle("disabled", this.currentPage === 0);
    }

    // 다음 버튼 상태
    if (nextBtn) {
      nextBtn.classList.toggle("disabled", this.currentPage >= totalPages - 1);
    }
  }

  // 전체 페이지 수
  getTotalPages() {
    return Math.ceil(this.videos.length / this.config.videosPerPage);
  }

  // 유틸리티: 딜레이
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
