// ============================================================================
// 퍼즐 온보딩 시스템 - 리팩토링 버전
// ============================================================================

// ============================================================================
// 설정 및 상수
// ============================================================================
const CONFIG = {
  SVG: {
    NAMESPACE: "http://www.w3.org/2000/svg",
    XLINK_NAMESPACE: "http://www.w3.org/1999/xlink",
    VIEWBOX: "0 0 1870 801",
    DIMENSIONS: { width: 1870, height: 801 },
  },

  ANIMATION: {
    FADE_DURATION: 300,
    HOVER_TRANSITION: "0.3s ease",
    CELEBRATION_DELAY: 600,
  },

  FILTER_IDS: {
    COMPLETED: "completed-effect",
    INNER_SHADOW: "inner-shadow-effect",
    HOVER_SHADOW: "hover-shadow-effect",
  },

  GRADIENT_IDS: {
    BOARD_1: "board_fill_1",
    BOARD_2: "board_fill_2",
    BOARD_3: "board_fill_3",
    BOARD_4: "board_fill_4",
  },

  IMAGE_PATHS: {
    BASE: "./assets/images/onboarding/bg_piece.png",
    COMPLETED: "./assets/images/onboarding/bg_piece_completed.png",
    ALL_COMPLETED: "./assets/images/onboarding/bg_piece_all_completed.png",
  },

  PLAY_BUTTON: {
    RADIUS: 35,
    ICON_SIZE: { width: 25, height: 30 },
    COLOR: "#E8643D",
    OPACITY: 0.9,
  },

  GAUGE: {
    HEIGHT: 7,
    RADIUS: 2,
    VERTICAL_OFFSET: 3, // 조각 하단 라인으로부터의 간격
    // 배경 스타일
    BG_COLOR: "#A0A0A0",
    BG_OPACITY: 0.4,
    // 채우기 스타일
    FILL_COLOR: "#D74800",
  },
};

// 퍼즐 조각 데이터
const PUZZLE_PIECES = [
  {
    id: 1,
    title: "왜 다워인인가",
    path: "M256 780V651.625H21V523H709V780H256Z",
  },
  {
    id: 2,
    title: "새로운 시대 준비된 우리",
    path: "M709.158 11H1162L1161.99 268H709L709.158 11Z",
  },
  {
    id: 3,
    title: "기술개발센터소개",
    path: "M1162.16 11H1615L1614.99 268H1162L1162.16 11Z",
  },
  {
    id: 4,
    title: "건설산업의 디지털 전환을",
    path: "M1162.16 268H1615L1614.99 523H1162L1162.16 268Z",
  },
  {
    id: 5,
    title: "상용 S/W 소개",
    path: "M709.158 268H1162L1161.99 523H709L709.158 268Z",
  },
  {
    id: 6,
    title: "축적의 시간",
    path: "M709.158 523H1162L1161.99 780H709L709.158 523Z",
  },
  {
    id: 7,
    title: "회사생활 (경력)",
    path: "M1162.16 523H1615L1614.99 780H1162L1162.16 523Z",
  },
  {
    id: 8,
    title: "회사생활 (신규입사자편)",
    path: "M1615.08 268H1853L1852.99 617H1615L1615.08 268Z",
  },
  {
    id: 9,
    title: "한맥가족 소개 및 경영이념",
    path: "M256.008 11L256.132 267H330.61L330.618 523H709.008L708.876 11H256.008Z",
  },
  {
    id: 10,
    title: "삼안 소개",
    path: "M330.5 267H21.5V523H330.5V267Z",
  },
];

// 보드 배경 경로 데이터
const BOARD_PATHS = [
  {
    d: "M1866 258C1866 263.523 1861.52 268 1856 268L709 268L709 9.99991C709 4.47706 713.477 -0.000100757 719 -0.000100274L1856 -8.74227e-07C1861.52 -3.91404e-07 1866 4.47715 1866 10L1866 258Z",
    fill: `url(#${CONFIG.GRADIENT_IDS.BOARD_1})`,
  },
  {
    d: "M4 10C4 4.47715 8.47715 0 14 0H699C704.523 0 709 4.47715 709 10V525H14C8.47717 525 4 520.523 4 515V10Z",
    fill: `url(#${CONFIG.GRADIENT_IDS.BOARD_2})`,
  },
  {
    d: "M1856 268C1856.17 268 1856.34 268.004 1856.51 268.013C1861.8 268.281 1866 272.65 1866 278V783C1866 788.523 1861.52 793 1856 793H1171.39C1165.87 793 1161.39 788.523 1161.39 783V523H709V268H1856Z",
    fill: `url(#${CONFIG.GRADIENT_IDS.BOARD_3})`,
  },
  {
    d: "M4 533C4 527.477 8.47715 523 14 523H1162V783C1162 788.523 1157.52 793 1152 793H14C8.47715 793 4 788.523 4 783V533Z",
    fill: `url(#${CONFIG.GRADIENT_IDS.BOARD_4})`,
  },
];

