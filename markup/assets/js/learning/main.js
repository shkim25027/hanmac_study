/**
 * 학습 페이지 초기화 및 관리
 * 공통 모듈 활용 (ErrorHandler, DOMUtils, EventManager, Utils)
 */
class LearningApp {
  constructor(dependencies = {}) {
    // 의존성 주입 (폴백 포함)
    this.domUtils = dependencies.domUtils || (typeof DOMUtils !== 'undefined' ? DOMUtils : null);
    this.errorHandler = dependencies.errorHandler || (typeof ErrorHandler !== 'undefined' ? ErrorHandler : null);
    this.eventManager = dependencies.eventManager || (typeof eventManager !== 'undefined' ? eventManager : null);
    this.utils = dependencies.utils || (typeof Utils !== 'undefined' ? Utils : null);
    this.animationUtils = dependencies.animationUtils || (typeof AnimationUtils !== 'undefined' ? AnimationUtils : null);

    // 이벤트 리스너 ID 저장 (정리용)
    this.listenerIds = [];

    try {
      // HTML data 속성에서 설정 읽기
      this._loadSettingsFromHTML();

      // 의존성 전달을 위한 객체 생성
      const commonDependencies = {
        domUtils: this.domUtils,
        errorHandler: this.errorHandler,
        eventManager: this.eventManager,
        utils: this.utils,
        animationUtils: this.animationUtils
      };

      // GaugeManager 초기화 (의존성 주입)
      this.gauge = new GaugeManager(commonDependencies);

      // MarkerManager 초기화
      this.markerManager = new MarkerManager(this.gauge, LEARNING_CONFIG);

      // ChapterCardManager 초기화 (의존성 주입)
      this.chapterCardManager = new ChapterCardManager(
        LEARNING_CONFIG,
        this.gauge,
        commonDependencies
      );

      // ProgressIndicator 초기화
      this.progressIndicator = new ProgressIndicator(
        LEARNING_CONFIG,
        this.gauge,
        this.markerManager
      );

      // VideoModal 초기화
      this.modal = new VideoModal(LEARNING_CONFIG, this.markerManager);

      // 마커 매니저와 챕터 카드 매니저에 모달 인스턴스 전달
      if (this.markerManager && typeof this.markerManager.setModalInstance === 'function') {
        this.markerManager.setModalInstance(this.modal);
      }
      if (this.chapterCardManager && typeof this.chapterCardManager.setModalInstance === 'function') {
        this.chapterCardManager.setModalInstance(this.modal);
      }

      this.init();
    } catch (error) {
      this._handleError(error, 'LearningApp.constructor');
    }
  }

  /**
   * 에러 처리 헬퍼
   * @private
   */
  _handleError(error, context, additionalInfo = {}) {
    if (this.errorHandler) {
      this.errorHandler.handle(error, {
        context: `LearningApp.${context}`,
        component: 'LearningApp',
        ...additionalInfo
      }, false);
    } else {
      console.error(`[LearningApp] ${context}:`, error, additionalInfo);
    }
  }

  /**
   * HTML data 속성에서 설정 읽기
   * @private
   */
  _loadSettingsFromHTML() {
    try {
      const learningGauge = this.domUtils?.$(".lessons-gauge") || document.querySelector(".lessons-gauge");
      if (!learningGauge) {
        console.warn("[LearningApp] .lessons-gauge 요소를 찾을 수 없습니다.");
        return;
      }

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
    } catch (error) {
      this._handleError(error, '_loadSettingsFromHTML');
    }
  }

  /**
   * 초기화
   */
  init() {
    try {
      const initHandler = () => {
        try {
          this._initializeComponents();
        } catch (error) {
          this._handleError(error, 'init.initHandler');
        }
      };

      // DOMContentLoaded 이벤트 처리
      if (document.readyState === 'loading') {
        if (this.eventManager) {
          const listenerId = this.eventManager.on(window, "DOMContentLoaded", initHandler);
          this.listenerIds.push({ element: window, id: listenerId, type: 'DOMContentLoaded' });
        } else {
          window.addEventListener("DOMContentLoaded", initHandler);
        }
      } else {
        // 이미 로드된 경우 즉시 실행
        initHandler();
      }
    } catch (error) {
      this._handleError(error, 'init');
    }
  }

