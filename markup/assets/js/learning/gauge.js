/**
 * 게이지 진행률 관리 클래스
 */
class GaugeManager {
  constructor() {
    this.maskPath = document.getElementById("maskPath");
    this.pathLength = 0;
  }

  /**
   * 진행률 설정
   * @param {number} percent - 진행률 (0-100)
   */
  setProgress(percent) {
    if (!this.maskPath) return;

    const p = percent / 100;

    if (this.pathLength === 0) {
      this.pathLength = this.maskPath.getTotalLength();
      this.maskPath.style.strokeDasharray = this.pathLength;
      this.maskPath.style.strokeDashoffset = this.pathLength;
    }

    // 현재 offset 값 가져오기
    const currentOffset = parseFloat(this.maskPath.style.strokeDashoffset) || this.pathLength;
    const targetOffset = this.pathLength * (1 - p);
    
    // 애니메이션을 위한 transition 추가 (처음 한 번만)
    if (!this.maskPath.style.transition) {
      this.maskPath.style.transition = "stroke-dashoffset 0.8s ease-out";
    }
    
    // offset 업데이트 (transition으로 자연스럽게 애니메이션됨)
    this.maskPath.style.strokeDashoffset = targetOffset;
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
   * 초기 진행률 계산
   * @param {Array} allMarkers - 전체 마커 배열
   * @param {Object} config - 설정 객체
   * @returns {number} 진행률
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
      const progress = firstChapterMarker
        ? firstChapterMarker.pathPercent * 100
        : 0;
      console.log(
        `[GaugeManager] 완료 기준 진행률: ${progress.toFixed(1)}% (0개 강의 완료, 첫 챕터 마커)`
      );
      return progress;
    }

    if (completedLearningCount >= learningMarkers.length) {
      // 모든 강의 완료 → 마지막 마커 위치
      const lastMarkerProgress =
        allMarkers[allMarkers.length - 1].pathPercent * 100;
      console.log(
        `[GaugeManager] 완료 기준 진행률: ${lastMarkerProgress.toFixed(1)}% (전체 ${learningMarkers.length}개 강의 완료)`
      );
      return lastMarkerProgress;
    }

    // 다음 학습할 강의 위치 (현재 학습 중인 마커)
    const nextLearningMarker = learningMarkers[completedLearningCount];
    const nextMarkerIndex = allMarkers.findIndex(
      (m) =>
        m.pathPercent === nextLearningMarker.pathPercent &&
        m.label === nextLearningMarker.label
    );
    const progress = allMarkers[nextMarkerIndex].pathPercent * 100;

    console.log(
      `[GaugeManager] 완료 기준 진행률: ${progress.toFixed(1)}% (${completedLearningCount}/${learningMarkers.length}개 강의 완료, 현재 학습: ${nextLearningMarker.label})`
    );
    return progress;
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
      const progress = firstChapterMarker
        ? firstChapterMarker.pathPercent * 100
        : 0;
      console.log(
        `[GaugeManager] 순차 진행률: ${progress.toFixed(1)}% (강의 완료 없음, 첫 챕터 마커)`
      );
      return progress;
    }

    // 모든 강의가 완료된 경우 → 마지막 마커 위치
    if (lastCompletedLearningIndex === learningMarkers.length - 1) {
      const lastMarkerProgress =
        allMarkers[allMarkers.length - 1].pathPercent * 100;
      console.log(
        `[GaugeManager] 순차 진행률: ${lastMarkerProgress.toFixed(1)}% (전체 ${learningMarkers.length}개 강의 완료)`
      );
      return lastMarkerProgress;
    }

    // 다음 학습할 강의 위치 (현재 학습 중인 마커)
    const nextLearningMarker = learningMarkers[lastCompletedLearningIndex + 1];
    const nextMarkerIndex = allMarkers.findIndex(
      (m) =>
        m.pathPercent === nextLearningMarker.pathPercent &&
        m.label === nextLearningMarker.label
    );
    const progress = allMarkers[nextMarkerIndex].pathPercent * 100;

    console.log(
      `[GaugeManager] 순차 진행률: ${progress.toFixed(1)}% (현재 학습: ${nextLearningMarker.label})`
    );
    return progress;
  }
}