// 그라디언트 정의
const GRADIENTS = [
  {
    id: CONFIG.GRADIENT_IDS.BOARD_1,
    stops: [
      { offset: "0%", color: "#8E2F00" },
      { offset: "100%", color: "#662A0D" },
    ],
  },
  {
    id: CONFIG.GRADIENT_IDS.BOARD_2,
    stops: [
      { offset: "0%", color: "#2A5338" },
      { offset: "100%", color: "#306843" },
    ],
  },
  {
    id: CONFIG.GRADIENT_IDS.BOARD_3,
    stops: [
      { offset: "0%", color: "#5B4822" },
      { offset: "100%", color: "#795711" },
    ],
  },
  {
    id: CONFIG.GRADIENT_IDS.BOARD_4,
    stops: [
      { offset: "0%", color: "#1D375D" },
      { offset: "100%", color: "#385888" },
    ],
  },
];

// 재생 버튼 위치 (타이틀 아래)
const BUTTON_POSITIONS = [
  { id: 1, x: 365, y: 697 }, // 조각 1: 하단
  { id: 2, x: 935, y: 140 }, // 조각 2: 상단
  { id: 3, x: 1388, y: 140 }, // 조각 3: 상단
  { id: 4, x: 1388, y: 395 }, // 조각 4: 중단
  { id: 5, x: 935, y: 395 }, // 조각 5: 중단
  { id: 6, x: 935, y: 651 }, // 조각 6: 하단
  { id: 7, x: 1730, y: 670 }, // 조각 7: 하단 우측 (텍스트 위치 기준)
  { id: 8, x: 1734, y: 442 }, // 조각 8: 중단 우측
  { id: 9, x: 482, y: 267 }, // 조각 9: 상단 좌측
  { id: 10, x: 176, y: 227 }, // 조각 10: 상단 좌측 하단
];

// 타이틀 위치 (SVG 텍스트 위치 기준)
const TITLE_POSITIONS = [
  { id: 1, x: 365, y: 697, lines: ["왜 다워인인가"] }, // 조각 1: 하단
  { id: 2, x: 935, y: 140, lines: ["새로운 시대", "준비된 우리"] }, // 조각 2: 상단
  { id: 3, x: 1388, y: 140, lines: ["기술개발센터소개"] }, // 조각 3: 상단
  { id: 4, x: 1388, y: 395, lines: ["건설산업의", "디지털 전환을"] }, // 조각 4: 중단
  { id: 5, x: 935, y: 395, lines: ["상용 S/W 소개"] }, // 조각 5: 중단
  { id: 6, x: 935, y: 651, lines: ["축적의 시간"] }, // 조각 6: 하단
  { id: 7, x: 1730, y: 670, lines: ["회사생활", "(다윈상담소)"] }, // 조각 7: 하단 우측
  { id: 8, x: 1734, y: 442, lines: ["회사생활", "(신규입사자편)"] }, // 조각 8: 중단 우측
  { id: 9, x: 482, y: 267, lines: ["한맥가족 소개", "및 경영이념"] }, // 조각 9: 상단 좌측
  { id: 10, x: 176, y: 227, lines: ["삼안 소개"] }, // 조각 10: 상단 좌측 하단
];

// 게이지 설정 (각 조각 path의 최하단 Y 좌표 및 X 범위)
const GAUGE_CONFIG = {
  POSITIONS: {
    1: 780, // 조각 1: V780
    2: 268, // 조각 2: 268H709
    3: 268, // 조각 3: 268H1162
    4: 523, // 조각 4: 523H1162
    5: 523, // 조각 5: 523H709
    6: 780, // 조각 6: 780H709
    7: 780, // 조각 7: 780H1162
    8: 617, // 조각 8: 617H1615
    9: 523, // 조각 9: 523H709
    10: 523, // 조각 10: V523
  },
  // 각 조각 하단의 X 좌표 범위
  X_RANGES: {
    1: { left: 21, right: 709, align: "right" }, // 조각 1: 오른쪽 정렬 (실제: 256~709)
    2: { left: 709, right: 1162 }, // 조각 2: 709~1162
    3: { left: 1162, right: 1615 }, // 조각 3: 1162~1615
    4: { left: 1162, right: 1615 }, // 조각 4: 1162~1615
    5: { left: 709, right: 1162 }, // 조각 5: 709~1162
    6: { left: 709, right: 1162 }, // 조각 6: 709~1162
    7: { left: 1162, right: 1615 }, // 조각 7: 1162~1615
    8: { left: 1615, right: 1853 }, // 조각 8: 1615~1853
    9: { left: 330.5, right: 709, align: "right" }, // 조각 9: 오른쪽 정렬
    10: { left: 21.5, right: 330.5 }, // 조각 10: 21.5~330.5
  },
};

