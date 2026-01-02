/**
 * 학습 페이지 초기화 및 관리
 */
class LearningApp {
  constructor() {
    // HTML data 속성에서 설정 읽기
    this._loadSettingsFromHTML();

    this.gauge = new GaugeManager();
    this.markerManager = new MarkerManager(this.gauge, LEARNING_CONFIG);
    this.chapterCardManager = new ChapterCardManager(
      LEARNING_CONFIG,
      this.gauge
    );
    this.progressIndicator = new ProgressIndicator(
      LEARNING_CONFIG,
      this.gauge,
      this.markerManager
    );
    this.modal = new VideoModal(LEARNING_CONFIG, this.markerManager);

    // 마커 매니저와 챕터 카드 매니저에 모달 인스턴스 전달
    this.markerManager.setModalInstance(this.modal);
    this.chapterCardManager.setModalInstance(this.modal);

    this.init();
  }

  /**
   * HTML data 속성에서 설정 읽기
   * @private
   */
  _loadSettingsFromHTML() {
    const learningGauge = document.querySelector(".lessons-gauge");
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
      // 마커 생성
      this.markerManager.createMarkers();

      // 챕터 카드 생성
      this.chapterCardManager.createChapterCards();

      // 진행률 표시 생성
      this.progressIndicator.createIndicator();

      // 초기 진행률 설정 (마커의 실제 DOM 위치 기반)
      const targetMarkerConfig = this.gauge.calculateInitialProgress(
        this.markerManager.allMarkers,
        LEARNING_CONFIG
      );
      
      // 실제 강의만 카운트 (챕터 제외)
      const learningMarkers = this.markerManager.allMarkers.filter(
        (m) => m.isLearningContent !== false
      );
      const completedLearningCount = learningMarkers.filter(
        (m) => m.completed
      ).length;
      
      // 마커의 실제 DOM 위치를 찾아서 가장 가까운 pathPercent 계산
      let initialPathPercent = 0;
      
      // 100% 완료 시 게이지바를 100%로 설정
      if (completedLearningCount >= learningMarkers.length) {
        initialPathPercent = 1.0; // 100% 완료
        console.log(
          `[LearningApp] 초기 진행률: 모든 학습 완료, 게이지바 100%로 설정`
        );
      } else if (targetMarkerConfig) {
        // 타겟 마커 찾기 (pathPercent와 label로 비교)
        const targetMarker = this.markerManager.markers.find(
          (m) =>
            m.config &&
            m.config.pathPercent === targetMarkerConfig.pathPercent &&
            m.config.label === targetMarkerConfig.label
        );
        
        if (targetMarker && targetMarker.element) {
          // gaugePercent가 있으면 우선 사용, 없으면 마커의 실제 DOM 위치 기반으로 계산
          if (targetMarkerConfig.gaugePercent !== undefined) {
            initialPathPercent = targetMarkerConfig.gaugePercent;
            console.log(
              `[LearningApp] 초기 진행률: gaugePercent 사용: ${(initialPathPercent * 100).toFixed(1)}%`
            );
          } else {
            // 마커의 실제 DOM 위치 가져오기
            const markerLeft = parseFloat(targetMarker.element.style.left) || 0;
            const markerTop = parseFloat(targetMarker.element.style.top) || 0;
            
            // maskPath에서 마커 위치에 가장 가까운 지점 찾기
            initialPathPercent = this.gauge.findClosestPathPercent(markerLeft, markerTop);
            
            console.log(
              `[LearningApp] 초기 진행률: 마커 실제 위치 (${markerLeft.toFixed(2)}%, ${markerTop.toFixed(2)}%) → pathPercent: ${initialPathPercent.toFixed(4)}`
            );
          }
        } else {
          // 마커를 찾을 수 없는 경우 gaugePercent 우선 사용, 없으면 pathPercent 사용
          initialPathPercent = targetMarkerConfig.gaugePercent !== undefined ? targetMarkerConfig.gaugePercent : (targetMarkerConfig.pathPercent || 0);
          console.log(
            `[LearningApp] 초기 진행률: 마커를 찾을 수 없음, ${targetMarkerConfig.gaugePercent !== undefined ? 'gaugePercent' : 'pathPercent'} 직접 사용: ${(initialPathPercent * 100).toFixed(1)}%`
          );
        }
      }
      
      // 마커 실제 위치에 가장 가까운 pathPercent를 사용하여 채움
      this.gauge.setProgress(initialPathPercent, true);

      // 진행률 표시 업데이트
      this.progressIndicator.updateProgress(this.markerManager.allMarkers);
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
