/**
 * 게이지 관련 기본 클래스
 * @module GaugeBase
 */
class GaugeBase {
  constructor(config = {}) {
    this.config = {
      size: 400,
      strokeWidth: 20,
      maxValue: 100,
      currentValue: 0,
      padding: 10,
      startAngle: -90,
      endAngle: 270,
      animationDuration: 800,
      easing: "ease-out",
      ...config,
    };

    this.svg = null;
    this.path = null;
    this.pathLength = 0;
  }

  /**
   * 각도를 라디안으로 변환
   * @param {number} angle - 각도
   * @returns {number}
   */
  static degreesToRadians(angle) {
    return (angle * Math.PI) / 180;
  }

  /**
   * 라디안을 각도로 변환
   * @param {number} radians - 라디안
   * @returns {number}
   */
  static radiansToDegrees(radians) {
    return (radians * 180) / Math.PI;
  }

  /**
   * 원형 경로의 좌표 계산
   * @param {number} cx - 중심 X
   * @param {number} cy - 중심 Y
   * @param {number} radius - 반지름
   * @param {number} angle - 각도
   * @returns {Object}
   */
  static polarToCartesian(cx, cy, radius, angle) {
    const radians = this.degreesToRadians(angle);
    return {
      x: cx + radius * Math.cos(radians),
      y: cy + radius * Math.sin(radians),
    };
  }

  /**
   * SVG 원호 경로 생성
   * @param {number} cx - 중심 X
   * @param {number} cy - 중심 Y
   * @param {number} radius - 반지름
   * @param {number} startAngle - 시작 각도
   * @param {number} endAngle - 종료 각도
   * @returns {string}
   */
  static describeArc(cx, cy, radius, startAngle, endAngle) {
    const start = this.polarToCartesian(cx, cy, radius, endAngle);
    const end = this.polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
  }

  /**
   * 진행률을 각도로 변환
   * @param {number} percent - 진행률 (0-1)
   * @param {number} startAngle - 시작 각도
   * @param {number} endAngle - 종료 각도
   * @returns {number}
   */
  static percentToAngle(percent, startAngle = -90, endAngle = 270) {
    const totalAngle = endAngle - startAngle;
    return startAngle + totalAngle * percent;
  }

