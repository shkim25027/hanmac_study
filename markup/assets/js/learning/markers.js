/**
 * 마커 관리 클래스
 * 공통 모듈 활용 (ErrorHandler, DOMUtils, EventManager, Utils)
 */
class MarkerManager {
  constructor(gaugeManager, config, dependencies = {}) {
    // 의존성 주입 (폴백 포함)
    this.domUtils = dependencies.domUtils || (typeof DOMUtils !== 'undefined' ? DOMUtils : null);
    this.errorHandler = dependencies.errorHandler || (typeof ErrorHandler !== 'undefined' ? ErrorHandler : null);
    this.eventManager = dependencies.eventManager || (typeof eventManager !== 'undefined' ? eventManager : null);
    this.utils = dependencies.utils || (typeof Utils !== 'undefined' ? Utils : null);
    this.animationUtils = dependencies.animationUtils || (typeof AnimationUtils !== 'undefined' ? AnimationUtils : null);

    // 이벤트 리스너 ID 저장 (정리용)
    this.listenerIds = [];

    try {
      this.gaugeManager = gaugeManager;
      this.config = config;
      this.markers = [];
      
      this.gaugeSvg = this.domUtils?.$("#gauge-svg") || document.getElementById("gauge-svg");
      this.markersContainer = this.domUtils?.$("#markers-container") || document.getElementById("markers-container");
      
      if (!this.gaugeSvg) {
        this._handleError(new Error('gauge-svg 요소를 찾을 수 없습니다.'), 'constructor');
      }
      if (!this.markersContainer) {
        this._handleError(new Error('markers-container 요소를 찾을 수 없습니다.'), 'constructor');
      }

      this.allMarkers = config.getAllMarkers ? config.getAllMarkers() : []; // flat 배열로 저장
      this.modalInstance = null; // 모달 인스턴스 저장
      this.completionAnimationShown = false; // 완료 애니메이션 표시 여부
    } catch (error) {
      this._handleError(error, 'constructor');
    }
  }

  /**
   * 에러 처리 헬퍼
   * @private
   */
  _handleError(error, context, additionalInfo = {}) {
    if (this.errorHandler) {
      this.errorHandler.handle(error, {
        context: `MarkerManager.${context}`,
        component: 'MarkerManager',
        ...additionalInfo
      }, false);
    } else {
      console.error(`[MarkerManager] ${context}:`, error, additionalInfo);
    }
  }

  /**
   * 모달 인스턴스 설정
   * @param {VideoModal} modal - 모달 인스턴스
   */
  setModalInstance(modal) {
    this.modalInstance = modal;
  }

  /**
   * Start-line 이미지 업데이트
   * @private
   */
  _updateStartLine() {
    try {
      const startLineImg = this.domUtils?.$(".start-line img") || document.querySelector(".start-line img");
      if (!startLineImg) {
        console.warn("[MarkerManager] .start-line img 요소를 찾을 수 없습니다.");
        return;
      }

      // 실제 강의만 카운트 (챕터 제외)
      const learningMarkers = (this.allMarkers || []).filter(
        (m) => m && m.isLearningContent !== false
      );
      const completedCount = learningMarkers.filter((m) => m && m.completed === true).length;
      const allCompleted = completedCount >= learningMarkers.length;

      // 완료된 학습이 1개 이상 있고, 모든 학습이 완료되지 않았으면 on
      // 완료된 학습이 없거나, 모든 학습이 완료되었으면 off
      const hasCompletedLessons = completedCount > 0;
      const shouldShowOn = hasCompletedLessons && !allCompleted;
      
      const imagePath = shouldShowOn
        ? "./assets/images/learning/img_start_on.svg"
        : "./assets/images/learning/img_start_off.svg";

      startLineImg.src = imagePath;

      console.log(
        `[MarkerManager] Start-line 상태: ${shouldShowOn ? "ON" : "OFF"} (완료된 학습 ${completedCount}/${learningMarkers.length}개, 전체 완료: ${allCompleted})`
      );
    } catch (error) {
      this._handleError(error, '_updateStartLine');
    }
  }