// ============================================================================
// SVG 유틸리티 클래스
// ============================================================================
class SVGHelper {
  static createElement(tagName, attributes = {}) {
    const element = document.createElementNS(CONFIG.SVG.NAMESPACE, tagName);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "href" || key === "xlink:href") {
        element.setAttributeNS(CONFIG.SVG.XLINK_NAMESPACE, "xlink:href", value);
        element.setAttribute("href", value);
      } else {
        element.setAttribute(key, value);
      }
    });
    return element;
  }

  static createGradient(gradientData) {
    const gradient = this.createElement("linearGradient", {
      id: gradientData.id,
    });

    gradientData.stops.forEach((stop) => {
      const stopElement = this.createElement("stop", {
        offset: stop.offset,
        "stop-color": stop.color,
      });
      gradient.appendChild(stopElement);
    });

    return gradient;
  }

  static createPattern(patternId, imageUrl, isThumbnail = false) {
    const patternAttrs = { id: patternId };
    const imageAttrs = {
      href: imageUrl,
      "xlink:href": imageUrl,
    };

    if (isThumbnail) {
      // 호버용 썸네일: 조각 크기에 맞춤
      Object.assign(patternAttrs, {
        patternUnits: "objectBoundingBox",
        patternContentUnits: "objectBoundingBox",
        width: "1",
        height: "1",
      });

      Object.assign(imageAttrs, {
        x: "0",
        y: "0",
        width: "1",
        height: "1",
        preserveAspectRatio: "xMidYMid slice",
      });
    } else {
      // 전체 이미지: 전체 좌표계 기준
      Object.assign(patternAttrs, {
        patternUnits: "userSpaceOnUse",
        patternContentUnits: "userSpaceOnUse",
        x: "0",
        y: "0",
        width: String(CONFIG.SVG.DIMENSIONS.width),
        height: String(CONFIG.SVG.DIMENSIONS.height),
      });

      Object.assign(imageAttrs, {
        x: "0",
        y: "0",
        width: String(CONFIG.SVG.DIMENSIONS.width),
        height: String(CONFIG.SVG.DIMENSIONS.height),
        preserveAspectRatio: "none",
      });
    }

    // pattern 요소 생성
    const pattern = this.createElement("pattern", patternAttrs);

    // image 요소 생성 및 추가
    const image = this.createElement("image", imageAttrs);
    pattern.appendChild(image);

    return pattern;
  }
}

// ============================================================================
// 필터 생성 클래스
// ============================================================================
class FilterFactory {
  static createCompletedFilter() {
    const filter = SVGHelper.createElement("filter", {
      id: CONFIG.FILTER_IDS.COMPLETED,
      x: "-50%",
      y: "-50%",
      width: "200%",
      height: "200%",
    });

    const dropShadow = SVGHelper.createElement("feDropShadow", {
      dx: "1",
      dy: "1",
      stdDeviation: "2",
      "flood-color": "rgba(0, 0, 0, 0.8)",
    });

    filter.appendChild(dropShadow);
    return filter;
  }

  static createInnerShadowFilter() {
    const filter = SVGHelper.createElement("filter", {
      id: CONFIG.FILTER_IDS.INNER_SHADOW,
      x: "-50%",
      y: "-50%",
      width: "200%",
      height: "200%",
      filterUnits: "userSpaceOnUse",
      "color-interpolation-filters": "sRGB",
    });

    // Background
    filter.appendChild(
      SVGHelper.createElement("feFlood", {
        "flood-opacity": "0",
        result: "BackgroundImageFix",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feBlend", {
        mode: "normal",
        in: "SourceGraphic",
        in2: "BackgroundImageFix",
        result: "shape",
      })
    );

    // First inner shadow (dark)
    this._addInnerShadow(
      filter,
      -14,
      -11,
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0",
      "shape",
      "effect1_innerShadow"
    );

    // Second inner shadow (light)
    this._addInnerShadow(
      filter,
      11,
      6,
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
      "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0",
      "effect1_innerShadow",
      "effect2_innerShadow"
    );

    return filter;
  }

  static _addInnerShadow(
    filter,
    dx,
    dy,
    alphaMatrix,
    colorMatrix,
    blendIn2,
    resultName
  ) {
    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        in: "SourceAlpha",
        type: "matrix",
        values: alphaMatrix,
        result: "hardAlpha",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feOffset", { dx: String(dx), dy: String(dy) })
    );
    filter.appendChild(
      SVGHelper.createElement("feGaussianBlur", { stdDeviation: "2" })
    );

