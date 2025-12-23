/**
 * 학습 페이지 초기화 및 관리
 */
class LearningApp {
  constructor() {
    this.gauge = new GaugeManager();
    this.markerManager = new MarkerManager(this.gauge, LEARNING_CONFIG);
    this.chapterCardManager = new ChapterCardManager(
      LEARNING_CONFIG,
      this.gauge
    );
    this.modal = new VideoModal(LEARNING_CONFIG, this.markerManager);

    // 마커 매니저에 모달 인스턴스 전달
    this.markerManager.setModalInstance(this.modal);

    this.init();
  }

  /**
   * 초기화
   */
  init() {
    window.addEventListener("DOMContentLoaded", () => {
      // 마커 생성
      this.markerManager.createMarkers();

      // 챕터 카드 생성
      this.chapterCardManager.createChapterCards();

      // 초기 진행률 설정
      const initialProgress = this.gauge.calculateInitialProgress(
        this.markerManager.allMarkers,
        LEARNING_CONFIG
      );
      this.gauge.setProgress(initialProgress);
    });
  }

  /**
   * 학습 완료 후 챕터 카드 업데이트
   */
  updateChapterCards() {
    if (this.chapterCardManager) {
      this.chapterCardManager.updateChapterCards();
    }
  }
}

// 앱 시작
const learningApp = new LearningApp();
