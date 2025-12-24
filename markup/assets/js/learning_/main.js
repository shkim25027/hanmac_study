/**
 * 학습 페이지 초기화 및 관리
 */
class LearningApp {
  constructor() {
    // HTML data 속성에서 설정 읽기
    this._loadSettingsFromHTML();

    this.gauge = new GaugeManager();
    this.markerManager = null;
    this.chapterCardManager = null;
    this.progressIndicator = null;
    this.modal = null;

    this.init();
  }

  /**
   * HTML data 속성에서 설정 읽기
   * @private
   */
  _loadSettingsFromHTML() {
    const learningGauge = document.querySelector(".learning-gauge");
    if (!learningGauge) return;

    // data-allow-disabled-click
    const allowDisabledClick = learningGauge.dataset.allowDisabledClick;
    if (allowDisabledClick !== undefined) {
      LEARNING_CONFIG.settings.allowDisabledClick =
        allowDisabledClick === "true";
    }

    // data-show-disabled-alert
    const showDisabledAlert = learningGauge.dataset.showDisabledAlert;
    if (showDisabledAlert !== undefined) {
      LEARNING_CONFIG.settings.showDisabledAlert = showDisabledAlert === "true";
    }

    // data-disabled-click-message
    const disabledClickMessage = learningGauge.dataset.disabledClickMessage;
    if (disabledClickMessage) {
      LEARNING_CONFIG.settings.disabledClickMessage = disabledClickMessage;
    }

    console.log("[LearningApp] HTML 설정 로드 완료:", LEARNING_CONFIG.settings);
  }

  /**
   * 초기화
   */
  init() {
    window.addEventListener("DOMContentLoaded", () => {
      console.log("[LearningApp] 초기화 시작");

      // GaugeManager 초기화 (inline SVG)
      const gaugeInitialized = this.gauge.initialize();

      if (!gaugeInitialized) {
        console.error("[LearningApp] GaugeManager 초기화 실패");
        return;
      }

      console.log("[LearningApp] GaugeManager 초기화 성공");

      // SVG Enhancer 실행 (필터/그라디언트 추가)
      if (window.SVGEnhancer) {
        const svg = document.getElementById("gauge-svg");
        if (svg) {
          window.SVGEnhancer.enhance(svg);
          console.log("[LearningApp] SVG Enhancer 실행 완료");
        }
      }

      // 나머지 매니저 초기화
      this.markerManager = new MarkerManager(this.gauge, LEARNING_CONFIG);
      this.chapterCardManager = new ChapterCardManager(
        LEARNING_CONFIG,
        this.gauge
      );
      this.progressIndicator = new ProgressIndicator(
        LEARNING_CONFIG,
        this.gauge
      );
      this.modal = new VideoModal(LEARNING_CONFIG, this.markerManager);

      // 마커 매니저와 챕터 카드 매니저에 모달 인스턴스 전달
      this.markerManager.setModalInstance(this.modal);
      this.chapterCardManager.setModalInstance(this.modal);

      // 마커 생성
      this.markerManager.createMarkers();

      // 챕터 카드 생성
      this.chapterCardManager.createChapterCards();

      // 진행률 표시 생성
      this.progressIndicator.createIndicator();

      // 초기 진행률 설정
      const initialProgress = this.gauge.calculateInitialProgress(
        this.markerManager.allMarkers,
        LEARNING_CONFIG
      );
      this.gauge.setProgress(initialProgress);

      // 진행률 표시 업데이트
      this.progressIndicator.updateProgress(this.markerManager.allMarkers);

      console.log("[LearningApp] 초기화 완료");
    });
  }

  /**
   * 학습 완료 후 챕터 카드 및 진행률 표시 업데이트
   */
  updateChapterCards() {
    if (this.chapterCardManager) {
      this.chapterCardManager.updateChapterCards();
    }
    if (this.progressIndicator) {
      this.progressIndicator.updateProgress(this.markerManager.allMarkers);
    }
  }
}

// 앱 시작
window.learningApp = new LearningApp();