    filter.appendChild(
      SVGHelper.createElement("feComposite", {
        in2: "hardAlpha",
        operator: "arithmetic",
        k2: "-1",
        k3: "1",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        type: "matrix",
        values: colorMatrix,
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feBlend", {
        mode: "normal",
        in2: blendIn2,
        result: resultName,
      })
    );
  }

  static createHoverShadowFilter() {
    const filter = SVGHelper.createElement("filter", {
      id: CONFIG.FILTER_IDS.HOVER_SHADOW,
      x: "-50%",
      y: "-50%",
      width: "200%",
      height: "200%",
    });

    filter.appendChild(
      SVGHelper.createElement("feGaussianBlur", {
        in: "SourceAlpha",
        stdDeviation: "4",
        result: "blurHover",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feOffset", {
        in: "blurHover",
        dx: "0",
        dy: "-10",
        result: "offsetBlurHover",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feFlood", {
        "flood-color": "rgba(0, 0, 0, 0.5)",
        result: "floodColorHover",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feComposite", {
        in: "floodColorHover",
        in2: "offsetBlurHover",
        operator: "in",
        result: "shadowHover",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feComposite", {
        in: "shadowHover",
        in2: "SourceAlpha",
        operator: "in",
        result: "innerShadowHover",
      })
    );

    const merge = SVGHelper.createElement("feMerge");
    merge.appendChild(
      SVGHelper.createElement("feMergeNode", { in: "SourceGraphic" })
    );
    merge.appendChild(
      SVGHelper.createElement("feMergeNode", { in: "innerShadowHover" })
    );
    filter.appendChild(merge);

    return filter;
  }

  static createGaugeFillFilter() {
    // 게이지 채우기용 inner shadow 필터
    const filter = SVGHelper.createElement("filter", {
      id: "gauge-fill-inner-shadow",
      x: "-50%",
      y: "-50%",
      width: "200%",
      height: "200%",
      filterUnits: "userSpaceOnUse",
      "color-interpolation-filters": "sRGB",
    });

    filter.appendChild(
      SVGHelper.createElement("feFlood", {
        "flood-opacity": "0",
        result: "BackgroundImageFix",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feBlend", {
        mode: "normal",
        in: "SourceGraphic",
        in2: "BackgroundImageFix",
        result: "shape",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        in: "SourceAlpha",
        type: "matrix",
        values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
        result: "hardAlpha",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feOffset", {
        dy: "1",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feGaussianBlur", {
        stdDeviation: "2",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feComposite", {
        in2: "hardAlpha",
        operator: "arithmetic",
        k2: "-1",
        k3: "1",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        type: "matrix",
        values: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feBlend", {
        mode: "normal",
        in2: "shape",
        result: "effect1_innerShadow",
      })
    );

    return filter;
  }
}

// ============================================================================
// 콘텐츠 관리 클래스
// ============================================================================
class ContentManager {
  constructor() {
    this.contentData = this._initializeDefaultContent();
  }

  _initializeDefaultContent() {
    const defaultContent = {};
    PUZZLE_PIECES.forEach((piece) => {
      defaultContent[piece.id] = {
        url: "",
        type: "youtube",
        title: piece.title,
      };
    });
    return defaultContent;
  }

  setContent(data) {
    Object.entries(data).forEach(([key, value]) => {
      const pieceId = parseInt(key);
      if (this.contentData[pieceId]) {
        this.contentData[pieceId] = {
          ...this.contentData[pieceId],
          ...value,
        };

        // 타이틀 업데이트
        if (value.title) {
          const piece = PUZZLE_PIECES.find((p) => p.id === pieceId);
          if (piece) piece.title = value.title;
        }

        // 호버 패턴 업데이트 (SVG가 이미 생성된 경우)
        if (PuzzleManager.instance?.svg) {
          this._updateHoverPattern(pieceId);
        }
      }
    });
  }

  _updateHoverPattern(pieceId) {
    const svg = PuzzleManager.instance.svg;
    if (!svg) return;

    const defs = svg.querySelector("defs");
    if (!defs) return;

    // 기존 호버 패턴 찾기
    const oldPattern = defs.querySelector(`#bg-image-hover-${pieceId}`);
    if (oldPattern) {
      // 새 패턴 생성
      const newPattern = SVGHelper.createPattern(
        `bg-image-hover-${pieceId}`,
        this.getThumbnailUrl(pieceId),
        true
      );

      // 기존 패턴 교체
      defs.replaceChild(newPattern, oldPattern);
    }
  }

  getContent(pieceId) {
    return this.contentData[pieceId];
  }

  getThumbnailUrl(pieceId) {
    const content = this.contentData[pieceId];
    if (!content?.url) return CONFIG.IMAGE_PATHS.BASE;

    if (content.type === "youtube") {
      return `https://img.youtube.com/vi/${content.url}/maxresdefault.jpg`;
    }

    return CONFIG.IMAGE_PATHS.BASE;
  }

  getVideoUrl(pieceId) {
    const content = this.contentData[pieceId];
    if (!content?.url) return null;

    if (content.type === "youtube") {
      return `https://www.youtube.com/embed/${content.url}?autoplay=1`;
    }

    return content.url;
  }
}

// ============================================================================
// 퍼즐 조각 클래스
// ============================================================================
class PuzzlePiece {
  constructor(pieceData, contentManager) {
    this.data = pieceData;
    this.contentManager = contentManager;
    this.group = null;
    this.isCompleted = false;
  }

