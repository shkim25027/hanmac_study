/**
 * 마커 관리 클래스
 */
class MarkerManager {
  constructor(gaugeManager, config) {
    this.gaugeManager = gaugeManager;
    this.config = config;
    this.markers = [];
    this.gaugeSvg = document.getElementById("gauge-svg");
    this.markersContainer = document.getElementById("markers-container");
    this.allMarkers = config.getAllMarkers(); // flat 배열로 저장
    this.modalInstance = null; // 모달 인스턴스 저장
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
    const startLineImg = document.querySelector(".start-line img");
    if (!startLineImg) return;

    // 완료된 학습이 1개 이상 있으면 on, 없으면 off
    const hasCompletedLessons = this.allMarkers.some(
      (marker) => marker.completed
    );
    const imagePath = hasCompletedLessons
      ? "./assets/images/learning/img_start_on.svg"
      : "./assets/images/learning/img_start_off.svg";

    startLineImg.src = imagePath;

    const completedCount = this.allMarkers.filter((m) => m.completed).length;
    console.log(
      `[MarkerManager] Start-line 상태: ${hasCompletedLessons ? "ON" : "OFF"} (완료된 학습 ${completedCount}/${this.allMarkers.length}개)`
    );
  }

  /**
   * 모든 마커 생성
   */
  createMarkers() {
    // SVG 컨테이너 크기 가져오기 (초기 계산용)
    const svgRect = this.gaugeSvg.getBoundingClientRect();
    const viewBox = this.gaugeSvg.viewBox.baseVal;

    this.allMarkers.forEach((config, index) => {
      this._createMarker(config, index, viewBox);
    });

    // 마커 생성 후 즉시 이미지 업데이트
    this.updateMarkers();

    // Start-line 상태 업데이트
    this._updateStartLine();

    // 윈도우 리사이즈 시 마커 위치 재계산
    this._setupResizeHandler();
  }

