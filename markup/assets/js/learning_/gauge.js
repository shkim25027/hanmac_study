/**
 * 게이지 진행률 관리 클래스
 * Inline SVG 지원 버전
 */
class GaugeManager {
  constructor() {
    this.maskPath = null;
    this.pathLength = 0;
    this.isInitialized = false;
  }

  /**
   * SVG 초기화
   * @returns {boolean} 초기화 성공 여부
   */
  initialize() {
    try {
      this.maskPath = document.getElementById("maskPath");

      if (!this.maskPath) {
        console.error("[GaugeManager] maskPath를 찾을 수 없습니다.");

        // 디버깅: 모든 ID 출력
        const allIds = Array.from(document.querySelectorAll("[id]")).map(
          (el) => el.id
        );
        console.log("[GaugeManager] 페이지 내 모든 ID:", allIds);

        return false;
      }

      this.isInitialized = true;
      console.log("[GaugeManager] 초기화 완료, maskPath 찾음");
      return true;
    } catch (e) {
      console.error("[GaugeManager] 초기화 실패:", e);
      return false;
    }
  }

  /**
   * 진행률 설정
   * @param {number} percent - 진행률 (0-100)
   */
  setProgress(percent) {
    if (!this.isInitialized || !this.maskPath) {
      console.warn("[GaugeManager] 초기화되지 않았습니다.");
      return;
    }

    const p = percent / 100;

    if (this.pathLength === 0) {
      this.pathLength = this.maskPath.getTotalLength();
      this.maskPath.style.strokeDasharray = this.pathLength;
      this.maskPath.style.strokeDashoffset = this.pathLength;
      console.log(`[GaugeManager] 경로 길이: ${this.pathLength.toFixed(2)}`);
    }

    const offset = this.pathLength * (1 - p);
    this.maskPath.style.strokeDashoffset = offset;

    console.log(
      `[GaugeManager] 진행률 ${percent}% 설정 (offset: ${offset.toFixed(2)})`
    );
  }

  /**
   * 경로상의 특정 위치 좌표 반환
   * @param {number} percent - 위치 (0-1)
   * @returns {DOMPoint} 좌표
   */
  getPointAtPercent(percent) {
    if (!this.isInitialized || !this.maskPath) {
      console.warn("[GaugeManager] 초기화되지 않았습니다.");
      return { x: 0, y: 0 };
    }

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
    // 완료된 마커 개수 계산
    const completedCount = allMarkers.filter((m) => m.completed).length;

    if (completedCount === 0) {
      // 완료된 학습 없음 → 시작점 (0%)
      console.log("[GaugeManager] 완료 기준 진행률: 0% (0개 완료)");
      return 0;
    }

    if (completedCount >= allMarkers.length) {
      // 모든 학습 완료 → 100%
      console.log("[GaugeManager] 완료 기준 진행률: 100% (전체 완료)");
      return 100;
    }

    // 완료된 개수만큼 앞에서부터 마커 위치로 계산
    // 예: 3개 완료 → allMarkers[2].pathPercent (0, 1, 2 인덱스)
    const targetIndex = completedCount - 1;
    const progress = allMarkers[targetIndex].pathPercent * 100;

    console.log(
      `[GaugeManager] 완료 기준 진행률: ${progress.toFixed(1)}% (${completedCount}개 완료, 인덱스 ${targetIndex})`
    );
    return progress;
  }

  /**
   * 순차 학습 기준 진행률 계산 (allowDisabledClick: false)
   * @private
   */
  _calculateProgressBySequence(allMarkers) {
    // 마지막으로 완료된 학습의 인덱스 찾기 (순차적)
    let lastCompletedIndex = -1;

    for (let i = 0; i < allMarkers.length; i++) {
      if (allMarkers[i].completed) {
        lastCompletedIndex = i;
      } else {
        // 완료되지 않은 학습을 만나면 중단
        break;
      }
    }

    // 완료된 학습이 없는 경우
    if (lastCompletedIndex === -1) {
      console.log("[GaugeManager] 순차 진행률: 첫 학습 위치 (0%)");
      return 0;
    }

    // 모든 학습이 완료된 경우
    if (lastCompletedIndex === allMarkers.length - 1) {
      console.log("[GaugeManager] 순차 진행률: 100% (전체 완료)");
      return 100;
    }

    // 마지막 완료 학습의 다음 학습(현재 해야 할 학습) 위치로 설정
    const nextIndex = lastCompletedIndex + 1;
    const progress = allMarkers[nextIndex].pathPercent * 100;
    console.log(
      `[GaugeManager] 순차 진행률: ${progress.toFixed(1)}% (다음 학습: ${nextIndex})`
    );
    return progress;
  }
}
