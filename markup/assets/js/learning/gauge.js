/**
 * 게이지 진행률 관리 클래스
 * 공통 모듈 활용 (ErrorHandler, DOMUtils, AnimationUtils, Utils)
 */
class GaugeManager {
  constructor(dependencies = {}) {
    // 의존성 주입 (폴백 포함)
    this.domUtils = dependencies.domUtils || (typeof DOMUtils !== 'undefined' ? DOMUtils : null);
    this.errorHandler = dependencies.errorHandler || (typeof ErrorHandler !== 'undefined' ? ErrorHandler : null);
    this.animationUtils = dependencies.animationUtils || (typeof AnimationUtils !== 'undefined' ? AnimationUtils : null);
    this.utils = dependencies.utils || (typeof Utils !== 'undefined' ? Utils : null);

    try {
      this.maskPath = this.domUtils?.$("#maskPath") || document.getElementById("maskPath");
      this.gaugeSvg = this.domUtils?.$("#gauge-svg") || document.getElementById("gauge-svg");
      this.pathLength = 0;

      if (!this.maskPath) {
        this._handleError(new Error('maskPath 요소를 찾을 수 없습니다.'), 'GaugeManager.constructor');
      }
      if (!this.gaugeSvg) {
        this._handleError(new Error('gauge-svg 요소를 찾을 수 없습니다.'), 'GaugeManager.constructor');
      }
    } catch (error) {
      this._handleError(error, 'GaugeManager.constructor');
    }
  }

  /**
   * 에러 처리 헬퍼
   * @private
   */
  _handleError(error, context, additionalInfo = {}) {
    if (this.errorHandler) {
      this.errorHandler.handle(error, {
        context: `GaugeManager.${context}`,
        component: 'GaugeManager',
        ...additionalInfo
      }, false);
    } else {
      console.error(`[GaugeManager] ${context}:`, error, additionalInfo);
    }
  }

  /**
   * 진행률 설정
   * @param {number} percent - 진행률 (0-100) 또는 pathPercent (0-1)
   * @param {boolean} isPathPercent - percent가 pathPercent인지 여부 (기본값: false)
   * @param {boolean} animate - 애니메이션 적용 여부 (기본값: true)
   */
  setProgress(percent, isPathPercent = false, animate = true) {
    try {
      if (!this.maskPath) {
        this._handleError(new Error('maskPath 요소를 찾을 수 없습니다.'), 'setProgress');
        return;
      }

      // 입력값 유효성 검증
      if (typeof percent !== 'number' || isNaN(percent)) {
        this._handleError(new Error(`유효하지 않은 percent 값: ${percent}`), 'setProgress');
        return;
      }

      if (this.pathLength === 0) {
        this.pathLength = this.maskPath.getTotalLength();
        if (this.pathLength === 0) {
          this._handleError(new Error('pathLength가 0입니다.'), 'setProgress');
          return;
        }
      }

      let targetPathPercent;
      
      if (isPathPercent) {
        // pathPercent를 직접 사용 (0-1)
        targetPathPercent = Math.max(0, Math.min(1, percent));
      } else {
        // percent를 pathPercent로 변환 (0-100 -> 0-1)
        targetPathPercent = Math.max(0, Math.min(1, percent / 100));
      }

      // maskPath는 아래에서 위로 채워지므로, pathPercent에 해당하는 길이까지만 채움
      // pathPercent가 0이면 시작점, 1이면 끝점
      const targetLength = this.pathLength * targetPathPercent;
      const targetOffset = this.pathLength - targetLength;
      
      // 애니메이션 처리
      if (animate) {
        // AnimationUtils 활용 (있는 경우)
        if (this.animationUtils) {
          // progressBar 애니메이션을 SVG path에 적용하기 어려우므로 기존 방식 유지
          // 하지만 transition은 DOMUtils로 관리 가능
          if (this.domUtils) {
            this.domUtils.setStyles(this.maskPath, {
              transition: "stroke-dashoffset 0.8s ease-out"
            });
          } else {
            if (!this.maskPath.style.transition) {
              this.maskPath.style.transition = "stroke-dashoffset 0.8s ease-out";
            }
          }
        } else {
          // 애니메이션을 위한 transition 추가
          if (!this.maskPath.style.transition) {
            this.maskPath.style.transition = "stroke-dashoffset 0.8s ease-out";
          }
        }
      } else {
        // 초기 로딩 시 애니메이션 없이 즉시 적용
        // transition을 먼저 none으로 설정하여 이전 애니메이션 방지
        if (this.domUtils) {
          this.domUtils.setStyles(this.maskPath, {
            transition: "none"
          });
        } else {
          this.maskPath.style.transition = "none";
        }
        
        // 강제로 레이아웃 계산하여 transition 변경사항 즉시 적용
        void this.maskPath.offsetHeight;
      }
      
      // stroke-dasharray를 pathLength로 설정하여 gap이 없도록 함
      // [dash, gap] 형태에서 gap을 0으로 설정하면 연속된 선이 됨
      // setAttribute를 사용하여 인라인 스타일을 확실하게 덮어쓰기
      this.maskPath.setAttribute('stroke-dasharray', `${this.pathLength} 0`);
      
      // offset 업데이트
      if (this.domUtils) {
        this.domUtils.setStyles(this.maskPath, {
          strokeDashoffset: targetOffset
        });
      } else {
        this.maskPath.style.strokeDashoffset = targetOffset;
      }
      
      // 애니메이션 비활성화 후 다음 업데이트를 위해 transition 복원
      if (!animate) {
        // 강제로 레이아웃 계산하여 값 변경사항 즉시 적용
        void this.maskPath.offsetHeight;
        
        // 다음 프레임에서 transition 복원 (현재 변경사항 적용 후)
        requestAnimationFrame(() => {
          if (this.domUtils) {
            this.domUtils.setStyles(this.maskPath, {
              transition: "stroke-dashoffset 0.8s ease-out"
            });
          } else {
            this.maskPath.style.transition = "stroke-dashoffset 0.8s ease-out";
          }
        });
      }
      
      console.log(
        `[GaugeManager] setProgress: pathPercent=${targetPathPercent.toFixed(4)}, targetOffset=${targetOffset.toFixed(2)}, pathLength=${this.pathLength.toFixed(2)}, animate=${animate}`
      );
    } catch (error) {
      this._handleError(error, 'setProgress', { percent, isPathPercent, animate });
    }
  }