  createElement() {
    this.group = SVGHelper.createElement("g", {
      class: "puzzle-piece-group",
      "data-piece": this.data.id,
      "data-title": this.data.title,
    });

    const currentUrl = window.location.href.split("#")[0];

    // 이미지 레이어 생성
    this._createImageLayer(
      "piece-base-image",
      `bg-image-${this.data.id}`,
      currentUrl
    );
    this._createImageLayer(
      "piece-hover-image",
      `bg-image-hover-${this.data.id}`,
      currentUrl,
      "0"
    );
    this._createImageLayer(
      "piece-completed-image",
      `bg-image-completed-${this.data.id}`,
      currentUrl,
      "1.0",
      true
    );
    this._createImageLayer(
      "piece-all-completed-image",
      `bg-image-all-completed-${this.data.id}`,
      currentUrl,
      "1.0",
      true
    );

    // 오버레이
    this._createOverlay("piece-overlay-base");
    this._createOverlay("piece-overlay-hover");

    // 이벤트 리스너
    this._attachEventListeners();

    return this.group;
  }

  _createImageLayer(
    className,
    patternId,
    baseUrl,
    opacity = "1.0",
    hidden = false
  ) {
    const path = SVGHelper.createElement("path", {
      d: this.data.path,
      class: className,
      fill: `url(${baseUrl}#${patternId})`,
      "fill-opacity": opacity,
      stroke: "#333",
      "stroke-width": "1",
    });

    if (hidden) path.style.display = "none";
    if (className === "piece-hover-image") {
      path.style.transition = CONFIG.ANIMATION.HOVER_TRANSITION;
    }

    this.group.appendChild(path);
  }

  _createOverlay(className) {
    const overlay = SVGHelper.createElement("path", {
      d: this.data.path,
      class: className,
    });
    this.group.appendChild(overlay);
  }

  _attachEventListeners() {
    this.group.addEventListener("mouseenter", () => this._handleHover(true));
    this.group.addEventListener("mouseleave", () => this._handleHover(false));
    this.group.addEventListener("click", () => this._handleClick());
  }

  _handleHover(isHovering) {
    if (this.isCompleted) return;

    const hoverImg = this.group.querySelector(".piece-hover-image");
    const overlayBase = this.group.querySelector(".piece-overlay-base");

    if (hoverImg) {
      hoverImg.setAttribute("fill-opacity", isHovering ? "1.0" : "0");
      if (isHovering) {
        hoverImg.setAttribute(
          "filter",
          `url(#${CONFIG.FILTER_IDS.INNER_SHADOW})`
        );
      } else {
        hoverImg.removeAttribute("filter");
      }
    }

    if (overlayBase) {
      overlayBase.style.display = isHovering ? "none" : "block";
    }
  }

  _handleClick() {
    PuzzleManager.instance.openVideoModal(this.data.id, this.data.title, this);
  }

  markComplete() {
    if (this.isCompleted) return;

    this.isCompleted = true;
    this.group.classList.add("completed");

    const baseImage = this.group.querySelector(".piece-base-image");
    const hoverImage = this.group.querySelector(".piece-hover-image");
    const completedImage = this.group.querySelector(".piece-completed-image");

    if (baseImage) baseImage.style.display = "none";
    if (hoverImage) hoverImage.style.display = "none";
    if (completedImage) {
      completedImage.style.display = "block";
      completedImage.setAttribute(
        "filter",
        `url(#${CONFIG.FILTER_IDS.INNER_SHADOW}) url(#${CONFIG.FILTER_IDS.COMPLETED})`
      );
    }
  }

  showAllCompleted() {
    const baseImg = this.group.querySelector(".piece-base-image");
    const hoverImg = this.group.querySelector(".piece-hover-image");
    const completedImg = this.group.querySelector(".piece-completed-image");
    const allCompletedImg = this.group.querySelector(
      ".piece-all-completed-image"
    );

    if (baseImg) baseImg.style.display = "none";
    if (hoverImg) hoverImg.style.display = "none";
    if (completedImg) completedImg.style.display = "none";
    if (allCompletedImg) {
      allCompletedImg.style.display = "block";
      allCompletedImg.setAttribute(
        "filter",
        `url(#${CONFIG.FILTER_IDS.INNER_SHADOW}) url(#${CONFIG.FILTER_IDS.COMPLETED})`
      );
    }
  }
}