  /**
   * SVG 요소 생성
   * @param {string} tag - 태그명
   * @param {Object} attrs - 속성
   * @returns {SVGElement}
   */
  static createSVGElement(tag, attrs = {}) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  }

  /**
   * 경로 길이 계산
   * @param {SVGPathElement} path - SVG 경로 요소
   * @returns {number}
   */
  static getPathLength(path) {
    return path.getTotalLength();
  }

  /**
   * 경로상의 특정 지점 좌표
   * @param {SVGPathElement} path - SVG 경로 요소
   * @param {number} percent - 위치 (0-1)
   * @returns {DOMPoint}
   */
  static getPointAtPercent(path, percent) {
    const length = path.getTotalLength();
    return path.getPointAtLength(length * percent);
  }

  /**
   * 이징 함수
   * @param {number} t - 시간 (0-1)
   * @param {string} type - 이징 타입
   * @returns {number}
   */
  static easing(t, type = "ease-out") {
    const easings = {
      linear: (t) => t,
      "ease-in": (t) => t * t,
      "ease-out": (t) => t * (2 - t),
      "ease-in-out": (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
      "ease-in-cubic": (t) => t * t * t,
      "ease-out-cubic": (t) => --t * t * t + 1,
      "ease-in-out-cubic": (t) =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
      bounce: (t) => {
        if (t < 1 / 2.75) {
          return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
          return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
          return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
          return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
      },
    };

    return easings[type] ? easings[type](t) : easings["ease-out"](t);
  }

  /**
   * 값을 범위 내로 제한
   * @param {number} value - 값
   * @param {number} min - 최소값
   * @param {number} max - 최대값
   * @returns {number}
   */
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * 값을 범위로 매핑
   * @param {number} value - 값
   * @param {number} inMin - 입력 최소값
   * @param {number} inMax - 입력 최대값
   * @param {number} outMin - 출력 최소값
   * @param {number} outMax - 출력 최대값
   * @returns {number}
   */
  static map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  /**
   * 선형 보간
   * @param {number} start - 시작값
   * @param {number} end - 종료값
   * @param {number} t - 시간 (0-1)
   * @returns {number}
   */
  static lerp(start, end, t) {
    return start + (end - start) * t;
  }
}

/**
 * 원형 게이지 클래스
 */
class CircularGauge extends GaugeBase {
  constructor(config = {}) {
    super(config);
    this.centerX = this.config.size / 2;
    this.centerY = this.config.size / 2;
    this.radius =
      (this.config.size - this.config.strokeWidth - this.config.padding * 2) / 2;
  }

  /**
   * 게이지 초기화
   * @param {string|Element} container - 컨테이너 선택자 또는 요소
   * @returns {SVGElement}
   */
  init(container) {
    const element =
      typeof container === "string" ? document.querySelector(container) : container;

    if (!element) {
      console.error("Container not found");
      return null;
    }

    // SVG 생성
    this.svg = GaugeBase.createSVGElement("svg", {
      width: this.config.size,
      height: this.config.size,
      viewBox: `0 0 ${this.config.size} ${this.config.size}`,
    });

    // 배경 원
    const bgPath = this._createPath("background");
    this.svg.appendChild(bgPath);

    // 진행률 원
    this.path = this._createPath("progress");
    this.svg.appendChild(this.path);

    // 경로 길이 설정
    this.pathLength = GaugeBase.getPathLength(this.path);
    this.path.style.strokeDasharray = this.pathLength;
    this.path.style.strokeDashoffset = this.pathLength;

    element.appendChild(this.svg);

    return this.svg;
  }

  /**
   * 경로 생성
   * @private
   */
  _createPath(type = "progress") {
    const pathData = GaugeBase.describeArc(
      this.centerX,
      this.centerY,
      this.radius,
      this.config.startAngle,
      this.config.endAngle
    );

    const attrs = {
      d: pathData,
      fill: "none",
      stroke: type === "background" ? "#e0e0e0" : "#4CAF50",
      "stroke-width": this.config.strokeWidth,
      "stroke-linecap": "round",
    };

    if (type === "background") {
      attrs.opacity = "0.3";
    }

    return GaugeBase.createSVGElement("path", attrs);
  }

  /**
   * 진행률 업데이트
   * @param {number} value - 값
   * @param {boolean} animate - 애니메이션 적용 여부
   */
  update(value, animate = true) {
    const percent = GaugeBase.clamp(value / this.config.maxValue, 0, 1);
    const targetOffset = this.pathLength * (1 - percent);

    if (animate) {
      this._animateProgress(targetOffset);
    } else {
      this.path.style.strokeDashoffset = targetOffset;
    }
  }

  /**
   * 진행률 애니메이션
   * @private
   */
  _animateProgress(targetOffset) {
    const startOffset = parseFloat(this.path.style.strokeDashoffset) || this.pathLength;
    const startTime = performance.now();
    const duration = this.config.animationDuration;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = GaugeBase.easing(progress, this.config.easing);

      const currentOffset = GaugeBase.lerp(startOffset, targetOffset, easedProgress);
      this.path.style.strokeDashoffset = currentOffset;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * 색상 변경
   * @param {string} color - 색상
   */
  setColor(color) {
    this.path.setAttribute("stroke", color);
  }

  /**
   * 리셋
   */
  reset() {
    this.path.style.strokeDashoffset = this.pathLength;
  }
}

/**
 * 선형 게이지 클래스
 */
class LinearGauge extends GaugeBase {
  constructor(config = {}) {
    super({
      width: 300,
      height: 20,
      ...config,
    });
  }

  /**
   * 게이지 초기화
   * @param {string|Element} container - 컨테이너 선택자 또는 요소
   * @returns {HTMLElement}
   */
  init(container) {
    const element =
      typeof container === "string" ? document.querySelector(container) : container;

    if (!element) {
      console.error("Container not found");
      return null;
    }

    // 컨테이너 생성
    this.container = document.createElement("div");
    this.container.className = "linear-gauge";
    this.container.style.cssText = `
      width: ${this.config.width}px;
      height: ${this.config.height}px;
      background: #e0e0e0;
      border-radius: ${this.config.height / 2}px;
      overflow: hidden;
      position: relative;
    `;

    // 진행률 바 생성
    this.bar = document.createElement("div");
    this.bar.className = "gauge-bar";
    this.bar.style.cssText = `
      width: 0%;
      height: 100%;
      background: linear-gradient(90deg, #4CAF50, #8BC34A);
      transition: width ${this.config.animationDuration}ms ${this.config.easing};
    `;

    this.container.appendChild(this.bar);
    element.appendChild(this.container);

    return this.container;
  }

  /**
   * 진행률 업데이트
   * @param {number} value - 값
   * @param {boolean} animate - 애니메이션 적용 여부
   */
  update(value, animate = true) {
    const percent = GaugeBase.clamp((value / this.config.maxValue) * 100, 0, 100);

    if (!animate) {
      this.bar.style.transition = "none";
      void this.bar.offsetHeight; // 강제 리플로우
    }

    this.bar.style.width = `${percent}%`;

    if (!animate) {
      // 다음 프레임에서 transition 복원
      requestAnimationFrame(() => {
        this.bar.style.transition = `width ${this.config.animationDuration}ms ${this.config.easing}`;
      });
    }
  }

  /**
   * 색상 변경
   * @param {string} color - 색상
   */
  setColor(color) {
    this.bar.style.background = color;
  }

  /**
   * 리셋
   */
  reset() {
    this.bar.style.width = "0%";
  }
}

// ES6 모듈 내보내기
if (typeof module !== "undefined" && module.exports) {
  module.exports = { GaugeBase, CircularGauge, LinearGauge };
}
