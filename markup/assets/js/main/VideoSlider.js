// ============================================
// 비디오 슬라이드 모듈
// 각 swiper-slide 안에 CSS Grid로 카드를 묶어 페이지 단위로 전환
// PC (1025px+): 한 슬라이드에 2열 × 3행 = 6카드
// MO (1024px-): 한 슬라이드에 1열 × 3행 = 3카드
// ============================================

class VideoSlider {
  constructor(config = {}) {
    this.config = config;
    this.videos = config.videos || [];
    this.renderer = config.renderer || null;
    this.swiper = null;
    this.currentPerPage = this._getPerPage();
    this._onResize = null;
  }

  _getPerPage() {
    return window.innerWidth >= 1025 ? 6 : 3;
  }

  _renderSlides(perPage) {
    const container = document.getElementById('videoCardsContainer');
    if (!container || !this.renderer) return;

    container.innerHTML = '';

    for (let i = 0; i < this.videos.length; i += perPage) {
      const pageVideos = this.videos.slice(i, i + perPage);

      const slide = document.createElement('div');
      slide.className = 'swiper-slide';

      const grid = document.createElement('div');
      grid.className = 'video-grid';

      pageVideos.forEach(video => {
        const card = this.renderer.createVideoCard(video);
        if (card) grid.appendChild(card);
      });

      slide.appendChild(grid);
      container.appendChild(slide);
    }
  }

  // 실제 뷰포트 교차 비율로 슬라이드 opacity 조정 (모바일/태블릿 전용)
  _updateSlideOpacity() {
    if (window.innerWidth >= 1025) return;

    const wrap = document.querySelector('.video-wrap');
    if (!wrap) return;
    const wrapRect = wrap.getBoundingClientRect();

    const slides = document.querySelectorAll('.videoSwiper .swiper-slide');
    slides.forEach(slide => {
      const rect = slide.getBoundingClientRect();
      const overlapLeft = Math.max(rect.left, wrapRect.left);
      const overlapRight = Math.min(rect.right, wrapRect.right);
      const overlap = Math.max(0, overlapRight - overlapLeft);
      const ratio = rect.width > 0 ? overlap / rect.width : 0;
      slide.style.opacity = ratio >= 0.9 ? '1' : '0.4';
    });
  }

  init() {
    this.currentPerPage = this._getPerPage();
    this._renderSlides(this.currentPerPage);

    this.swiper = new Swiper('.videoSwiper', {
      // 모바일 기본값: 좌측 정렬, 너비 auto, 슬라이드 간격 16px
      slidesPerView: 'auto',
      spaceBetween: 0,
      navigation: {
        nextEl: '#nextBtn',
        prevEl: '#prevBtn',
      },
      pagination: {
        el: '#pagination',
        type: 'fraction',
      },
      breakpoints: {
        // PC (1025px+): 1슬라이드 전체 너비, 센터링 없음
        1025: {
          slidesPerView: 1,
          centeredSlides: false,
          spaceBetween: 0,
        },
      },
      on: {
        init: () => { setTimeout(() => this._updateSlideOpacity(), 0); },
        slideChange: () => this._updateSlideOpacity(),
        transitionEnd: () => this._updateSlideOpacity(),
      },
    });

    // 브레이크포인트(1025px) 전환 시 슬라이드 재구성
    this._onResize = () => {
      const newPerPage = this._getPerPage();
      if (newPerPage !== this.currentPerPage) {
        this.currentPerPage = newPerPage;
        this._renderSlides(newPerPage);
        if (this.swiper) {
          this.swiper.update();
          this.swiper.slideTo(0, 0);
        }
      }
      this._updateSlideOpacity();
    };
    window.addEventListener('resize', this._onResize);
  }

  destroy() {
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize);
      this._onResize = null;
    }
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }
}