  /**
   * 컴포넌트 초기화
   * @private
   */
  _initializeComponents() {
    try {
      // 마커 생성
      if (this.markerManager && typeof this.markerManager.createMarkers === 'function') {
        this.markerManager.createMarkers();
      } else {
        console.warn("[LearningApp] markerManager.createMarkers를 호출할 수 없습니다.");
      }

      // 챕터 카드 생성
      if (this.chapterCardManager && typeof this.chapterCardManager.createChapterCards === 'function') {
        this.chapterCardManager.createChapterCards();
      } else {
        console.warn("[LearningApp] chapterCardManager.createChapterCards를 호출할 수 없습니다.");
      }

      // 진행률 표시 생성
      if (this.progressIndicator && typeof this.progressIndicator.createIndicator === 'function') {
        this.progressIndicator.createIndicator();
      } else {
        console.warn("[LearningApp] progressIndicator.createIndicator를 호출할 수 없습니다.");
      }

      // 초기 진행률 설정
      this._initializeProgress();
    } catch (error) {
      this._handleError(error, '_initializeComponents');
    }
  }

  /**
   * 초기 진행률 설정
   * @private
   */
  _initializeProgress() {
    try {
      if (!this.gauge || !this.markerManager) {
        console.warn("[LearningApp] gauge 또는 markerManager가 없습니다.");
        return;
      }

      // 초기 진행률 설정 (마커의 실제 DOM 위치 기반)
      const targetMarkerConfig = this.gauge.calculateInitialProgress(
        this.markerManager.allMarkers,
        LEARNING_CONFIG
      );

      if (!targetMarkerConfig) {
        console.warn("[LearningApp] 타겟 마커 설정을 찾을 수 없습니다.");
        return;
      }
      
      // 실제 강의만 카운트 (챕터 제외)
      const learningMarkers = (this.markerManager.allMarkers || []).filter(
        (m) => m && m.isLearningContent !== false
      );
      const completedLearningCount = learningMarkers.filter(
        (m) => m && m.completed === true
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
        const targetMarker = (this.markerManager.markers || []).find(
          (m) =>
            m &&
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
            const closestPercent = this.gauge.findClosestPathPercent(markerLeft, markerTop);
            if (closestPercent !== null && closestPercent !== undefined) {
              initialPathPercent = closestPercent;
            }
            
            console.log(
              `[LearningApp] 초기 진행률: 마커 실제 위치 (${markerLeft.toFixed(2)}%, ${markerTop.toFixed(2)}%) → pathPercent: ${initialPathPercent.toFixed(4)}`
            );
          }
        } else {
          // 마커를 찾을 수 없는 경우 gaugePercent 우선 사용, 없으면 pathPercent 사용
          initialPathPercent = targetMarkerConfig.gaugePercent !== undefined 
            ? targetMarkerConfig.gaugePercent 
            : (targetMarkerConfig.pathPercent || 0);
          console.log(
            `[LearningApp] 초기 진행률: 마커를 찾을 수 없음, ${targetMarkerConfig.gaugePercent !== undefined ? 'gaugePercent' : 'pathPercent'} 직접 사용: ${(initialPathPercent * 100).toFixed(1)}%`
          );
        }
      }
      
      // 마커 실제 위치에 가장 가까운 pathPercent를 사용하여 채움 (초기 로딩 시 애니메이션 없음)
      if (this.gauge && typeof this.gauge.setProgress === 'function') {
        this.gauge.setProgress(initialPathPercent, true, false);
      }

      // 진행률 표시 업데이트
      if (this.progressIndicator && typeof this.progressIndicator.updateProgress === 'function') {
        this.progressIndicator.updateProgress(this.markerManager.allMarkers);
      }
    } catch (error) {
      this._handleError(error, '_initializeProgress');
    }
  }

  /**
   * 학습 완료 후 챕터 카드 및 진행률 표시 업데이트
   */
  updateChapterCards() {
    try {
      if (this.chapterCardManager && typeof this.chapterCardManager.updateChapterCards === 'function') {
        this.chapterCardManager.updateChapterCards();
      }

      if (this.progressIndicator && typeof this.progressIndicator.updateProgress === 'function' && this.markerManager) {
        this.progressIndicator.updateProgress(this.markerManager.allMarkers);
      }
    } catch (error) {
      this._handleError(error, 'updateChapterCards');
    }
  }

  /**
   * 리소스 정리 (이벤트 리스너 제거)
   */
  destroy() {
    try {
      // 이벤트 리스너 제거
      if (this.eventManager && this.listenerIds.length > 0) {
        this.listenerIds.forEach(({ element, id }) => {
          this.eventManager.off(element, id);
        });
        this.listenerIds = [];
      }

      // 컴포넌트 정리
      if (this.chapterCardManager && typeof this.chapterCardManager.destroy === 'function') {
        this.chapterCardManager.destroy();
      }

      // 참조 정리
      this.gauge = null;
      this.markerManager = null;
      this.chapterCardManager = null;
      this.progressIndicator = null;
      this.modal = null;
    } catch (error) {
      this._handleError(error, 'destroy');
    }
  }
}