  /**
   * 리사이즈 핸들러 설정
   * @private
   */
  _setupResizeHandler() {
    let resizeTimer;

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        console.log("[MarkerManager] 리사이즈 감지: 마커 위치 재계산");
        this._updateMarkerPositions();
      }, 100);
    });
  }

  /**
   * 마커 위치 업데이트 (리사이즈 시)
   * @private
   */
  _updateMarkerPositions() {
    const svgRect = this.gaugeSvg.getBoundingClientRect();
    const viewBox = this.gaugeSvg.viewBox.baseVal;

    this.markers.forEach((marker) => {
      const point = this.gaugeManager.getPointAtPercent(
        marker.config.pathPercent
      );
      const percentX = (point.x / viewBox.width) * 100;
      const percentY = (point.y / viewBox.height) * 100;

      marker.element.style.left = `${percentX}%`;
      marker.element.style.top = `${percentY}%`;
    });
  }

  /**
   * 개별 마커 생성
   * @private
   */
  _createMarker(config, index, viewBox) {
    const point = this.gaugeManager.getPointAtPercent(config.pathPercent);
    const marker = document.createElement("div");

    marker.className = "marker";
    if (config.type === "chapter") marker.classList.add("chapter");

    marker.dataset.index = index;
    marker.dataset.type = config.type;
    marker.dataset.percent = config.pathPercent;

    const img = document.createElement("img");
    img.style.height = "auto";
    marker.appendChild(img);
    this.markersContainer.appendChild(marker);

    // 퍼센트 기반 위치 계산
    const percentX = (point.x / viewBox.width) * 100;
    const percentY = (point.y / viewBox.height) * 100;

    marker.style.left = `${percentX}%`;
    marker.style.top = `${percentY}%`;

    console.log(
      `[MarkerManager] 마커 [${index}] 생성: (${percentX.toFixed(2)}%, ${percentY.toFixed(2)}%)`
    );

    // 마커 클릭 이벤트 설정 (항상 설정)
    marker.addEventListener("click", () => {
      this._handleMarkerClick(index);
    });

    const isClickable = this.isMarkerClickable(index);
    this._setMarkerState(marker, isClickable, index);

    this.markers.push({
      element: marker,
      img: img,
      config: config,
      point: point,
    });
  }

  /**
   * 마커 클릭 핸들러
   * @private
   */
  _handleMarkerClick(index) {
    const isClickable = this.isMarkerClickable(index);
    const settings = this.config.settings || {};

    if (isClickable && this.modalInstance) {
      // 클릭 가능한 마커 - 모달 열기
      console.log(
        `[MarkerManager] 마커 클릭: [${index}] ${this.markers[index].config.label}`
      );
      this.modalInstance.load(this.markers[index].config, index);
    } else if (!isClickable) {
      // 비활성 마커 클릭
      const markerLabel = this.markers[index].config.label;

      if (settings.allowDisabledClick && this.modalInstance) {
        // 설정에서 비활성 마커 클릭을 허용하는 경우
        console.log(
          `[MarkerManager] 비활성 마커 클릭 허용: [${index}] ${markerLabel}`
        );
        this.modalInstance.load(this.markers[index].config, index);
      } else {
        // 비활성 마커 클릭 불가
        console.log(
          `[MarkerManager] 비활성 마커 클릭 차단: [${index}] ${markerLabel}`
        );

        // 알림 표시 여부 확인
        if (settings.showDisabledAlert !== false) {
          const message =
            settings.disabledClickMessage || "이전 학습을 먼저 완료해주세요.";
          alert(message);
        }
      }
    }
  }

  /**
   * 마커 상태 설정
   * @private
   */
  _setMarkerState(marker, isClickable, index) {
    const config = this.allMarkers[index];

    // 기존 상태 클래스 제거
    marker.classList.remove(
      "disabled",
      "has-click-event",
      "current",
      "completed"
    );

    if (config.completed) {
      // 완료된 마커
      marker.style.cursor = "pointer";
      marker.classList.add("completed", "has-click-event");
    } else if (isClickable) {
      // 현재 학습 가능한 마커 (current)
      marker.style.cursor = "pointer";
      marker.classList.add("current", "has-click-event");
    } else {
      // 비활성 마커
      marker.style.cursor = "not-allowed";
      marker.classList.add("disabled");
    }

    console.log(
      `[MarkerManager] 마커 [${index}] 상태: ${config.completed ? "completed" : isClickable ? "current" : "disabled"}`
    );
  }

  /**
   * 마커 클릭 가능 여부 확인
   * @param {number} index - 마커 인덱스
   * @returns {boolean}
   */
  isMarkerClickable(index) {
    if (index === 0) return true;
    return this.allMarkers[index - 1].completed;
  }

  /**
   * 마커 상태 업데이트
   * @param {number} progress - 현재 진행률 (선택적)
   */
  updateMarkers(progress) {
    this.markers.forEach((marker, index) => {
      const config = marker.config;
      const imgSrc = this._getMarkerImage(config, index);
      marker.img.src = imgSrc;
    });
  }

  /**
   * 마커 이미지 결정
   * @private
   */
  _getMarkerImage(config, index) {
    const images = this.config.markerImages[config.type];

    if (config.completed) {
      return images.completed;
    } else if (this.isMarkerClickable(index) && !config.completed) {
      return images.current;
    } else {
      return images.base;
    }
  }

  /**
   * 마커 클릭 가능 여부 업데이트
   */
  updateMarkerClickability() {
    this.markers.forEach((marker, index) => {
      const isClickable = this.isMarkerClickable(index);
      const element = marker.element;
      const config = marker.config;

      // 기존 상태 클래스 제거
      element.classList.remove(
        "disabled",
        "has-click-event",
        "current",
        "completed"
      );

      // 상태에 따라 스타일 및 클래스 업데이트
      if (config.completed) {
        // 완료된 마커
        element.style.opacity = "1";
        element.style.cursor = "pointer";
        element.classList.add("completed", "has-click-event");
      } else if (isClickable) {
        // 현재 학습 가능한 마커 (current)
        element.style.opacity = "1";
        element.style.cursor = "pointer";
        element.classList.add("current", "has-click-event");
      } else {
        // 비활성 마커
        element.style.opacity = "0.5";
        element.style.cursor = "not-allowed";
        element.classList.add("disabled");
      }
    });

    console.log("[MarkerManager] 마커 클릭 가능 여부 업데이트 완료");
  }

  /**
   * 학습 완료 처리
   * @param {number} index - 완료할 학습 인덱스
   */
  completeLesson(index) {
    this.allMarkers[index].completed = true;

    const settings = this.config.settings || {};
    let progressPercent;

    if (settings.allowDisabledClick) {
      // 비활성 마커 클릭 허용 모드: 완료된 개수 기준
      const completedCount = this.allMarkers.filter((m) => m.completed).length;

      if (completedCount >= this.allMarkers.length) {
        progressPercent = 100;
      } else {
        const targetIndex = completedCount - 1;
        progressPercent = this.allMarkers[targetIndex].pathPercent * 100;
      }

      console.log(
        `[MarkerManager] 완료 개수 기준: ${completedCount}개 → ${progressPercent.toFixed(1)}%`
      );
    } else {
      // 순차 학습 모드: 다음 학습 위치
      const nextIndex = index + 1;
      progressPercent =
        nextIndex < this.allMarkers.length
          ? this.allMarkers[nextIndex].pathPercent * 100
          : 100;

      console.log(
        `[MarkerManager] 순차 기준: 다음 학습 ${nextIndex} → ${progressPercent.toFixed(1)}%`
      );
    }

    this.gaugeManager.setProgress(progressPercent);
    this.updateMarkers(progressPercent);
    this.updateMarkerClickability();

    // Start-line 상태 업데이트 (첫 학습 완료 시 OFF → ON 전환)
    this._updateStartLine();

    // 챕터 카드 상태 업데이트
    if (window.learningApp && window.learningApp.updateChapterCards) {
      window.learningApp.updateChapterCards();
    }

    const completedCount = this.allMarkers.filter((m) => m.completed).length;
    console.log(
      `학습 ${index + 1} 완료! (${completedCount}/${this.allMarkers.length}) ` +
        `진행률: ${progressPercent.toFixed(1)}%`
    );
  }
}