// ============================================================================
// 게이지 관리 클래스
// ============================================================================
class GaugeManager {
  static createGauge(pieceId, svg) {
    const xRange = GAUGE_CONFIG.X_RANGES[pieceId];
    if (!xRange) return;

    const gaugeGroup = SVGHelper.createElement("g", {
      class: `piece-gauge piece-gauge-${pieceId}`,
      "data-piece": pieceId,
    });

    const gaugeY =
      (GAUGE_CONFIG.POSITIONS[pieceId] || 300) + CONFIG.GAUGE.VERTICAL_OFFSET;

    // 게이지 넓이 계산
    const fullWidth = xRange.right - xRange.left;

    // 정렬 방식에 따라 X 위치 결정
    let gaugeX;
    let gaugeWidth;

    if (xRange.align === "right") {
      // 오른쪽 정렬: 실제 조각 하단 넓이만큼만 표시
      // 조각 1: 256 ~ 709 (하단 실제 영역)
      // 조각 9: 330.5 ~ 709 (하단 실제 영역)
      if (pieceId === 1) {
        gaugeX = 256;
        gaugeWidth = 709 - 256;
      } else if (pieceId === 9) {
        gaugeX = 330.5;
        gaugeWidth = 709 - 330.5;
      } else {
        gaugeX = xRange.left;
        gaugeWidth = fullWidth;
      }
    } else {
      // 왼쪽 정렬 (기본)
      gaugeX = xRange.left;
      gaugeWidth = fullWidth;
    }

    // 게이지 배경 (회색, 반투명)
    const bgPath = this._createGaugePath(gaugeX, gaugeY, gaugeWidth);
    const gaugeBg = SVGHelper.createElement("path", {
      d: bgPath,
      fill: CONFIG.GAUGE.BG_COLOR,
      opacity: CONFIG.GAUGE.BG_OPACITY,
    });
    gaugeBg.style.mixBlendMode = "multiply";
    gaugeGroup.appendChild(gaugeBg);

    // 게이지 채우기용 그룹 (clipPath 사용)
    const fillGroup = SVGHelper.createElement("g", {
      class: "gauge-fill-group",
      filter: "url(#gauge-fill-inner-shadow)",
    });

    // ClipPath 정의
    const clipPathId = `gauge-clip-${pieceId}`;
    const clipPath = SVGHelper.createElement("clipPath", {
      id: clipPathId,
    });
    const clipRect = SVGHelper.createElement("rect", {
      x: gaugeX,
      y: gaugeY,
      width: "0",
      height: CONFIG.GAUGE.HEIGHT + 1,
      class: "gauge-clip-rect",
      "data-gauge-x": gaugeX,
      "data-gauge-width": gaugeWidth,
    });
    clipPath.appendChild(clipRect);

    // defs에 clipPath 추가
    let defs = svg.querySelector("defs");
    if (!defs) {
      defs = SVGHelper.createElement("defs");
      svg.appendChild(defs);
    }
    defs.appendChild(clipPath);

    // 채우기 path (clipPath로 자름)
    const fillPath = this._createGaugePath(gaugeX, gaugeY, gaugeWidth);
    const gaugeFill = SVGHelper.createElement("path", {
      d: fillPath,
      fill: CONFIG.GAUGE.FILL_COLOR,
      "clip-path": `url(#${clipPathId})`,
    });

    fillGroup.appendChild(gaugeFill);
    gaugeGroup.appendChild(fillGroup);

    svg.appendChild(gaugeGroup);
  }

  static _createGaugePath(x, y, width) {
    // 참고 SVG와 유사한 path 생성 (둥근 모서리)
    const height = CONFIG.GAUGE.HEIGHT;
    const radius = CONFIG.GAUGE.RADIUS;

    // 왼쪽이 둥글고 오른쪽이 살짝 경사진 형태
    const rightOffset = 0.5; // 오른쪽 상단이 살짝 올라가는 효과

    return (
      `M${x} ${y + radius}` +
      `C${x} ${y + radius * 0.5} ${x + radius * 0.5} ${y} ${x + radius} ${y}` +
      `H${x + width - radius}` +
      `C${x + width - radius * 0.5} ${y} ${x + width} ${y + radius * 0.5} ${x + width} ${y + radius}` +
      `L${x + width} ${y + height - radius + rightOffset}` +
      `C${x + width} ${y + height - radius * 0.5 + rightOffset} ${x + width - radius * 0.5} ${y + height + rightOffset} ${x + width - radius} ${y + height + rightOffset}` +
      `H${x + radius}` +
      `C${x + radius * 0.5} ${y + height} ${x} ${y + height - radius * 0.5} ${x} ${y + height - radius}` +
      `Z`
    );
  }

  static updateGauge(pieceId, progress) {
    const gauge = document.querySelector(`.piece-gauge-${pieceId}`);
    if (!gauge) return;

    const clipRect = document.querySelector(`#gauge-clip-${pieceId} rect`);
    if (!clipRect) return;

    // data 속성에서 gaugeWidth 가져오기
    const gaugeWidth = parseFloat(clipRect.getAttribute("data-gauge-width"));
    if (!gaugeWidth) return;

    const newWidth = (gaugeWidth * progress) / 100;
    clipRect.setAttribute("width", newWidth);
  }
}

// ============================================================================
// UI 요소 생성 클래스
// ============================================================================
class UIElementFactory {
  static createPlayButton(pieceId, svg) {
    const position = BUTTON_POSITIONS.find((p) => p.id === pieceId);
    if (!position) return;

    const buttonGroup = SVGHelper.createElement("g", {
      class: `piece-play-button piece-play-${pieceId}`,
      "data-piece": pieceId,
    });
    buttonGroup.style.cursor = "pointer";

    // 배경 원
    buttonGroup.appendChild(
      SVGHelper.createElement("circle", {
        cx: position.x,
        cy: position.y,
        r: CONFIG.PLAY_BUTTON.RADIUS,
        fill: CONFIG.PLAY_BUTTON.COLOR,
        opacity: CONFIG.PLAY_BUTTON.OPACITY,
      })
    );

    // 재생 아이콘
    const iconSize = CONFIG.PLAY_BUTTON.ICON_SIZE;
    const trianglePoints =
      `${position.x - iconSize.width / 2.5},${position.y - iconSize.height / 2} ` +
      `${position.x - iconSize.width / 2.5},${position.y + iconSize.height / 2} ` +
      `${position.x + iconSize.width / 1.67},${position.y}`;

    buttonGroup.appendChild(
      SVGHelper.createElement("polygon", {
        points: trianglePoints,
        fill: "white",
      })
    );

    svg.appendChild(buttonGroup);
  }