  /**
   * 경로상의 특정 위치 좌표 반환
   * @param {number} percent - 위치 (0-1)
   * @returns {DOMPoint|null} 좌표
   */
  getPointAtPercent(percent) {
    try {
      if (!this.maskPath) {
        this._handleError(new Error('maskPath 요소를 찾을 수 없습니다.'), 'getPointAtPercent');
        return null;
      }

      // 입력값 유효성 검증
      if (typeof percent !== 'number' || isNaN(percent)) {
        this._handleError(new Error(`유효하지 않은 percent 값: ${percent}`), 'getPointAtPercent');
        return null;
      }

      // percent를 0-1 범위로 제한
      const clampedPercent = Math.max(0, Math.min(1, percent));

      if (this.pathLength === 0) {
        this.pathLength = this.maskPath.getTotalLength();
        if (this.pathLength === 0) {
          this._handleError(new Error('pathLength가 0입니다.'), 'getPointAtPercent');
          return null;
        }
      }

      return this.maskPath.getPointAtLength(this.pathLength * clampedPercent);
    } catch (error) {
      this._handleError(error, 'getPointAtPercent', { percent });
      return null;
    }
  }

  /**
   * 마커의 실제 DOM 위치에 가장 가까운 maskPath 지점 찾기
   * @param {number} markerPercentX - 마커의 X 위치 (퍼센트)
   * @param {number} markerPercentY - 마커의 Y 위치 (퍼센트)
   * @returns {number} 가장 가까운 지점의 pathPercent (0-1)
   */
  findClosestPathPercent(markerPercentX, markerPercentY) {
    try {
      if (!this.maskPath || !this.gaugeSvg) {
        this._handleError(new Error('maskPath 또는 gaugeSvg 요소를 찾을 수 없습니다.'), 'findClosestPathPercent');
        return 0;
      }

      // 입력값 유효성 검증
      if (typeof markerPercentX !== 'number' || isNaN(markerPercentX) ||
          typeof markerPercentY !== 'number' || isNaN(markerPercentY)) {
        this._handleError(new Error(`유효하지 않은 좌표 값: (${markerPercentX}, ${markerPercentY})`), 'findClosestPathPercent');
        return 0;
      }

      if (this.pathLength === 0) {
        this.pathLength = this.maskPath.getTotalLength();
        if (this.pathLength === 0) {
          this._handleError(new Error('pathLength가 0입니다.'), 'findClosestPathPercent');
          return 0;
        }
      }

      const viewBox = this.gaugeSvg.viewBox.baseVal;
      if (!viewBox || !viewBox.width || !viewBox.height) {
        this._handleError(new Error('viewBox가 유효하지 않습니다.'), 'findClosestPathPercent');
        return 0;
      }

      const markerX = (markerPercentX / 100) * viewBox.width;
      const markerY = (markerPercentY / 100) * viewBox.height;

      // maskPath를 따라 여러 지점을 샘플링하여 가장 가까운 지점 찾기
      const samples = 200; // 샘플링 개수 (정확도와 성능의 균형)
      let closestDistance = Infinity;
      let closestPercent = 0;

      for (let i = 0; i <= samples; i++) {
        try {
          const percent = i / samples;
          const point = this.maskPath.getPointAtLength(this.pathLength * percent);
          
          if (!point) {
            continue;
          }

          // 마커 위치와의 거리 계산
          const dx = point.x - markerX;
          const dy = point.y - markerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestPercent = percent;
          }
        } catch (error) {
          // 개별 샘플링 에러는 무시하고 계속 진행
          continue;
        }
      }

      return Math.max(0, Math.min(1, closestPercent));
    } catch (error) {
      this._handleError(error, 'findClosestPathPercent', { markerPercentX, markerPercentY });
      return 0;
    }
  }

  /**
   * 초기 진행률 계산 (타겟 마커 config 반환)
   * @param {Array} allMarkers - 전체 마커 배열
   * @param {Object} config - 설정 객체
   * @returns {Object|null} 타겟 마커 config 객체
   */
  calculateInitialProgress(allMarkers, config) {
    try {
      // 입력값 유효성 검증
      if (!allMarkers || !Array.isArray(allMarkers)) {
        this._handleError(new Error('allMarkers가 배열이 아닙니다.'), 'calculateInitialProgress');
        return null;
      }

      if (!config || typeof config !== 'object') {
        this._handleError(new Error('config가 유효하지 않습니다.'), 'calculateInitialProgress');
        return null;
      }

      const settings = config?.settings || {};

      if (settings.allowDisabledClick) {
        // 비활성 마커 클릭 허용 모드: 완료된 개수만큼 앞에서부터 채우기
        return this._calculateProgressByCount(allMarkers);
      } else {
        // 순차 학습 모드: 다음 학습 위치
        return this._calculateProgressBySequence(allMarkers);
      }
    } catch (error) {
      this._handleError(error, 'calculateInitialProgress', { allMarkers, config });
      return null;
    }
  }

  /**
   * 완료된 개수 기준 진행률 계산 (allowDisabledClick: true)
   * @private
   */
  _calculateProgressByCount(allMarkers) {
    try {
      if (!allMarkers || !Array.isArray(allMarkers)) {
        this._handleError(new Error('allMarkers가 배열이 아닙니다.'), '_calculateProgressByCount');
        return null;
      }

      // 실제 강의만 필터링 (챕터 제외)
      const learningMarkers = allMarkers.filter(
        (m) => m && m.isLearningContent !== false
      );
      const completedLearningCount = learningMarkers.filter(
        (m) => m && m.completed === true
      ).length;

      if (completedLearningCount === 0) {
        // 완료된 학습 없음 → 첫 번째 챕터 마커까지
        const firstChapterMarker = allMarkers.find(
          (m) => m && m.isChapterMarker === true
        );
        if (firstChapterMarker) {
          console.log(
            `[GaugeManager] 완료 기준 진행률: 첫 챕터 마커 (0개 강의 완료)`
          );
          return firstChapterMarker; // 마커 config 반환
        }
        return null;
      }

      if (completedLearningCount >= learningMarkers.length) {
        // 모든 강의 완료 → 마지막 마커 위치
        const lastMarker = allMarkers[allMarkers.length - 1];
        if (lastMarker) {
          console.log(
            `[GaugeManager] 완료 기준 진행률: 마지막 마커 (전체 ${learningMarkers.length}개 강의 완료)`
          );
          return lastMarker; // 마커 config 반환
        }
        return null;
      }

      // 다음 학습할 강의 위치 (현재 학습 중인 마커)
      const nextLearningMarker = learningMarkers[completedLearningCount];
      if (!nextLearningMarker) {
        console.warn(`[GaugeManager] 다음 학습 마커를 찾을 수 없습니다. (인덱스: ${completedLearningCount})`);
        return null;
      }

      const nextMarkerIndex = allMarkers.findIndex(
        (m) =>
          m &&
          m.pathPercent === nextLearningMarker.pathPercent &&
          m.label === nextLearningMarker.label
      );

      if (nextMarkerIndex === -1) {
        console.warn(`[GaugeManager] 타겟 마커를 찾을 수 없습니다.`);
        return null;
      }

      const targetMarker = allMarkers[nextMarkerIndex];
      if (!targetMarker) {
        console.warn(`[GaugeManager] 타겟 마커가 null입니다.`);
        return null;
      }

      console.log(
        `[GaugeManager] 완료 기준 진행률: ${completedLearningCount}/${learningMarkers.length}개 강의 완료, 현재 학습: ${nextLearningMarker.label}`
      );
      return targetMarker; // 마커 config 반환
    } catch (error) {
      this._handleError(error, '_calculateProgressByCount');
      return null;
    }
  }

  /**
   * 순차 학습 기준 진행률 계산 (allowDisabledClick: false)
   * @private
   */
  _calculateProgressBySequence(allMarkers) {
    try {
      if (!allMarkers || !Array.isArray(allMarkers)) {
        this._handleError(new Error('allMarkers가 배열이 아닙니다.'), '_calculateProgressBySequence');
        return null;
      }

      // 실제 강의만 필터링 (챕터 제외)
      const learningMarkers = allMarkers.filter(
        (m) => m && m.isLearningContent !== false
      );

      // 마지막으로 완료된 강의의 인덱스 찾기 (순차적)
      let lastCompletedLearningIndex = -1;

      for (let i = 0; i < learningMarkers.length; i++) {
        if (learningMarkers[i] && learningMarkers[i].completed === true) {
          lastCompletedLearningIndex = i;
        } else {
          // 완료되지 않은 학습을 만나면 중단
          break;
        }
      }

      // 완료된 강의가 없는 경우 → 첫 번째 챕터 마커까지
      if (lastCompletedLearningIndex === -1) {
        const firstChapterMarker = allMarkers.find(
          (m) => m && m.isChapterMarker === true
        );
        if (firstChapterMarker) {
          console.log(
            `[GaugeManager] 순차 진행률: 첫 챕터 마커 (강의 완료 없음)`
          );
          return firstChapterMarker; // 마커 config 반환
        }
        return null;
      }

      // 모든 강의가 완료된 경우 → 마지막 마커 위치
      if (lastCompletedLearningIndex === learningMarkers.length - 1) {
        const lastMarker = allMarkers[allMarkers.length - 1];
        if (lastMarker) {
          console.log(
            `[GaugeManager] 순차 진행률: 마지막 마커 (전체 ${learningMarkers.length}개 강의 완료)`
          );
          return lastMarker; // 마커 config 반환
        }
        return null;
      }

      // 다음 학습할 강의 위치 (현재 학습 중인 마커)
      const nextIndex = lastCompletedLearningIndex + 1;
      if (nextIndex >= learningMarkers.length) {
        console.warn(`[GaugeManager] 다음 학습 인덱스가 범위를 벗어났습니다.`);
        return null;
      }

      const nextLearningMarker = learningMarkers[nextIndex];
      if (!nextLearningMarker) {
        console.warn(`[GaugeManager] 다음 학습 마커를 찾을 수 없습니다.`);
        return null;
      }

      const nextMarkerIndex = allMarkers.findIndex(
        (m) =>
          m &&
          m.pathPercent === nextLearningMarker.pathPercent &&
          m.label === nextLearningMarker.label
      );

      if (nextMarkerIndex === -1) {
        console.warn(`[GaugeManager] 타겟 마커를 찾을 수 없습니다.`);
        return null;
      }

      const targetMarker = allMarkers[nextMarkerIndex];
      if (!targetMarker) {
        console.warn(`[GaugeManager] 타겟 마커가 null입니다.`);
        return null;
      }

      console.log(
        `[GaugeManager] 순차 진행률: 현재 학습: ${nextLearningMarker.label}`
      );
      return targetMarker; // 마커 config 반환
    } catch (error) {
      this._handleError(error, '_calculateProgressBySequence');
      return null;
    }
  }
}