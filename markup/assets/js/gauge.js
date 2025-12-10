// ============================================
// 게이지 차트 모듈
// ============================================

export class GaugeChart {
  constructor(config) {
    this.config = {
      size: config.size || 832,
      strokeWidth: config.strokeWidth || 31,
      maxValue: config.maxValue || 50,
      padding: config.padding || 20,
      outerTextOffset: config.outerTextOffset || 6,
      innerTextOffset: config.innerTextOffset || 35,
      dotRadius: config.dotRadius || 7,
    };
    this.svg = null;
    this.center = 0;
    this.radius = 0;
    this.animated = false;
  }

  // 초기화
  init() {
    this.svg = document.getElementById("gauge");
    if (!this.svg) {
      console.error("게이지 SVG 요소를 찾을 수 없습니다");
      return;
    }

    const { size, strokeWidth, padding } = this.config;
    this.center = size / 2;
    this.radius = size / 2 - strokeWidth / 2 - padding;

    this.svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    this.svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }

  // 게이지 업데이트
  update(value) {
    if (!this.svg) return;

    this.svg.innerHTML = "";

    let percent;

    if (value <= this.config.maxValue) {
      // 정상 비율
      percent = value / this.config.maxValue;
      percent = Math.max(percent, 0.14); // 최소 14%;
    } else {
      // 초과 시 반전 비율
      percent = 2 - value / this.config.maxValue;
      percent = Math.max(percent, 0.1); // 최소 10%;
    }

    const angle = -180 + percent * 180;

    // 배경 반원
    this.createBackgroundArc(value);

    // 채워진 반원
    this.createFilledArc(angle, value);

    // 텍스트 경로 정의
    this.createTextPaths();

    // "나의 학습" 텍스트
    this.addMyLearningText(value, percent);

    // 끝점 원
    //this.addEndPoint(angle);

    // 끝점 아이콘
    this.addEndIcon(angle);

    // "전체 평균 학습" 텍스트
    this.addAverageLearningText(value, percent);
  }