  static createTitles(svg) {
    TITLE_POSITIONS.forEach((pos) => {
      const text = SVGHelper.createElement("text", {
        x: pos.x,
        y: pos.y,
        "text-anchor": "middle",
        "dominant-baseline": "middle",
        fill: "black",
        stroke: "white",
        "stroke-width": "12",
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
        "paint-order": "stroke fill",
        "font-size": "30",
        "font-weight": "bold",
        "pointer-events": "none",
      });

      const lineHeight = 36;
      const totalHeight = (pos.lines.length - 1) * lineHeight;
      const startY = pos.y - totalHeight / 2;

      pos.lines.forEach((line, index) => {
        const tspan = SVGHelper.createElement("tspan", {
          x: pos.x,
          dy: index === 0 ? 0 : lineHeight,
        });
        tspan.textContent = line;
        text.appendChild(tspan);
      });

      svg.appendChild(text);
    });
  }
}

// ============================================================================
// 모달 관리 클래스
// ============================================================================
class ModalManager {
  static async openVideoModal(pieceId, pieceTitle, pieceElement) {
    try {
      const response = await fetch("./_modal/video-onboarding.html");
      if (!response.ok) throw new Error("모달 로드 실패");

      const modalHTML = await response.text();
      this._removeExistingModal();

      document.body.insertAdjacentHTML("beforeend", modalHTML);
      const modal = document.querySelector(".modal.video");
      modal.style.display = "block";

      this._setupModalContent(modal, pieceId, pieceTitle);
      this._setupModalEvents(modal, pieceId, pieceElement);
    } catch (error) {
      console.error("모달 로드 오류:", error);
      PuzzleManager.instance.markPieceComplete(pieceId, pieceElement);
    }
  }

  static _removeExistingModal() {
    const existingModal = document.querySelector(".modal.video");
    if (existingModal) existingModal.remove();
  }

  static _setupModalContent(modal, pieceId, pieceTitle) {
    const contentManager = PuzzleManager.instance.contentManager;
    const content = contentManager.getContent(pieceId);

    const iframe = modal.querySelector("#videoFrame");
    if (iframe && content?.url) {
      iframe.src = contentManager.getVideoUrl(pieceId);
    }

    const titleElement = modal.querySelector(".tit-box h3");
    if (titleElement) {
      titleElement.textContent = content?.title || pieceTitle;
    }
  }

  static _setupModalEvents(modal, pieceId, pieceElement) {
    const closeBtn = modal.querySelector(".close");
    const closeModal = () => this._closeModal(modal, pieceId, pieceElement);

    if (closeBtn) closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    const escHandler = (e) => {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);
  }

  static _closeModal(modal, pieceId, pieceElement) {
    const iframe = modal.querySelector("#videoFrame");
    if (iframe) iframe.src = "";

    modal.style.opacity = "0";
    setTimeout(() => modal.remove(), CONFIG.ANIMATION.FADE_DURATION);

    PuzzleManager.instance.markPieceComplete(pieceId, pieceElement);
  }
}

// ============================================================================
// 메인 퍼즐 관리 클래스
// ============================================================================
class PuzzleManager {
  static instance = null;

  constructor(boardElementId, initialContent = null) {
    if (PuzzleManager.instance) {
      return PuzzleManager.instance;
    }

    this.boardElement = document.getElementById(boardElementId);
    this.svg = null;
    this.pieces = [];
    this.completedCount = 0;
    this.contentManager = new ContentManager();

    // 초기 콘텐츠 설정
    if (initialContent) {
      this.contentManager.setContent(initialContent);
    }

    PuzzleManager.instance = this;
  }

  initialize() {
    this.svg = this._createSVG();
    this._setupDefs();
    this._createBoardBackground();
    this._createPuzzlePieces();
    UIElementFactory.createTitles(this.svg);
    this._createPlayButtonsAndGauges();

    this.boardElement.appendChild(this.svg);
  }

  _createSVG() {
    return SVGHelper.createElement("svg", {
      viewBox: CONFIG.SVG.VIEWBOX,
      fill: "none",
    });
  }