  /**
   * 모든 마커 생성
   */
  createMarkers() {
    try {
      if (!this.gaugeSvg) {
        this._handleError(new Error('gaugeSvg가 없습니다.'), 'createMarkers');
        return;
      }

      if (!this.markersContainer) {
        this._handleError(new Error('markersContainer가 없습니다.'), 'createMarkers');
        return;
      }

      // SVG 컨테이너 크기 가져오기 (초기 계산용)
      const viewBox = this.gaugeSvg.viewBox.baseVal;
      if (!viewBox || !viewBox.width || !viewBox.height) {
        this._handleError(new Error('viewBox가 유효하지 않습니다.'), 'createMarkers');
        return;
      }

      if (!this.allMarkers || !Array.isArray(this.allMarkers)) {
        this._handleError(new Error('allMarkers가 배열이 아닙니다.'), 'createMarkers');
        return;
      }

      this.allMarkers.forEach((config, index) => {
        try {
          this._createMarker(config, index, viewBox);
        } catch (error) {
          this._handleError(error, 'createMarkers.marker', { index });
        }
      });

      // 마커 생성 후 즉시 이미지 업데이트
      this.updateMarkers();

      // Start-line 상태 업데이트
      this._updateStartLine();

      // 초기 로드 시 모든 학습이 완료 상태면 배경 표시 (애니메이션 없이)
      const allCompleted = this.allMarkers.every((marker) => marker && marker.completed === true);
      if (allCompleted) {
        this._showCompletionBackgroundStatic();
        this.completionAnimationShown = true; // 플래그 설정하여 중복 방지
      }

      // 윈도우 리사이즈 시 마커 위치 재계산
      this._setupResizeHandler();
    } catch (error) {
      this._handleError(error, 'createMarkers');
    }
  }

