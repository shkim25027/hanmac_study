/**
 * 게이지 진행률 관리 클래스
 */
class GaugeManager {
  constructor() {
    this.maskPath = document.getElementById("maskPath");
    this.gaugeSvg = document.getElementById("gauge-svg");
    this.pathLength = 0;
  }

  /**
   * 진행률 설정
   * @param {number} percent - 진행률 (0-100) 또는 pathPercent (0-1)
   * @param {boolean} isPathPercent - percent가 pathPercent인지 여부 (기본값: false)
   */
  setProgress(percent, isPathPercent = false) {
    if (!this.maskPath) {
      console.warn("[GaugeManager] maskPath를 찾을 수 없습니다");
      return;
    }

    if (this.pathLength === 0) {
      this.pathLength = this.maskPath.getTotalLength();
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
    
    // stroke-dasharray를 pathLength로 설정하여 gap이 없도록 함
    // [dash, gap] 형태에서 gap을 0으로 설정하면 연속된 선이 됨
    // setAttribute를 사용하여 인라인 스타일을 확실하게 덮어쓰기
    this.maskPath.setAttribute('stroke-dasharray', `${this.pathLength} 0`);
    
    // 애니메이션을 위한 transition 추가 (처음 한 번만)
    if (!this.maskPath.style.transition) {
      this.maskPath.style.transition = "stroke-dashoffset 0.8s ease-out";
    }
    
    // offset 업데이트 (transition으로 자연스럽게 애니메이션됨)
    this.maskPath.style.strokeDashoffset = targetOffset;
    
    console.log(
      `[GaugeManager] setProgress: pathPercent=${targetPathPercent.toFixed(4)}, targetOffset=${targetOffset.toFixed(2)}, pathLength=${this.pathLength.toFixed(2)}`
    );
  }

  /**
   * 경로상의 특정 위치 좌표 반환
   * @param {number} percent - 위치 (0-1)
   * @returns {DOMPoint} 좌표
   */
  getPointAtPercent(percent) {
    if (!this.pathLength) {
      this.pathLength = this.maskPath.getTotalLength();
    }
    return this.maskPath.getPointAtLength(this.pathLength * percent);
  }

  /**
   * 마커의 실제 DOM 위치에 가장 가까운 maskPath 지점 찾기
   * @param {number} markerPercentX - 마커의 X 위치 (퍼센트)
   * @param {number} markerPercentY - 마커의 Y 위치 (퍼센트)
   * @returns {number} 가장 가까운 지점의 pathPercent (0-1)
   */
  findClosestPathPercent(markerPercentX, markerPercentY) {
    if (!this.maskPath || !this.gaugeSvg) return 0;

    if (this.pathLength === 0) {
      this.pathLength = this.maskPath.getTotalLength();
    }

    const viewBox = this.gaugeSvg.viewBox.baseVal;
    const markerX = (markerPercentX / 100) * viewBox.width;
    const markerY = (markerPercentY / 100) * viewBox.height;

    // maskPath를 따라 여러 지점을 샘플링하여 가장 가까운 지점 찾기
    const samples = 200; // 샘플링 개수 (정확도와 성능의 균형)
    let closestDistance = Infinity;
    let closestPercent = 0;

    for (let i = 0; i <= samples; i++) {
      const percent = i / samples;
      const point = this.maskPath.getPointAtLength(this.pathLength * percent);
      
      // 마커 위치와의 거리 계산
      const dx = point.x - markerX;
      const dy = point.y - markerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPercent = percent;
      }
    }

    return closestPercent;
  }

  /**
   * 초기 진행률 계산 (타겟 마커 config 반환)
   * @param {Array} allMarkers - 전체 마커 배열
   * @param {Object} config - 설정 객체
   * @returns {Object} 타겟 마커 config 객체
   */
  calculateInitialProgress(allMarkers, config) {
    const settings = config?.settings || {};

    if (settings.allowDisabledClick) {
      // 비활성 마커 클릭 허용 모드: 완료된 개수만큼 앞에서부터 채우기
      return this._calculateProgressByCount(allMarkers);
    } else {
      // 순차 학습 모드: 다음 학습 위치
      return this._calculateProgressBySequence(allMarkers);
    }
  }

  /**
   * 완료된 개수 기준 진행률 계산 (allowDisabledClick: true)
   * @private
   */
  _calculateProgressByCount(allMarkers) {
    // 실제 강의만 필터링 (챕터 제외)
    const learningMarkers = allMarkers.filter(
      (m) => m.isLearningContent !== false
    );
    const completedLearningCount = learningMarkers.filter(
      (m) => m.completed
    ).length;

    if (completedLearningCount === 0) {
      // 완료된 학습 없음 → 첫 번째 챕터 마커까지
      const firstChapterMarker = allMarkers.find(
        (m) => m.isChapterMarker === true
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
      console.log(
        `[GaugeManager] 완료 기준 진행률: 마지막 마커 (전체 ${learningMarkers.length}개 강의 완료)`
      );
      return lastMarker; // 마커 config 반환
    }

    // 다음 학습할 강의 위치 (현재 학습 중인 마커)
    const nextLearningMarker = learningMarkers[completedLearningCount];
    const nextMarkerIndex = allMarkers.findIndex(
      (m) =>
        m.pathPercent === nextLearningMarker.pathPercent &&
        m.label === nextLearningMarker.label
    );
    const targetMarker = allMarkers[nextMarkerIndex];

    console.log(
      `[GaugeManager] 완료 기준 진행률: ${completedLearningCount}/${learningMarkers.length}개 강의 완료, 현재 학습: ${nextLearningMarker.label}`
    );
    return targetMarker; // 마커 config 반환
  }

  /**
   * 순차 학습 기준 진행률 계산 (allowDisabledClick: false)
   * @private
   */
  _calculateProgressBySequence(allMarkers) {
    // 실제 강의만 필터링 (챕터 제외)
    const learningMarkers = allMarkers.filter(
      (m) => m.isLearningContent !== false
    );

    // 마지막으로 완료된 강의의 인덱스 찾기 (순차적)
    let lastCompletedLearningIndex = -1;

    for (let i = 0; i < learningMarkers.length; i++) {
      if (learningMarkers[i].completed) {
        lastCompletedLearningIndex = i;
      } else {
        // 완료되지 않은 학습을 만나면 중단
        break;
      }
    }

    // 완료된 강의가 없는 경우 → 첫 번째 챕터 마커까지
    if (lastCompletedLearningIndex === -1) {
      const firstChapterMarker = allMarkers.find(
        (m) => m.isChapterMarker === true
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
      console.log(
        `[GaugeManager] 순차 진행률: 마지막 마커 (전체 ${learningMarkers.length}개 강의 완료)`
      );
      return lastMarker; // 마커 config 반환
    }

    // 다음 학습할 강의 위치 (현재 학습 중인 마커)
    const nextLearningMarker = learningMarkers[lastCompletedLearningIndex + 1];
    const nextMarkerIndex = allMarkers.findIndex(
      (m) =>
        m.pathPercent === nextLearningMarker.pathPercent &&
        m.label === nextLearningMarker.label
    );
    const targetMarker = allMarkers[nextMarkerIndex];

    console.log(
      `[GaugeManager] 순차 진행률: 현재 학습: ${nextLearningMarker.label}`
    );
    return targetMarker; // 마커 config 반환
  }
}
