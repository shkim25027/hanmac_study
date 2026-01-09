// ============================================
// 게이지 차트 모듈 (이미지 아이콘 버전)
// 공통 모듈 활용 (ErrorHandler, DOMUtils, EventManager, Utils)
// ============================================

class GaugeChart {
  // 상수 정의
  static CONSTANTS = {
    MIN_PERCENT: 0.14, // 최소 표시 퍼센트 (14%)
    ANIMATION_DURATION: 1400, // 애니메이션 시간 (ms)
    PHASE2_DURATION: 800, // 초과 시 2단계 애니메이션 시간
    ICON_HIDE_THRESHOLD: 0.7, // 아이콘 숨김 임계값 (70%)
  };

  static ICON_CONFIG = {
    rocket: { width: 18, height: 48, offsetX: 9, offsetY: 24, outerOffset: 30 },
    snail: {
      width: 75, // 50 → 75 (1.5배)
      height: 64.5, // 43 → 64.5 (1.5배)
      offsetX: 37.5, // 25 → 37.5 (1.5배)
      offsetY: 32.25, // 21.5 → 32.25 (1.5배)
      outerOffset: 30, // 유지
    },
  };

  constructor(config, dependencies = {}) {
    // 의존성 주입 (폴백 포함)
    this.domUtils = dependencies.domUtils || (typeof DOMUtils !== 'undefined' ? DOMUtils : null);
    this.errorHandler = dependencies.errorHandler || (typeof ErrorHandler !== 'undefined' ? ErrorHandler : null);
    this.eventManager = dependencies.eventManager || (typeof eventManager !== 'undefined' ? eventManager : null);
    this.utils = dependencies.utils || (typeof Utils !== 'undefined' ? Utils : null);
    this.animationUtils = dependencies.animationUtils || (typeof AnimationUtils !== 'undefined' ? AnimationUtils : null);

    // 이벤트 리스너 ID 저장 (정리용)
    this.listenerIds = [];

    try {
      if (!config || typeof config !== 'object') {
        this._handleError(new Error('config가 유효하지 않습니다.'), 'constructor');
        config = {};
      }

      this.config = {
        size: config.size || 832,
        strokeWidth: config.strokeWidth || 31,
        maxValue: config.maxValue || 50,
        padding: config.padding || 20,
        outerTextOffset: config.outerTextOffset || 6,
        innerTextOffset: config.innerTextOffset || 35,
        dotRadius: config.dotRadius || 7,
        // 아이콘 이미지 경로 설정
        rocketIconPath:
          config.rocketIconPath || "./assets/images/ico/icon-rocket.svg",
        snailIconPath:
          config.snailIconPath || "./assets/images/ico/icon-snail.svg",
      };

      this.svg = null;
      this.center = 0;
      this.radius = 0;
      this.animated = false;
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
        context: `GaugeChart.${context}`,
        component: 'GaugeChart',
        ...additionalInfo
      }, false);
    } else {
      console.error(`[GaugeChart] ${context}:`, error, additionalInfo);
    }
  }

  // ============================================
  // 초기화
  // ============================================

  init() {
    try {
      this.svg = this.domUtils?.$("#gauge") || document.getElementById("gauge");
      if (!this.svg) {
        this._handleError(new Error('게이지 SVG 요소를 찾을 수 없습니다.'), 'init');
        return;
      }

      this._calculateDimensions();
      this._setupViewBox();
    } catch (error) {
      this._handleError(error, 'init');
    }
  }

  _calculateDimensions() {
    try {
      const { size, strokeWidth, padding } = this.config;
      if (typeof size !== 'number' || typeof strokeWidth !== 'number' || typeof padding !== 'number') {
        this._handleError(new Error('config 값이 유효하지 않습니다.'), '_calculateDimensions');
        return;
      }

      this.center = size / 2;
      this.radius = size / 2 - strokeWidth / 2 - padding;
    } catch (error) {
      this._handleError(error, '_calculateDimensions');
    }
  }

  _setupViewBox() {
    try {
      if (!this.svg) {
        this._handleError(new Error('svg 요소가 없습니다.'), '_setupViewBox');
        return;
      }

      const { size } = this.config;
      if (typeof size !== 'number') {
        this._handleError(new Error('size가 유효하지 않습니다.'), '_setupViewBox');
        return;
      }

      const extraSpace = 100;
      this.svg.setAttribute(
        "viewBox",
        `-50 -50 ${size + 100} ${size + extraSpace}`
      );
      this.svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    } catch (error) {
      this._handleError(error, '_setupViewBox');
    }
  }

  // ============================================
  // 게이지 업데이트
  // ============================================

  update(value) {
    try {
      if (!this.svg) {
        console.warn("[GaugeChart] svg 요소가 없습니다.");
        return;
      }

      // 입력값 유효성 검증
      if (typeof value !== 'number' || isNaN(value) || value < 0) {
        this._handleError(new Error(`유효하지 않은 value: ${value}`), 'update');
        return;
      }

      const shouldAnimate = !this.animated;
      this.svg.innerHTML = "";

      const { percent, angle } = this._calculateAngle(value);
      const isOverMax = value > this.config.maxValue;

      this._createTextPaths();
      this._createBackgroundArc(isOverMax);
      this._createFilledArc(angle, isOverMax, shouldAnimate);
      this._addMyLearningText(value, percent, angle, shouldAnimate);
      this._addEndIcon(angle, value, shouldAnimate);
      this._addAverageLearningText(value, percent);

      if (shouldAnimate) {
        this.animated = true;
      }
    } catch (error) {
      this._handleError(error, 'update', { value });
    }
  }

  _calculateAngle(value) {
    const { maxValue } = this.config;
    const { MIN_PERCENT } = GaugeChart.CONSTANTS;

    let percent;

    if (value <= maxValue) {
      percent = value / maxValue;
      percent = Math.max(percent, MIN_PERCENT);
    } else {
      percent = 2 - value / maxValue;
      percent = Math.max(percent, 0.1);
    }

    const angle = -180 + percent * 180;

    return { percent, angle };
  }

  // ============================================
  // SVG 생성 메서드
  // ============================================

  _createTextPaths() {
    const defs = this._createSVGElement("defs");

    // 외곽 텍스트 경로
    const outerArc = this._createPathElement(
      "outerArc",
      this._createArcPath(this.radius - this.config.outerTextOffset, -180, 0)
    );
    defs.appendChild(outerArc);

    // 내부 텍스트 경로
    const innerArc = this._createPathElement(
      "innerArc",
      this._createArcPath(this.radius - this.config.innerTextOffset, -180, 0)
    );
    defs.appendChild(innerArc);

    this.svg.appendChild(defs);
  }

  _createBackgroundArc(isOverMax) {
    const bg = this._createPathElement(
      null,
      this._createArcPath(this.radius, -180, 0)
    );

    if (isOverMax) {
      bg.setAttribute("stroke", "#D8823B");
    } else {
      bg.setAttribute("class", "bg-arc");
      bg.setAttribute("stroke", "#72451F");
      bg.setAttribute("stroke-opacity", "0.1");
    }

    bg.setAttribute("stroke-width", this.config.strokeWidth);
    bg.setAttribute("stroke-linecap", "round");
    bg.setAttribute("fill", "none");

    this.svg.appendChild(bg);
  }

  _createFilledArc(angle, isOverMax, shouldAnimate) {
    const gradient = this._createGradient(angle);
    const fg = this._createPathElement(null, "");

    fg.setAttribute("stroke", isOverMax ? "url(#arcSweepGradient)" : "#e89555");
    fg.setAttribute("stroke-width", this.config.strokeWidth);
    fg.setAttribute("stroke-linecap", "round");
    fg.setAttribute("fill", "none");

    this.svg.appendChild(fg);

    if (shouldAnimate) {
      this._animateFilledArc(fg, angle, isOverMax);
    } else {
      fg.setAttribute("d", this._createArcPath(this.radius, -180, angle));
    }
  }

  _createGradient(angle) {
    try {
      if (!this.svg) {
        this._handleError(new Error('svg 요소가 없습니다.'), '_createGradient');
        return null;
      }

      const defs = this.domUtils?.$("defs", this.svg) || this.svg.querySelector("defs");
      if (!defs) {
        this._handleError(new Error('defs 요소를 찾을 수 없습니다.'), '_createGradient');
        return null;
      }

      let gradient = this.domUtils?.$("#arcSweepGradient", defs) || defs.querySelector("#arcSweepGradient");

      if (!gradient) {
        gradient = this._createSVGElement("linearGradient");
        gradient.setAttribute("id", "arcSweepGradient");
        gradient.setAttribute("x1", "0%");
        gradient.setAttribute("y1", "0%");
        gradient.setAttribute("x2", "100%");
        gradient.setAttribute("y2", "0%");

        const colors = [
          { offset: "0%", color: "#72451F" },
          { offset: "100%", color: "#D8823B" },
        ];

        colors.forEach(({ offset, color }) => {
          const stop = this._createSVGElement("stop");
          stop.setAttribute("offset", offset);
          stop.setAttribute("stop-color", color);
          gradient.appendChild(stop);
        });

        defs.appendChild(gradient);
      }

      gradient.setAttribute(
        "gradientTransform",
        `rotate(${angle - 90}, 0.5, 0.5)`
      );

      return gradient;
    } catch (error) {
      this._handleError(error, '_createGradient', { angle });
      return null;
    }
  }

  // ============================================
  // 애니메이션
  // ============================================

  _animateFilledArc(element, targetAngle, isOverMax) {
    const { MIN_PERCENT, ANIMATION_DURATION, PHASE2_DURATION } =
      GaugeChart.CONSTANTS;
    const startAngle = -180 + MIN_PERCENT * 180;
    const fullAngle = 0;

    element.setAttribute(
      "d",
      this._createArcPath(this.radius, -180, startAngle)
    );

    if (isOverMax) {
      this._animateTwoPhase(
        element,
        startAngle,
        fullAngle,
        targetAngle,
        ANIMATION_DURATION,
        PHASE2_DURATION
      );
    } else {
      this._animateSinglePhase(
        element,
        startAngle,
        targetAngle,
        ANIMATION_DURATION
      );
    }
  }

  _animateSinglePhase(element, startAngle, endAngle, duration) {
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = this._easeOutCubic(progress);

      const currentAngle = startAngle + (endAngle - startAngle) * easeOut;
      element.setAttribute(
        "d",
        this._createArcPath(this.radius, -180, currentAngle)
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  _animateTwoPhase(
    element,
    startAngle,
    midAngle,
    endAngle,
    phase1Duration,
    phase2Duration
  ) {
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;

      if (elapsed < phase1Duration) {
        // Phase 1: 15% → 100%
        const progress = elapsed / phase1Duration;
        const easeOut = this._easeOutCubic(progress);
        const currentAngle = startAngle + (midAngle - startAngle) * easeOut;
        element.setAttribute(
          "d",
          this._createArcPath(this.radius, -180, currentAngle)
        );
        requestAnimationFrame(animate);
      } else if (elapsed < phase1Duration + phase2Duration) {
        // Phase 2: 100% → 최종값
        const progress = (elapsed - phase1Duration) / phase2Duration;
        const easeOut = this._easeOutCubic(progress);
        const currentAngle = midAngle + (endAngle - midAngle) * easeOut;
        element.setAttribute(
          "d",
          this._createArcPath(this.radius, -180, currentAngle)
        );
        requestAnimationFrame(animate);
      } else {
        // 완료
        element.setAttribute(
          "d",
          this._createArcPath(this.radius, -180, endAngle)
        );
      }
    };

    requestAnimationFrame(animate);
  }

  // ============================================
  // 텍스트 및 아이콘
  // ============================================

  _addMyLearningText(value, percent, angle, shouldAnimate) {
    try {
      if (!this.svg) {
        this._handleError(new Error('svg 요소가 없습니다.'), '_addMyLearningText');
        return;
      }

      const text = this._createTextElement(
        "나의 학습",
        value,
        percent,
        this.config.maxValue
      );

      if (!text) {
        this._handleError(new Error('text 요소를 생성할 수 없습니다.'), '_addMyLearningText');
        return;
      }

      this.svg.appendChild(text);

      const textPath = this.domUtils?.$("textPath", text) || text.querySelector("textPath");
      if (!textPath) {
        this._handleError(new Error('textPath 요소를 찾을 수 없습니다.'), '_addMyLearningText');
        return;
      }

      const finalOffset = this._calculateTextOffset(value, percent);

      if (shouldAnimate) {
        this._animateText(
          textPath,
          15,
          finalOffset,
          GaugeChart.CONSTANTS.ANIMATION_DURATION
        );
      } else {
        textPath.setAttribute("startOffset", `${finalOffset}%`);
      }

      // 클릭 이벤트 추가: mypage.html로 이동
      if (this.domUtils) {
        this.domUtils.setStyles(text, { cursor: "pointer" });
      } else {
        text.style.cursor = "pointer";
      }

      const clickHandler = () => {
        try {
          window.location.href = "mypage.html";
        } catch (error) {
          this._handleError(error, '_addMyLearningText.clickHandler');
        }
      };

      if (this.eventManager) {
        const listenerId = this.eventManager.on(text, "click", clickHandler);
        this.listenerIds.push({ element: text, id: listenerId, type: 'click' });
      } else {
        text.addEventListener("click", clickHandler);
      }
    } catch (error) {
      this._handleError(error, '_addMyLearningText', { value, percent, angle, shouldAnimate });
    }
  }

  _createTextElement(label, value, percent, maxValue) {
    const text = this._createSVGElement("text");
    text.setAttribute("class", "my-learning-text");
    text.setAttribute("font-size", "16");
    text.setAttribute("font-weight", "700");
    text.setAttribute("fill", "#FFF");
    text.setAttribute("stroke", "rgba(0, 0, 0, 0.30)");
    text.setAttribute("stroke-width", "2");
    text.setAttribute("paint-order", "stroke fill");

    const textPath = this._createSVGElement("textPath");
    textPath.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      "#outerArc"
    );
    textPath.setAttribute("text-anchor", "middle");
    textPath.textContent = `${label} : ${value}분 ＞`;

    text.appendChild(textPath);
    return text;
  }

  _calculateTextOffset(value, percent) {
    if (value > this.config.maxValue) {
      return 95;
    }
    return Math.max(10, percent * 100 - 4.5);
  }

  _animateText(element, startOffset, endOffset, duration) {
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = this._easeOutCubic(progress);
      const currentOffset = startOffset + (endOffset - startOffset) * easeOut;

      element.setAttribute("startOffset", `${currentOffset}%`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  _addEndIcon(angle, value, shouldAnimate) {
    const { ICON_HIDE_THRESHOLD } = GaugeChart.CONSTANTS;

    // 70%~100% 사이에는 아이콘 표시하지 않음
    if (
      value >= this.config.maxValue * ICON_HIDE_THRESHOLD &&
      value <= this.config.maxValue
    ) {
      return;
    }

    const isOverMax = value > this.config.maxValue;
    const iconType = isOverMax ? "rocket" : "snail";
    const iconConfig = GaugeChart.ICON_CONFIG[iconType];

    const icon = this._createIconElement(iconType);
    this.svg.appendChild(icon);

    if (shouldAnimate) {
      this._animateIcon(icon, angle, iconConfig, isOverMax);
    } else {
      this._positionIcon(icon, angle, iconConfig, 0);
    }
  }

  _createIconElement(type) {
    const icon = this._createSVGElement("g");

    // image 요소 생성
    const image = this._createSVGElement("image");
    const iconConfig = GaugeChart.ICON_CONFIG[type];

    // 이미지 경로 설정
    const imagePath =
      type === "rocket"
        ? this.config.rocketIconPath
        : this.config.snailIconPath;

    image.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      imagePath
    );
    image.setAttribute("width", iconConfig.width);
    image.setAttribute("height", iconConfig.height);

    icon.appendChild(image);
    return icon;
  }

  _animateIcon(icon, targetAngle, iconConfig, isOverMax) {
    const { MIN_PERCENT, ANIMATION_DURATION } = GaugeChart.CONSTANTS;
    const startAngle = -180 + MIN_PERCENT * 180;
    const fullAngle = 0;
    const angleOffset = -3;

    this._positionIcon(icon, startAngle, iconConfig, angleOffset);

    if (isOverMax) {
      // 초과 시: 100%까지만
      this._animateIconPosition(
        icon,
        startAngle,
        fullAngle,
        iconConfig,
        angleOffset,
        ANIMATION_DURATION
      );
    } else {
      // 정상 범위: 최종 각도까지
      this._animateIconPosition(
        icon,
        startAngle,
        targetAngle,
        iconConfig,
        angleOffset,
        ANIMATION_DURATION
      );
    }
  }

  _animateIconPosition(
    icon,
    startAngle,
    endAngle,
    iconConfig,
    angleOffset,
    duration
  ) {
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = this._easeOutCubic(progress);

      const currentAngle = startAngle + (endAngle - startAngle) * easeOut;
      this._positionIcon(icon, currentAngle, iconConfig, angleOffset);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  _positionIcon(icon, angle, iconConfig, angleOffset = 0) {
    const { offsetX, offsetY, outerOffset } = iconConfig;
    const position = this._polarToCartesian(
      this.center,
      this.center,
      this.radius + outerOffset,
      angle + angleOffset
    );

    const rotation =
      angle + (iconConfig === GaugeChart.ICON_CONFIG.snail ? 90 : 0);

    icon.setAttribute(
      "transform",
      `translate(${position.x - offsetX}, ${position.y - offsetY}) rotate(${rotation}, ${offsetX}, ${offsetY})`
    );
  }

  _addAverageLearningText(value, percent) {
    const text = this._createSVGElement("text");
    text.setAttribute("font-size", "13");
    text.setAttribute("font-weight", "400");
    text.setAttribute("fill", "#4A4947");

    const textPath = this._createSVGElement("textPath");
    textPath.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      "#innerArc"
    );

    const offset =
      value > this.config.maxValue ? Math.max(10, percent * 100) : 100;

    textPath.setAttribute("startOffset", `${offset}%`);
    textPath.setAttribute("text-anchor", "end");
    textPath.innerHTML = `전체 평균 학습`;

    text.appendChild(textPath);
    this.svg.appendChild(text);
  }

  // ============================================
  // 유틸리티 메서드
  // ============================================

  _createSVGElement(type) {
    return document.createElementNS("http://www.w3.org/2000/svg", type);
  }

  _createPathElement(id, d) {
    const path = this._createSVGElement("path");
    if (id) path.setAttribute("id", id);
    if (d) path.setAttribute("d", d);
    return path;
  }

  _polarToCartesian(cx, cy, r, angle) {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  _createArcPath(r, startAngle, endAngle) {
    const start = this._polarToCartesian(
      this.center,
      this.center,
      r,
      startAngle
    );
    const end = this._polarToCartesian(this.center, this.center, r, endAngle);
    return `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
  }

  _easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
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

      // 참조 정리
      this.svg = null;
      this.config = null;
      this.center = 0;
      this.radius = 0;
      this.animated = false;
    } catch (error) {
      this._handleError(error, 'destroy');
    }
  }
}