  // 극좌표 → 직교좌표
  polarToCartesian(cx, cy, r, angle) {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  // 원호 경로 생성
  createArcPath(r, startAngle, endAngle) {
    const start = this.polarToCartesian(
      this.center,
      this.center,
      r,
      startAngle
    );
    const end = this.polarToCartesian(this.center, this.center, r, endAngle);
    return `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
  }

  // 배경 반원 생성
  createBackgroundArc(value) {
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    bg.setAttribute("d", this.createArcPath(this.radius, -180, 0));
    if (value <= this.config.maxValue) {
      bg.setAttribute("stroke", "#72451F");
      bg.setAttribute("stroke-opacity", "0.1");
    } else {
      bg.setAttribute("stroke", "#D8823B");
    }

    bg.setAttribute("stroke-width", this.config.strokeWidth);

    bg.setAttribute("stroke-linecap", "round");
    bg.setAttribute("fill", "none");
    this.svg.appendChild(bg);
  }

  createFilledArc(angle, value) {
    const defs =
      this.svg.querySelector("defs") ||
      document.createElementNS("http://www.w3.org/2000/svg", "defs");

    if (!this.svg.querySelector("defs")) {
      this.svg.appendChild(defs);
    }

    // ★ linearGradient 그대로
    let gradient = defs.querySelector("#arcSweepGradient");

    if (!gradient) {
      gradient = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "linearGradient"
      );
      gradient.setAttribute("id", "arcSweepGradient");
      gradient.setAttribute("x1", "0%");
      gradient.setAttribute("y1", "0%");
      gradient.setAttribute("x2", "100%");
      gradient.setAttribute("y2", "0%");

      const stop1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );
      stop1.setAttribute("offset", "0%");
      stop1.setAttribute("stop-color", "#72451F");

      const stop2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );
      stop2.setAttribute("offset", "100%");
      stop2.setAttribute("stop-color", "#D8823B");

      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      defs.appendChild(gradient);
    }

    // ★ 그라데이션 회전
    gradient.setAttribute(
      "gradientTransform",
      `rotate(${angle - 90}, 0.5, 0.5)`
    );

    // ★ 아크 path 생성
    const fg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    fg.setAttribute("d", this.createArcPath(this.radius, -180, angle));
    fg.setAttribute(
      "stroke",
      value <= this.config.maxValue ? "#e89555" : "url(#arcSweepGradient)"
    );
    fg.setAttribute("stroke-width", this.config.strokeWidth);
    fg.setAttribute("stroke-linecap", "round");
    fg.setAttribute("fill", "none");

    this.svg.appendChild(fg);

    // ================================================
    // ★★ 여기가 애니메이션 핵심 ★★
    // ================================================
    if (!this.animated) {
      const length = fg.getTotalLength(); // 경로 총 길이

      fg.style.strokeDasharray = length; // 대시 간격 설정
      fg.style.strokeDashoffset = length; // 초기 오프셋: 경로 숨김

      // CSS transition 이용
      fg.style.transition = "stroke-dashoffset 1.4s ease-out";

      // 첫 프레임 이후 실행 (애니메이션 시작)
      requestAnimationFrame(() => {
        fg.style.strokeDashoffset = 0; // 오프셋을 0으로 변경하여 게이지를 채움
      });

      // ★ 애니메이션 1회만 실행되도록 플래그
      this.animated = true;
    }
  }

  // 텍스트 경로 정의
  createTextPaths() {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    // 외곽 텍스트 경로
    const outerArc = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    outerArc.setAttribute("id", "outerArc");
    outerArc.setAttribute(
      "d",
      this.createArcPath(this.radius - this.config.outerTextOffset, -180, 0)
    );
    defs.appendChild(outerArc);

    // 내부 텍스트 경로
    const innerArc = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    innerArc.setAttribute("id", "innerArc");
    innerArc.setAttribute(
      "d",
      this.createArcPath(this.radius - this.config.innerTextOffset, -180, 0)
    );
    defs.appendChild(innerArc);

    this.svg.appendChild(defs);
  }

  // "나의 학습" 텍스트 추가
  addMyLearningText(value, percent) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("font-size", "16");
    text.setAttribute("font-weight", "700");
    text.setAttribute("fill", "#FFF");
    text.setAttribute("stroke", "rgba(0, 0, 0, 0.30)");
    text.setAttribute("stroke-width", "2 ");
    text.setAttribute("paint-order", "stroke fill");

    const textPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "textPath"
    );

    textPath.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      "#outerArc"
    );
    // ★ 조건 적용: value > maxValue 인 경우
    if (value > this.config.maxValue) {
      textPath.setAttribute("startOffset", "95%");
    } else {
      // ★ 기존 방식
      textPath.setAttribute(
        "startOffset",
        `${Math.max(10, percent * 100 - 4.5)}%`
      );
    }
    textPath.setAttribute("text-anchor", "middle");
    textPath.textContent = `나의 학습 : ${value}분 ＞`;

    text.appendChild(textPath);
    this.svg.appendChild(text);
  }

  // 끝점 원 추가
  addEndPoint(angle) {
    const point = this.polarToCartesian(
      this.center,
      this.center,
      this.radius,
      angle
    );
    const dot = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    dot.setAttribute("cx", point.x);
    dot.setAttribute("cy", point.y);
    dot.setAttribute("r", this.config.dotRadius);
    dot.setAttribute("fill", "#804514");
    this.svg.appendChild(dot);
  }

  // 끝점 아이콘 추가
  addEndIcon(angle) {
    const iconPos = this.polarToCartesian(
      this.center,
      this.center,
      this.radius,
      angle
    );
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "g");
    icon.setAttribute(
      "transform",
      `translate(${iconPos.x - 4}, ${iconPos.y - 3.5})`
    );
    icon.innerHTML = `
      <path d="M7.25859 5.72241C7.45848 6.05134 7.22735 6.47331 6.84254 6.48196L0.511261 6.62427C-0.0386892 6.63663 -0.202465 5.88127 0.303221 5.66476L3.21705 4.41716C3.42672 4.32738 3.54907 4.10709 3.51446 3.88165L3.00742 0.578948C2.92444 0.0384521 3.64493 -0.223896 3.92892 0.243408L7.25859 5.72241Z" fill="#E28A41"/>
    `;
    this.svg.appendChild(icon);
  }

  // "전체 평균 학습" 텍스트 추가
  addAverageLearningText(value, percent) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("font-size", "16");
    text.setAttribute("font-weight", "400");
    text.setAttribute("fill", "#4A4947");

    const textPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "textPath"
    );
    textPath.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      "#innerArc"
    );
    if (value > this.config.maxValue) {
      textPath.setAttribute("startOffset", `${Math.max(10, percent * 100)}%`);
    } else {
      textPath.setAttribute("startOffset", "100%");
    }
    textPath.setAttribute("text-anchor", "end");
    textPath.innerHTML = `전체 평균 학습`;

    text.appendChild(textPath);
    this.svg.appendChild(text);
  }
}