  /**
   * 리사이즈 핸들러 설정
   * @private
   */
  _setupResizeHandler() {
    try {
      const resizeHandler = () => {
        try {
          console.log("[MarkerManager] 리사이즈 감지: 마커 위치 재계산");
          this._updateMarkerPositions();
        } catch (error) {
          this._handleError(error, '_setupResizeHandler.resizeHandler');
        }
      };

      // Utils.throttle 사용 (있는 경우)
      if (this.utils && this.utils.throttle) {
        const throttledResize = this.utils.throttle(resizeHandler, 100);
        
        if (this.eventManager) {
          const listenerId = this.eventManager.on(window, "resize", throttledResize);
          this.listenerIds.push({ element: window, id: listenerId, type: 'resize' });
        } else {
          window.addEventListener("resize", throttledResize);
        }
      } else {
        // 폴백: debounce 구현
        let resizeTimer;
        const debouncedResize = () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(resizeHandler, 100);
        };

        if (this.eventManager) {
          const listenerId = this.eventManager.on(window, "resize", debouncedResize);
          this.listenerIds.push({ element: window, id: listenerId, type: 'resize' });
        } else {
          window.addEventListener("resize", debouncedResize);
        }
      }
    } catch (error) {
      this._handleError(error, '_setupResizeHandler');
    }
  }

  /**
   * 마커 위치 업데이트 (리사이즈 시)
   * @private
   */
  _updateMarkerPositions() {
    try {
      if (!this.gaugeSvg || !this.gaugeManager) {
        console.warn("[MarkerManager] gaugeSvg 또는 gaugeManager가 없습니다.");
        return;
      }

      const viewBox = this.gaugeSvg.viewBox.baseVal;
      if (!viewBox || !viewBox.width || !viewBox.height) {
        console.warn("[MarkerManager] viewBox가 유효하지 않습니다.");
        return;
      }

      this.markers.forEach((marker, index) => {
        try {
          if (!marker || !marker.config || !marker.element) {
            console.warn(`[MarkerManager] 마커 ${index}가 유효하지 않습니다.`);
            return;
          }

          const point = this.gaugeManager.getPointAtPercent(
            marker.config.pathPercent
          );

          if (!point) {
            console.warn(`[MarkerManager] 마커 ${index}의 포인트를 가져올 수 없습니다.`);
            return;
          }

          const percentX = (point.x / viewBox.width) * 100;
          const percentY = (point.y / viewBox.height) * 100;

          if (this.domUtils) {
            this.domUtils.setStyles(marker.element, {
              left: `${percentX}%`,
              top: `${percentY}%`
            });
          } else {
            marker.element.style.left = `${percentX}%`;
            marker.element.style.top = `${percentY}%`;
          }
        } catch (error) {
          this._handleError(error, '_updateMarkerPositions.marker', { index });
        }
      });
    } catch (error) {
      this._handleError(error, '_updateMarkerPositions');
    }
  }

  /**
   * 개별 마커 생성
   * @private
   */
  _createMarker(config, index, viewBox) {
    try {
      if (!config) {
        console.warn(`[MarkerManager] 마커 ${index}의 config가 없습니다.`);
        return;
      }

      if (!this.markersContainer) {
        this._handleError(new Error('markersContainer가 없습니다.'), '_createMarker');
        return;
      }

      if (!viewBox || !viewBox.width || !viewBox.height) {
        this._handleError(new Error('viewBox가 유효하지 않습니다.'), '_createMarker');
        return;
      }

      const point = this.gaugeManager.getPointAtPercent(config.pathPercent);
      if (!point) {
        console.warn(`[MarkerManager] 마커 ${index}의 포인트를 가져올 수 없습니다.`);
        return;
      }

      const marker = this.domUtils?.createElement('div', { class: 'marker' }) || document.createElement("div");
      marker.className = "marker";
      if (config.type === "chapter") {
        this.domUtils?.addClasses(marker, 'chapter') || marker.classList.add("chapter");
      }

      marker.dataset.index = index;
      marker.dataset.type = config.type || 'normal';
      marker.dataset.percent = config.pathPercent || 0;

      const img = this.domUtils?.createElement('img', {
        style: { height: 'auto' },
        loading: 'lazy'
      }) || document.createElement("img");
      
      if (!this.domUtils) {
        img.style.height = "auto";
        img.loading = "lazy";
      }
      
      marker.appendChild(img);
      this.markersContainer.appendChild(marker);

      // 퍼센트 기반 위치 계산
      const percentX = (point.x / viewBox.width) * 100;
      const percentY = (point.y / viewBox.height) * 100;

      if (this.domUtils) {
        this.domUtils.setStyles(marker, {
          left: `${percentX}%`,
          top: `${percentY}%`,
          cursor: "default",
          pointerEvents: "none"
        });
      } else {
        marker.style.left = `${percentX}%`;
        marker.style.top = `${percentY}%`;
        marker.style.cursor = "default";
        marker.style.pointerEvents = "none"; // 클릭 이벤트 완전 차단
      }

      console.log(
        `[MarkerManager] 마커 [${index}] 생성: (${percentX.toFixed(2)}%, ${percentY.toFixed(2)}%)`
      );

      this._setMarkerState(marker, index);

      this.markers.push({
        element: marker,
        img: img,
        config: config,
        point: point,
      });
    } catch (error) {
      this._handleError(error, '_createMarker', { index, config });
    }
  }

  /**
   * 마커 상태 설정
   * @private
   */
  _setMarkerState(marker, index) {
    const config = this.allMarkers[index];

    // 기존 상태 클래스 제거
    marker.classList.remove("current", "completed");

    if (config.completed) {
      // 완료된 마커
      marker.classList.add("completed");
    } else if (this.isMarkerClickable(index)) {
      // 현재 학습 가능한 마커 (current)
      marker.classList.add("current");
    }

    console.log(
      `[MarkerManager] 마커 [${index}] 상태: ${config.completed ? "completed" : this.isMarkerClickable(index) ? "current" : "base"}`
    );
  }

  /**
   * 마커 클릭 가능 여부 확인 (진행 상태 판단용)
   * @param {number} index - 마커 인덱스
   * @returns {boolean}
   */
  isMarkerClickable(index) {
    const currentMarker = this.allMarkers[index];

    // 챕터 마커는 시작점 표시용이므로 클릭 불가
    if (currentMarker.isChapterMarker) {
      return false;
    }

    // 첫 번째 실제 강의는 항상 활성화
    if (index === 0) return true;

    // 이전 마커 확인 (챕터 마커는 건너뛰고 실제 강의만 체크)
    for (let i = index - 1; i >= 0; i--) {
      const prevMarker = this.allMarkers[i];

      // 챕터 마커는 건너뛰기
      if (prevMarker.isChapterMarker) {
        continue;
      }

      // 이전 실제 강의가 완료되었으면 현재 마커 활성화
      return prevMarker.completed;
    }

    // 이전에 실제 강의가 없으면 활성화
    return true;
  }
  /**
   * 마커 상태 업데이트
   * @param {number} progress - 현재 진행률 (선택적)
   */
  updateMarkers(progress) {
    this.markers.forEach((marker, index) => {
      // allMarkers에서 최신 상태 가져오기
      const config = this.allMarkers[index];
      const imgSrc = this._getMarkerImage(config, index);
      marker.img.src = imgSrc;

      // marker.config도 업데이트하여 참조 동기화
      marker.config = config;

      // ========== 이미지에 따른 클래스 업데이트 ==========
      const element = marker.element;
      element.classList.remove("current", "completed");

      // 이미지 경로에서 상태 판단
      if (
        imgSrc.includes("_completed.png") ||
        imgSrc.includes("_complete.png")
      ) {
        element.classList.add("completed");
      } else if (imgSrc.includes("_current.png")) {
        element.classList.add("current");
      }
      // ==================================================
    });
  }

  /**
   * 마커 이미지 결정
   * @private
   */
  _getMarkerImage(config, index) {
    const images = this.config.markerImages[config.type];

    // 챕터 마커인 경우 특별 처리
    if (config.isChapterMarker) {
      // 하위 lessons가 모두 완료되면 completed
      if (config.completed) {
        return images.completed;
      }

      // 하위 lessons 중 1개라도 완료 또는 학습 중이면 current
      const chapter = this.config.chapters.find(
        (ch) => ch.id === config.chapterId
      );
      if (chapter) {
        const anyLessonStarted = chapter.lessons.some(
          (lesson) => lesson.completed
        );
        if (anyLessonStarted) {
          return images.current; // mark_chapter_current.png 반환
        }
      }

      // 챕터가 활성화되었는지 체크 (이전 챕터 완료)
      if (this._isChapterActive(index)) {
        return images.current; // mark_chapter_current.png 반환
      }

      return images.base;
    }

    // 일반 마커인 경우
    if (config.completed) {
      return images.completed;
    } else if (this.isMarkerClickable(index) && !config.completed) {
      return images.current;
    } else {
      return images.base;
    }
  }

  /**
   * 챕터 마커 활성화 여부 확인
   * @private
   */
  _isChapterActive(chapterMarkerIndex) {
    if (chapterMarkerIndex === 0) return true; // 첫 챕터는 항상 활성

    // 이전 마커들 중 마지막 실제 강의가 완료되었는지 확인
    for (let i = chapterMarkerIndex - 1; i >= 0; i--) {
      const prevMarker = this.allMarkers[i];

      // 챕터 마커는 건너뛰기
      if (prevMarker.isChapterMarker) {
        continue;
      }

      // 이전 실제 강의가 완료되었으면 현재 챕터 활성화
      return prevMarker.completed;
    }

    return true;
  }

  /**
   * 마커 클릭 가능 여부 업데이트
   */
  updateMarkerClickability() {
    this.markers.forEach((marker, index) => {
      const element = marker.element;
      const config = marker.config;

      // 기존 상태 클래스 제거
      element.classList.remove("current", "completed");

      // 상태에 따라 클래스 업데이트
      if (config.completed) {
        element.classList.add("completed");
      } else if (this.isMarkerClickable(index)) {
        element.classList.add("current");
      }
    });

    console.log("[MarkerManager] 마커 상태 업데이트 완료");
  }

  /**
   * 학습 완료 처리
   * @param {number} index - 완료할 학습 인덱스
   */
  completeLesson(index) {
    try {
      // 입력값 유효성 검증
      if (typeof index !== 'number' || index < 0) {
        this._handleError(new Error(`유효하지 않은 index: ${index}`), 'completeLesson');
        return;
      }

      if (!this.allMarkers || !Array.isArray(this.allMarkers) || index >= this.allMarkers.length) {
        this._handleError(new Error(`index ${index}가 범위를 벗어났습니다.`), 'completeLesson');
        return;
      }

      if (!this.allMarkers[index]) {
        this._handleError(new Error(`마커 ${index}가 null입니다.`), 'completeLesson');
        return;
      }

      // 1. allMarkers 업데이트
      this.allMarkers[index].completed = true;

    // 2. 원본 config의 lessons도 업데이트
    const markerData = this.allMarkers[index];
    const chapterId = markerData.chapterId;
    const chapter = this.config.chapters.find((ch) => ch.id === chapterId);

    if (chapter && !markerData.isChapterMarker) {
      // 실제 강의인 경우 원본 lessons 배열에서 찾아서 업데이트
      const lesson = chapter.lessons.find(
        (l) =>
          l.pathPercent === markerData.pathPercent &&
          l.label === markerData.label
      );
      if (lesson) {
        lesson.completed = true;
        console.log(
          `[MarkerManager] 원본 config 업데이트: ${lesson.label} completed = true`
        );
      }
    }

    // 3. 챕터 완료 상태 업데이트
    this.config.updateChapterCompletionStatus();

    // 4. allMarkers 재로드 (챕터 completed 상태 반영)
    this.allMarkers = this.config.getAllMarkers();

    const settings = this.config.settings || {};
    let progressPercent;

    // 실제 강의만 카운트 (챕터 제외)
    const learningMarkers = this.allMarkers.filter(
      (m) => m.isLearningContent !== false
    );
    const completedLearningCount = learningMarkers.filter(
      (m) => m.completed
    ).length;

    let targetPathPercent = 0;
    let targetConfig = null;

    if (settings.allowDisabledClick) {
      // 비활성 마커 클릭 허용 모드: 다음 학습 마커까지
      if (completedLearningCount === 0) {
        // 첫 번째 챕터 마커까지
        const firstChapterMarker = this.allMarkers.find(
          (m) => m.isChapterMarker === true
        );
        targetConfig = firstChapterMarker;
      } else if (completedLearningCount >= learningMarkers.length) {
        // 전체 완료: 마지막 마커 위치
        targetConfig = this.allMarkers[this.allMarkers.length - 1];
      } else {
        // 다음 학습할 강의 마커 위치
        const nextLearningMarker = learningMarkers[completedLearningCount];
        const nextMarkerIndex = this.allMarkers.findIndex(
          (m) =>
            m.pathPercent === nextLearningMarker.pathPercent &&
            m.label === nextLearningMarker.label
        );
        targetConfig = this.allMarkers[nextMarkerIndex];
      }
    } else {
      // 순차 학습 모드: 다음 학습 마커까지
      if (completedLearningCount === 0) {
        // 첫 번째 챕터 마커까지
        const firstChapterMarker = this.allMarkers.find(
          (m) => m.isChapterMarker === true
        );
        targetConfig = firstChapterMarker;
      } else if (completedLearningCount >= learningMarkers.length) {
        // 전체 완료: 마지막 마커 위치
        targetConfig = this.allMarkers[this.allMarkers.length - 1];
      } else {
        // 다음 학습할 강의 마커 위치
        const nextLearningMarker = learningMarkers[completedLearningCount];
        const nextMarkerIndex = this.allMarkers.findIndex(
          (m) =>
            m.pathPercent === nextLearningMarker.pathPercent &&
            m.label === nextLearningMarker.label
        );
        targetConfig = this.allMarkers[nextMarkerIndex];
      }
    }

    // 타겟 마커 찾기 (pathPercent로 비교)
    const targetMarker = targetConfig
      ? this.markers.find(
          (m) =>
            m.config &&
            m.config.pathPercent === targetConfig.pathPercent &&
            m.config.label === targetConfig.label
        )
      : null;

    // 100% 완료 시 게이지바를 100%로 채움
    if (completedLearningCount >= learningMarkers.length) {
      targetPathPercent = 1.0; // 100% 완료
      progressPercent = 100;
      console.log(
        `[MarkerManager] 모든 학습 완료: 게이지바 100%로 설정`
      );
    } else if (targetMarker && targetMarker.element) {
      // gaugePercent가 있으면 우선 사용, 없으면 마커의 실제 DOM 위치 기반으로 계산
      if (targetConfig.gaugePercent !== undefined) {
        targetPathPercent = targetConfig.gaugePercent;
        progressPercent = targetPathPercent * 100;
        console.log(
          `[MarkerManager] gaugePercent 사용: ${progressPercent.toFixed(1)}%`
        );
      } else {
        // 마커의 실제 DOM 위치 가져오기
        const markerLeft = parseFloat(targetMarker.element.style.left) || 0;
        const markerTop = parseFloat(targetMarker.element.style.top) || 0;
        
        // maskPath에서 마커 위치에 가장 가까운 지점 찾기
        targetPathPercent = this.gaugeManager.findClosestPathPercent(markerLeft, markerTop);
        
        progressPercent = targetPathPercent * 100; // 로그용
        console.log(
          `[MarkerManager] 마커 실제 위치 기반: (${markerLeft.toFixed(2)}%, ${markerTop.toFixed(2)}%) → pathPercent: ${targetPathPercent.toFixed(4)} (${progressPercent.toFixed(1)}%)`
        );
      }
    } else if (targetConfig) {
      // 마커를 찾을 수 없는 경우 gaugePercent 우선 사용, 없으면 pathPercent 사용
      targetPathPercent = targetConfig.gaugePercent !== undefined ? targetConfig.gaugePercent : (targetConfig.pathPercent || 0);
      progressPercent = targetPathPercent * 100;
      console.log(
        `[MarkerManager] 마커를 찾을 수 없음, ${targetConfig.gaugePercent !== undefined ? 'gaugePercent' : 'pathPercent'} 직접 사용: ${progressPercent.toFixed(1)}%`
      );
    }

    // 마커 실제 위치에 가장 가까운 pathPercent를 사용하여 채움
    this.gaugeManager.setProgress(targetPathPercent, true);
    this.updateMarkers(progressPercent);
    this.updateMarkerClickability();

    // Start-line 상태 업데이트 (첫 학습 완료 시 OFF → ON 전환)
    this._updateStartLine();

    // 100% 완료 시 폭죽 애니메이션 표시 (실제 강의 기준)
    const allLearningCompleted = learningMarkers.every((m) => m.completed);
    if (allLearningCompleted && !this.completionAnimationShown) {
      // 기존 정적 배경이 있으면 제거
      const existingStaticBg = document.querySelector(".completion-background");
      if (existingStaticBg) {
        existingStaticBg.remove();
      }
      this._showCompletionAnimation();
      this.completionAnimationShown = true;
    }

    // 챕터 카드 상태 업데이트
    if (window.learningApp && window.learningApp.updateChapterCards) {
      window.learningApp.updateChapterCards();
    }

      console.log(
        `[MarkerManager] 학습 ${index + 1} 완료! (${completedLearningCount}/${learningMarkers.length} 강의) ` +
          `진행률: ${progressPercent ? progressPercent.toFixed(1) : 0}%`
      );
    } catch (error) {
      this._handleError(error, 'completeLesson', { index });
    }
  }

  /**
   * 수강완료 시 page-title 업데이트
   * @private
   */
  _updatePageTitleOnCompletion() {
    try {
      const pageTitle = this.domUtils?.$(".page-title") || document.querySelector(".page-title");
      if (!pageTitle) {
        console.warn("[MarkerManager] .page-title 요소를 찾을 수 없습니다.");
        return;
      }

      // 현재 이름 추출 (h3 em 태그에서)
      const h3 = this.domUtils?.$("h3", pageTitle) || pageTitle.querySelector("h3");
      const em = h3 ? (this.domUtils?.$("em", h3) || h3.querySelector("em")) : null;
      let userName = "";
      
      if (em) {
        // "님" 제거하여 이름만 추출
        userName = em.textContent.replace(/님$/, "").trim();
      }

      // h3 업데이트
      if (h3) {
        h3.innerHTML = `
          <span><em>${userName}</em>님,</span> 수고하셨습니다.
        `;
      }

      // p 태그 업데이트
      const p = this.domUtils?.$("p", pageTitle) || pageTitle.querySelector("p");
      if (p) {
        const currentYear = new Date().getFullYear();
        p.innerHTML = `
          <em>${currentYear}년 법정의무교육</em> 시청을
          완료하셨습니다.
        `;
      }

      console.log("[MarkerManager] page-title 업데이트 완료");
    } catch (error) {
      this._handleError(error, '_updatePageTitleOnCompletion');
    }
  }

  /**
   * 학습 완료 배경 표시
   * @private
   */
  _showCompletionAnimation() {
    try {
      console.log("[MarkerManager] 🎉 모든 학습 완료! 완료 배경 표시");

      // page-title 업데이트
      this._updatePageTitleOnCompletion();

      // 기존 완료 배경이 있으면 제거
      const existingBg = this.domUtils?.$(".completion-background") || document.querySelector(".completion-background");
      if (existingBg) {
        this.domUtils?.remove(existingBg) || existingBg.remove();
      }

      // 완료 배경 컨테이너 생성
      const backgroundContainer = this.domUtils?.createElement('div', {
        class: 'completion-background',
        style: {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: '1'
        }
      }) || document.createElement("div");
      
      if (!this.domUtils) {
        backgroundContainer.className = "completion-background";
        backgroundContainer.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        `;
      }

      // SVG 배경 추가
      const svgWrapper = this.domUtils?.createElement('div', {
        style: {
          position: 'absolute',
          top: '49%',
          left: '51%',
          width: '100%',
          height: '100%',
          opacity: '0',
          translate: '-50% -50%',
          animation: 'fadeIn 1.5s ease-in-out forwards'
        }
      }) || document.createElement("div");
      
      if (!this.domUtils) {
        svgWrapper.style.cssText = `
          position: absolute;
          top: 49%;
          left: 51%;
          width: 100%;
          height: 100%;
          opacity: 0;
          translate: -50% -50%;
          animation: fadeIn 1.5s ease-in-out forwards;
        `;
      }

      // SVG 로드 및 추가
      fetch("./assets/images/learning/completion-bg.svg")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`SVG 로드 실패: ${response.status}`);
          }
          return response.text();
        })
        .then((svgContent) => {
          try {
            svgWrapper.innerHTML = svgContent;
            const svg = svgWrapper.querySelector("svg");
            if (svg) {
              // 패턴 ID 중복 방지: 고유한 ID로 변경
              const uniqueId = `completion-bg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              const patterns = svg.querySelectorAll(
                "pattern[id], filter[id], mask[id], linearGradient[id], radialGradient[id]"
              );
              const idMap = new Map();

              patterns.forEach((pattern) => {
                const oldId = pattern.getAttribute("id");
                if (oldId) {
                  const newId = `${oldId}-${uniqueId}`;
                  idMap.set(oldId, newId);
                  pattern.setAttribute("id", newId);
                }
              });

              // 패턴을 참조하는 모든 요소의 url(#...) 업데이트
              const allElements = svg.querySelectorAll("*");
              allElements.forEach((el) => {
                // fill, stroke, filter, mask 등 속성 업데이트
                ["fill", "stroke", "filter", "mask"].forEach((attr) => {
                  const value = el.getAttribute(attr);
                  if (value && value.startsWith("url(#")) {
                    const match = value.match(/url\(#([^)]+)\)/);
                    if (match) {
                      const oldId = match[1];
                      if (idMap.has(oldId)) {
                        el.setAttribute(attr, `url(#${idMap.get(oldId)})`);
                      }
                    }
                  }
                });
              });

              console.log(`[MarkerManager] 패턴 ID 고유화 완료: ${uniqueId}`);

              // 흰색 배경 rect/path 요소 제거 (x="-34" y="-19" 또는 fill="white"인 요소)
              const whiteBgElements = svg.querySelectorAll(
                'rect[fill="white"], path[fill="#fff"], path[fill="white"]'
              );
              whiteBgElements.forEach((el) => {
                const x = el.getAttribute("x");
                const y = el.getAttribute("y");
                // SVG 파일의 흰색 배경 rect (x="-34" y="-19") 제거
                if (
                  (x === "-34" && y === "-19") ||
                  el.getAttribute("fill") === "white" ||
                  el.getAttribute("fill") === "#fff"
                ) {
                  el.remove();
                  console.log("[MarkerManager] 흰색 배경 요소 제거");
                }
              });

              // "수강완료" 텍스트 요소 제거 또는 숨김
              const allTexts = svg.querySelectorAll("text, tspan");
              allTexts.forEach((textEl) => {
                const textContent = textEl.textContent || "";
                if (
                  textContent.includes("수강완료") ||
                  textContent.includes("완료")
                ) {
                  textEl.style.display = "none";
                  console.log("[MarkerManager] '수강완료' 텍스트 요소 숨김");
                }
              });

              // 화면 크기에 맞게 viewBox 동적 조정
              const screenWidth = window.innerWidth;
              const screenHeight = window.innerHeight;
              const screenRatio = screenWidth / screenHeight;
              const svgRatio = 1911 / 918;

              let newViewBox;
              if (screenRatio > svgRatio) {
                // 화면이 더 넓음 - 세로 기준으로 viewBox 확장
                const newWidth = 918 * screenRatio;
                const offsetX = (newWidth - 1911) / 2;
                newViewBox = `${-offsetX} 0 ${newWidth} 918`;
              } else {
                // 화면이 더 높음 - 가로 기준으로 viewBox 확장
                const newHeight = 1911 / screenRatio;
                const offsetY = (newHeight - 918) / 2;
                newViewBox = `0 ${-offsetY} 1911 ${newHeight}`;
              }

              svg.setAttribute("viewBox", newViewBox);
              svg.removeAttribute("width");
              svg.removeAttribute("height");
              svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
              svg.style.cssText = `
                width: 100%;
                height: 100%;
              `;

              console.log(`[MarkerManager] SVG viewBox 조정: ${newViewBox}`);
            }
          } catch (error) {
            this._handleError(error, '_showCompletionAnimation.svgProcessing');
          }
        })
        .catch((error) => {
          this._handleError(error, '_showCompletionAnimation.fetch');
          console.warn("[MarkerManager] SVG 로드 실패");
        });

      backgroundContainer.appendChild(svgWrapper);

      // CSS 애니메이션 정의 및 상단 왼쪽 영역 숨김 (처음 표시될 때만)
      if (!(this.domUtils?.$("#completion-animation-style") || document.getElementById("completion-animation-style"))) {
        const style = this.domUtils?.createElement('style', { id: 'completion-animation-style' }) || document.createElement("style");
        style.id = "completion-animation-style";
        style.textContent = `
          @keyframes fadeIn {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          /* 상단 왼쪽 영역의 "수강완료" 텍스트 숨김 */
          .completion-background {
            overflow: hidden;
          }
          .completion-background svg {
            position: relative;
          }
        `;
        document.head.appendChild(style);
      }

      const container = this.domUtils?.$(".container") || document.querySelector(".container");
      if (container) {
        container.appendChild(backgroundContainer);
      } else {
        console.warn("[MarkerManager] .container 요소를 찾을 수 없습니다.");
      }
    } catch (error) {
      this._handleError(error, '_showCompletionAnimation');
    }
  }

  /**
   * 초기 완료 배경 표시 (애니메이션 없이)
   * @private
   */
  _showCompletionBackgroundStatic() {
    try {
      console.log("[MarkerManager] 학습 완료 상태 - 배경 표시");

      // page-title 업데이트
      this._updatePageTitleOnCompletion();

      // 기존 완료 배경이 있으면 제거
      const existingBg = this.domUtils?.$(".completion-background") || document.querySelector(".completion-background");
      if (existingBg) {
        this.domUtils?.remove(existingBg) || existingBg.remove(); // 기존 배경 제거 후 새로 생성
      }

      // 완료 배경 컨테이너 생성
      const backgroundContainer = this.domUtils?.createElement('div', {
        class: 'completion-background',
        style: {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: '1'
        }
      }) || document.createElement("div");
      
      if (!this.domUtils) {
        backgroundContainer.className = "completion-background";
        backgroundContainer.style.cssText = `
          position: fixed;
          top:0;
          left:0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        `;
      }

      // SVG 배경 추가 (애니메이션 없이)
      const svgWrapper = this.domUtils?.createElement('div', {
        style: {
          position: 'absolute',
          top: '49%',
          left: '51%',
          width: '100%',
          height: '100%',
          opacity: '1',
          translate: '-50% -50%'
        }
      }) || document.createElement("div");
      
      if (!this.domUtils) {
        svgWrapper.style.cssText = `
          position: absolute;
          top: 49%;
          left: 51%;
          width: 100%;
          height: 100%;
          opacity: 1;
          translate: -50% -50%;
        `;
      }

      // SVG 로드 및 추가
      fetch("./assets/images/learning/completion-bg.svg")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`SVG 로드 실패: ${response.status}`);
          }
          return response.text();
        })
        .then((svgContent) => {
          try {
            svgWrapper.innerHTML = svgContent;
            const svg = svgWrapper.querySelector("svg");
            if (svg) {
          // 패턴 ID 중복 방지: 고유한 ID로 변경
          const uniqueId = `completion-bg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const patterns = svg.querySelectorAll(
            "pattern[id], filter[id], mask[id], linearGradient[id], radialGradient[id]"
          );
          const idMap = new Map();

          patterns.forEach((pattern) => {
            const oldId = pattern.getAttribute("id");
            if (oldId) {
              const newId = `${oldId}-${uniqueId}`;
              idMap.set(oldId, newId);
              pattern.setAttribute("id", newId);
            }
          });

          // 패턴을 참조하는 모든 요소의 url(#...) 업데이트
          const allElements = svg.querySelectorAll("*");
          allElements.forEach((el) => {
            // fill, stroke, filter, mask 등 속성 업데이트
            ["fill", "stroke", "filter", "mask"].forEach((attr) => {
              const value = el.getAttribute(attr);
              if (value && value.startsWith("url(#")) {
                const match = value.match(/url\(#([^)]+)\)/);
                if (match) {
                  const oldId = match[1];
                  if (idMap.has(oldId)) {
                    el.setAttribute(attr, `url(#${idMap.get(oldId)})`);
                  }
                }
              }
            });
          });

          console.log(`[MarkerManager] 패턴 ID 고유화 완료: ${uniqueId}`);

          // 흰색 배경 rect/path 요소 제거 (x="-34" y="-19" 또는 fill="white"인 요소)
          const whiteBgElements = svg.querySelectorAll(
            'rect[fill="white"], path[fill="#fff"], path[fill="white"]'
          );
          whiteBgElements.forEach((el) => {
            const x = el.getAttribute("x");
            const y = el.getAttribute("y");
            // SVG 파일의 흰색 배경 rect (x="-34" y="-19") 제거
            if (
              (x === "-34" && y === "-19") ||
              el.getAttribute("fill") === "white" ||
              el.getAttribute("fill") === "#fff"
            ) {
              el.remove();
              console.log("[MarkerManager] 흰색 배경 요소 제거");
            }
          });

          // "수강완료" 텍스트 요소 제거 또는 숨김
          const allTexts = svg.querySelectorAll("text, tspan");
          allTexts.forEach((textEl) => {
            const textContent = textEl.textContent || "";
            if (
              textContent.includes("수강완료") ||
              textContent.includes("완료")
            ) {
              textEl.style.display = "none";
              console.log("[MarkerManager] '수강완료' 텍스트 요소 숨김");
            }
          });

          // 화면 크기에 맞게 viewBox 동적 조정
          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;
          const screenRatio = screenWidth / screenHeight;
          const svgRatio = 1911 / 918;

          let newViewBox;
          if (screenRatio > svgRatio) {
            // 화면이 더 넓음 - 세로 기준으로 viewBox 확장
            const newWidth = 918 * screenRatio;
            const offsetX = (newWidth - 1911) / 2;
            newViewBox = `${-offsetX} 0 ${newWidth} 918`;
          } else {
            // 화면이 더 높음 - 가로 기준으로 viewBox 확장
            const newHeight = 1911 / screenRatio;
            const offsetY = (newHeight - 918) / 2;
            newViewBox = `0 ${-offsetY} 1911 ${newHeight}`;
          }

          svg.setAttribute("viewBox", newViewBox);
          svg.removeAttribute("width");
          svg.removeAttribute("height");
          svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
          svg.style.cssText = `
            width: 100%;
            height: 100%;
          `;

              console.log(`[MarkerManager] SVG viewBox 조정: ${newViewBox}`);
            }
          } catch (error) {
            this._handleError(error, '_showCompletionBackgroundStatic.svgProcessing');
          }
        })
        .catch((error) => {
          this._handleError(error, '_showCompletionBackgroundStatic.fetch');
          console.warn("[MarkerManager] SVG 로드 실패");
        });

      backgroundContainer.appendChild(svgWrapper);

      const container = this.domUtils?.$(".container") || document.querySelector(".container");
      if (container) {
        container.appendChild(backgroundContainer);
      } else {
        console.warn("[MarkerManager] .container 요소를 찾을 수 없습니다.");
      }
    } catch (error) {
      this._handleError(error, '_showCompletionBackgroundStatic');
    }
  }
}