/**
 * 학습 앱 초기화 함수 (에러 처리 포함)
 * @param {Object} dependencies - 의존성 객체
 */
function initLearningApp(dependencies = {}) {
  try {
    // VideoModal이 정의될 때까지 대기
    if (typeof VideoModal === 'undefined') {
      // VideoModal이 아직 로드되지 않았으면 재시도
      const retryDelay = dependencies.retryDelay || 10;
      setTimeout(() => initLearningApp(dependencies), retryDelay);
      return;
    }

    // 의존성 주입 (없으면 자동 감지)
    const finalDependencies = {
      domUtils: dependencies.domUtils || (typeof DOMUtils !== 'undefined' ? DOMUtils : null),
      errorHandler: dependencies.errorHandler || (typeof ErrorHandler !== 'undefined' ? ErrorHandler : null),
      eventManager: dependencies.eventManager || (typeof eventManager !== 'undefined' ? eventManager : null),
      utils: dependencies.utils || (typeof Utils !== 'undefined' ? Utils : null),
      animationUtils: dependencies.animationUtils || (typeof AnimationUtils !== 'undefined' ? AnimationUtils : null),
      ...dependencies
    };

    // LEARNING_CONFIG 유효성 검증
    if (typeof LEARNING_CONFIG === 'undefined') {
      const error = new Error('LEARNING_CONFIG가 정의되지 않았습니다.');
      if (finalDependencies.errorHandler) {
        finalDependencies.errorHandler.handle(error, {
          context: 'initLearningApp'
        }, true); // 사용자에게 표시
      } else {
        console.error('[LearningApp]', error);
        alert('학습 설정을 불러올 수 없습니다.');
      }
      return;
    }

    // LearningApp 인스턴스 생성
    window.learningApp = new LearningApp(finalDependencies);

    if (!window.learningApp) {
      throw new Error('LearningApp 인스턴스 생성 실패');
    }

    console.log('[LearningApp] 초기화 완료');
  } catch (error) {
    const errorHandler = dependencies.errorHandler || (typeof ErrorHandler !== 'undefined' ? ErrorHandler : null);
    if (errorHandler) {
      errorHandler.handle(error, {
        context: 'initLearningApp'
      }, true); // 사용자에게 표시
    } else {
      console.error('[LearningApp] 초기화 에러:', error);
      alert('학습 앱 초기화 중 오류가 발생했습니다.');
    }
  }
}

// 초기화 실행
if (document.readyState === 'loading') {
  // DOMContentLoaded는 defer 스크립트가 모두 로드된 후에 발생
  if (typeof eventManager !== 'undefined' && eventManager) {
    eventManager.on(document, 'DOMContentLoaded', () => initLearningApp());
  } else {
    document.addEventListener('DOMContentLoaded', () => initLearningApp());
  }
} else {
  // 이미 로드된 경우 즉시 시도
  initLearningApp();
}