  _setupDefs() {
    const defs = SVGHelper.createElement("defs");

    // 그라디언트
    GRADIENTS.forEach((grad) => {
      defs.appendChild(SVGHelper.createGradient(grad));
    });

    // 필터
    defs.appendChild(FilterFactory.createCompletedFilter());
    defs.appendChild(FilterFactory.createInnerShadowFilter());
    defs.appendChild(FilterFactory.createHoverShadowFilter());
    defs.appendChild(FilterFactory.createGaugeFillFilter());

    // 패턴
    PUZZLE_PIECES.forEach((piece) => {
      defs.appendChild(
        SVGHelper.createPattern(
          `bg-image-${piece.id}`,
          CONFIG.IMAGE_PATHS.BASE,
          false
        )
      );

      defs.appendChild(
        SVGHelper.createPattern(
          `bg-image-hover-${piece.id}`,
          this.contentManager.getThumbnailUrl(piece.id),
          true
        )
      );

      defs.appendChild(
        SVGHelper.createPattern(
          `bg-image-completed-${piece.id}`,
          CONFIG.IMAGE_PATHS.COMPLETED,
          false
        )
      );

      defs.appendChild(
        SVGHelper.createPattern(
          `bg-image-all-completed-${piece.id}`,
          CONFIG.IMAGE_PATHS.ALL_COMPLETED,
          false
        )
      );
    });

    this.svg.appendChild(defs);
  }

  _createBoardBackground() {
    BOARD_PATHS.forEach((boardData) => {
      const path = SVGHelper.createElement("path", {
        d: boardData.d,
        fill: boardData.fill,
      });
      this.svg.appendChild(path);
    });
  }

  _createPuzzlePieces() {
    PUZZLE_PIECES.forEach((pieceData) => {
      const piece = new PuzzlePiece(pieceData, this.contentManager);
      this.pieces.push(piece);
      this.svg.appendChild(piece.createElement());
    });
  }

  _createPlayButtonsAndGauges() {
    PUZZLE_PIECES.forEach((piece) => {
      UIElementFactory.createPlayButton(piece.id, this.svg);
      GaugeManager.createGauge(piece.id, this.svg);
    });
  }

  setContent(data) {
    this.contentManager.setContent(data);
  }

  updateGauge(pieceId, progress) {
    GaugeManager.updateGauge(pieceId, progress);
  }

  openVideoModal(pieceId, pieceTitle, pieceElement) {
    ModalManager.openVideoModal(pieceId, pieceTitle, pieceElement);
  }

  markPieceComplete(pieceId, pieceElement) {
    const piece = this.pieces.find((p) => p.data.id === pieceId);
    if (!piece || piece.isCompleted) return;

    piece.markComplete();
    this.completedCount++;
    this._updateProgress();

    if (this.completedCount === PUZZLE_PIECES.length) {
      this._handleAllComplete();
    }
  }

  _updateProgress() {
    const percentage = (this.completedCount / PUZZLE_PIECES.length) * 100;

    const progressFill = document.getElementById("progressFill");
    const completedCount = document.getElementById("completedCount");
    const progressPercent = document.getElementById("progressPercent");

    if (progressFill) progressFill.style.width = percentage + "%";
    if (completedCount) completedCount.textContent = this.completedCount;
    if (progressPercent) progressPercent.textContent = Math.round(percentage);
  }

  _handleAllComplete() {
    this.boardElement.classList.add("all-completed");

    this.pieces.forEach((piece) => {
      piece.showAllCompleted();
    });

    setTimeout(
      () => this._showCelebration(),
      CONFIG.ANIMATION.CELEBRATION_DELAY
    );
  }

  _showCelebration() {
    const overlay = document.getElementById("overlay");
    const celebration = document.getElementById("celebration");
    if (overlay) overlay.classList.add("show");
    if (celebration) celebration.classList.add("show");
  }

  initializeWithCompletedPieces(completedPieceIds) {
    completedPieceIds.forEach((pieceId) => {
      const piece = this.pieces.find((p) => p.data.id === pieceId);
      if (piece) {
        piece.markComplete();
        this.completedCount++;
      }
    });
    this._updateProgress();
  }
}

// ============================================================================
// 전역 함수 (하위 호환성)
// ============================================================================
function setPuzzleContent(data) {
  if (PuzzleManager.instance) {
    PuzzleManager.instance.setContent(data);
  }
}

function updatePieceGauge(pieceId, progress) {
  if (PuzzleManager.instance) {
    PuzzleManager.instance.updateGauge(pieceId, progress);
  }
}

function initializeProgress(completedPieces) {
  if (PuzzleManager.instance) {
    PuzzleManager.instance.initializeWithCompletedPieces(completedPieces);
  }
}

// ============================================================================
// 초기화
// ============================================================================
function initializeOverlay() {
  const overlay = document.getElementById("overlay");
  const celebration = document.getElementById("celebration");

  if (overlay && celebration) {
    overlay.addEventListener("click", function () {
      this.classList.remove("show");
      celebration.classList.remove("show");
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // window.puzzleContentData가 있으면 초기 콘텐츠로 사용
  const initialContent = window.puzzleContentData || null;

  const puzzleManager = new PuzzleManager("puzzleBoard", initialContent);
  puzzleManager.initialize();
  initializeOverlay();
});

// ============================================================================
// Export (모듈로 사용할 경우)
// ============================================================================
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PuzzleManager,
    ContentManager,
    GaugeManager,
    setPuzzleContent,
    updatePieceGauge,
    initializeProgress,
  };
}
