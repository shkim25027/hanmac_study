// ============================================================================
// 퍼즐 온보딩 시스템
// ============================================================================

// ============================================================================
// 설정 및 상수
// ============================================================================
const DEFAULT_CONFIG = {
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
    COMPLETION_ANIMATION_DURATION: 2500,
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
    COMPLETED: {
      ACTIVE: "./assets/images/onboarding/bg_piece_completed.png",
      COMPLETED: "./assets/images/onboarding/bg_piece_all_completed.png",
      ALL_COMPLETED: "./assets/images/onboarding/bg_piece_all_completed.png",
    },
    FINISH: {
      ACTIVE: "./assets/images/onboarding/bg_piece_all_completed.png",
      COMPLETED: "./assets/images/onboarding/bg_piece_finish.png",
      ALL_COMPLETED: "./assets/images/onboarding/bg_piece_all_completed.png",
    },
  },

  COMPLETION_MODE: "FINISH",

  PLAY_BUTTON: {
    RADIUS: 28,
    ICON_SIZE: { width: 22, height: 26 },
    COLOR: "#E8643D",
    OPACITY: 0.9,
  },

  FILE_BUTTON: {
    RADIUS: 35,
    ICON_SIZE: { width: 32, height: 28 },
    COLOR: "#4A90E2",
    OPACITY: 0.9,
  },

  GROUP_COLORS: {
    1: "#306743",
    2: "#8F360B",
    3: "#1D375D",
    4: "#7B6029",
  },

  GAUGE: {
    HEIGHT: 7,
    RADIUS: 2,
    VERTICAL_OFFSET: -7,
    BG_COLOR: "#A0A0A0",
    BG_OPACITY: 0.4,
    FILL_COLOR: "#D74800",
  },
};

const CONFIG = {
  ...DEFAULT_CONFIG,
  ...(window.puzzleConfig || {}),
};

const CELEBRATION_RIBBON_POSITION = {
  pieceId: 2,
  offsetX: 0,
  offsetY: -200,
};

const PUZZLE_PIECES = [
  {
    id: 1,
    title: "왜 다윈인인가 (최재천 교수)",
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

const BUTTON_POSITIONS = [
  { id: 1, x: 475, y: 686 },
  { id: 2, x: 935, y: 175 },
  { id: 3, x: 1388, y: 175 },
  { id: 4, x: 1388, y: 420 },
  { id: 5, x: 935, y: 420 },
  { id: 6, x: 935, y: 686 },
  { id: 7, x: 1388, y: 686 },
  { id: 8, x: 1734, y: 492 },
  { id: 9, x: 482, y: 317 },
  { id: 10, x: 176, y: 420 },
];

const TITLE_POSITIONS = [
  {
    id: 1,
    x: 475,
    y: 630,
    lines: ["왜 다윈인인가 (최재천 교수)"],
  },
  { id: 2, x: 935, y: 120, lines: ["새로운 시대 준비된 우리"] },
  { id: 3, x: 1388, y: 120, lines: ["기술개발센터소개"] },
  { id: 4, x: 1388, y: 365, lines: ["건설산업의 디지털 전환을"] },
  { id: 5, x: 935, y: 365, lines: ["상용 S/W 소개"] },
  { id: 6, x: 935, y: 630, lines: ["축적의 시간"] },
  { id: 7, x: 1388, y: 630, lines: ["회사생활 (경력)"] },
  { id: 8, x: 1734, y: 402, lines: ["회사생활", "(신규입사자편)"] },
  { id: 9, x: 482, y: 227, lines: ["한맥가족 소개", "및 경영이념"] },
  { id: 10, x: 176, y: 365, lines: ["삼안 소개"] },
];

const GAUGE_CONFIG = {
  POSITIONS: {
    1: 780,
    2: 268,
    3: 268,
    4: 523,
    5: 523,
    6: 780,
    7: 780,
    8: 617,
    9: 523,
    10: 523,
  },
  X_RANGES: {
    1: { left: 21, right: 709, align: "right" },
    2: { left: 709.158, right: 1162 },
    3: { left: 1162.16, right: 1615 },
    4: { left: 1162.16, right: 1615 },
    5: { left: 709.158, right: 1162 },
    6: { left: 709.158, right: 1162 },
    7: { left: 1162.16, right: 1615 },
    8: { left: 1615.08, right: 1853 },
    9: { left: 330.61, right: 709.008, align: "right" },
    10: { left: 21.5, right: 330.5 },
  },
  WIDTH_RATIOS: {},
  // 퍼즐 경계 내에서 게이지가 그려지도록 최대 길이 제한 (stroke-linecap 반지름 고려)
  MAX_LENGTHS: {
    1: 453, // 709 - 256
    2: 452.842, // 1162 - 709.158
    3: 452.84, // 1615 - 1162.16
    4: 452.84, // 1615 - 1162.16
    5: 452.842, // 1162 - 709.158
    6: 452.842, // 1162 - 709.158
    7: 452.84, // 1615 - 1162.16
    8: 237.92, // 1853 - 1615.08
    9: 378.398, // 709.008 - 330.61
    10: 309, // 330.5 - 21.5
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

    const pattern = this.createElement("pattern", patternAttrs);
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

    this._addInnerShadow(
      filter,
      -14,
      -11,
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0",
      "shape",
      "effect1_innerShadow"
    );

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

    filter.appendChild(SVGHelper.createElement("feOffset", { dy: "1" }));

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

  static createPlayButtonFilters() {
    const filters = [];

    const outerFilter = SVGHelper.createElement("filter", {
      id: "play-button-outer-filter",
      x: "-50%",
      y: "-50%",
      width: "200%",
      height: "200%",
      filterUnits: "userSpaceOnUse",
      "color-interpolation-filters": "sRGB",
    });

    outerFilter.appendChild(
      SVGHelper.createElement("feGaussianBlur", {
        in: "SourceAlpha",
        stdDeviation: "2.7",
        result: "blur1",
      })
    );

    outerFilter.appendChild(
      SVGHelper.createElement("feOffset", {
        in: "blur1",
        result: "offset1",
      })
    );

    outerFilter.appendChild(
      SVGHelper.createElement("feFlood", {
        "flood-color": "rgba(0, 0, 0, 0.25)",
        result: "color1",
      })
    );

    outerFilter.appendChild(
      SVGHelper.createElement("feComposite", {
        in: "color1",
        in2: "offset1",
        operator: "in",
        result: "shadow1",
      })
    );

    const merge1 = SVGHelper.createElement("feMerge");
    merge1.appendChild(
      SVGHelper.createElement("feMergeNode", { in: "shadow1" })
    );
    merge1.appendChild(
      SVGHelper.createElement("feMergeNode", { in: "SourceGraphic" })
    );
    outerFilter.appendChild(merge1);

    filters.push(outerFilter);

    const iconFilter = SVGHelper.createElement("filter", {
      id: "play-button-icon-filter",
      x: "-50%",
      y: "-50%",
      width: "200%",
      height: "200%",
      filterUnits: "userSpaceOnUse",
      "color-interpolation-filters": "sRGB",
    });

    iconFilter.appendChild(
      SVGHelper.createElement("feOffset", {
        dx: "2",
        dy: "2",
        result: "offset2",
      })
    );

    iconFilter.appendChild(
      SVGHelper.createElement("feGaussianBlur", {
        in: "offset2",
        stdDeviation: "0.5",
        result: "blur2",
      })
    );

    iconFilter.appendChild(
      SVGHelper.createElement("feFlood", {
        "flood-color": "rgba(0, 0, 0, 0.25)",
        result: "color2",
      })
    );

    iconFilter.appendChild(
      SVGHelper.createElement("feComposite", {
        in: "color2",
        in2: "blur2",
        operator: "in",
        result: "shadow2",
      })
    );

    const merge2 = SVGHelper.createElement("feMerge");
    merge2.appendChild(
      SVGHelper.createElement("feMergeNode", { in: "shadow2" })
    );
    merge2.appendChild(
      SVGHelper.createElement("feMergeNode", { in: "SourceGraphic" })
    );
    iconFilter.appendChild(merge2);

    filters.push(iconFilter);

    return filters;
  }

  static createTextShadowFilter() {
    const filter = SVGHelper.createElement("filter", {
      id: "text-shadow-filter",
      x: "-50%",
      y: "-50%",
      width: "200%",
      height: "200%",
    });

    filter.appendChild(
      SVGHelper.createElement("feDropShadow", {
        dx: "0",
        dy: "4",
        stdDeviation: "3",
        "flood-color": "rgba(0, 0, 0, 0.3)",
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
        group: 1,
        completed: false,
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

        if (value.title) {
          const piece = PUZZLE_PIECES.find((p) => p.id === pieceId);
          if (piece) piece.title = value.title;
        }

        if (PuzzleManager.instance?.svg) {
          this._updateHoverPattern(pieceId);

          if (value.title) {
            this._updateSVGText(pieceId, value.title);
          }

          if (value.type || value.group) {
            this._updateButtonType(pieceId);
          }
        }
      }
    });
  }

  _updateSVGText(pieceId, newTitle) {
    const svg = PuzzleManager.instance.svg;
    if (!svg) return;

    const texts = svg.querySelectorAll("text");
    const titlePos = TITLE_POSITIONS.find((t) => t.id === pieceId);
    if (!titlePos) return;

    for (let text of texts) {
      const x = parseFloat(text.getAttribute("x"));
      const y = parseFloat(text.getAttribute("y"));

      if (Math.abs(x - titlePos.x) < 1 && Math.abs(y - titlePos.y) < 1) {
        const tspans = text.querySelectorAll("tspan");

        if (tspans.length === 1) {
          tspans[0].textContent = newTitle;
        } else if (tspans.length === 2) {
          const words = newTitle.split(" ");
          if (words.length >= 2) {
            tspans[0].textContent = words
              .slice(0, Math.ceil(words.length / 2))
              .join(" ");
            tspans[1].textContent = words
              .slice(Math.ceil(words.length / 2))
              .join(" ");
          } else {
            tspans[0].textContent = newTitle;
            tspans[1].textContent = "";
          }
        }
        break;
      }
    }
  }

  _updateHoverPattern(pieceId) {
    const svg = PuzzleManager.instance.svg;
    if (!svg) return;

    const defs = svg.querySelector("defs");
    if (!defs) return;

    const oldPattern = defs.querySelector(`#bg-image-hover-${pieceId}`);
    if (oldPattern) {
      const newPattern = SVGHelper.createPattern(
        `bg-image-hover-${pieceId}`,
        this.getThumbnailUrl(pieceId),
        true
      );

      defs.replaceChild(newPattern, oldPattern);
    }
  }

  _updateButtonType(pieceId) {
    const svg = PuzzleManager.instance.svg;
    if (!svg) return;

    const buttonGroup = svg.querySelector(`.piece-play-${pieceId}`);
    if (!buttonGroup) return;

    buttonGroup.remove();
    UIElementFactory.createPlayButton(pieceId, svg);
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
    this._createImageLayer(
      "piece-finish-image",
      `bg-image-finish-${this.data.id}`,
      currentUrl,
      "1.0",
      true
    );

    this._createOverlay("piece-overlay-base");
    this._createOverlay("piece-overlay-hover");

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
    this._toggleText(isHovering);

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

    if (this.isCompleted) {
      const completedImg = this.group.querySelector(".piece-completed-image");
      const allCompletedImg = this.group.querySelector(
        ".piece-all-completed-image"
      );
      const finishImg = this.group.querySelector(".piece-finish-image");

      [completedImg, allCompletedImg, finishImg].forEach((img) => {
        if (img && img.style.display !== "none") {
          img.style.opacity = isHovering ? "0" : "1";
        }
      });
    }
  }

  _toggleText(hide) {
    const svg = PuzzleManager.instance?.svg;
    if (!svg) return;

    const titlePos = TITLE_POSITIONS.find((t) => t.id === this.data.id);
    if (!titlePos) return;

    const texts = svg.querySelectorAll("text");
    for (let text of texts) {
      const x = parseFloat(text.getAttribute("x"));
      const y = parseFloat(text.getAttribute("y"));

      if (Math.abs(x - titlePos.x) < 1 && Math.abs(y - titlePos.y) < 1) {
        text.style.opacity = hide ? "0" : "1";
        text.style.transition = "opacity 0.3s ease";
        break;
      }
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
    const completedImage = this.group.querySelector(".piece-completed-image");

    if (baseImage) baseImage.style.display = "none";

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
    const completedImg = this.group.querySelector(".piece-completed-image");
    const allCompletedImg = this.group.querySelector(
      ".piece-all-completed-image"
    );
    const finishImg = this.group.querySelector(".piece-finish-image");

    [baseImg, completedImg, allCompletedImg].forEach((img) => {
      if (img) img.style.display = "none";
    });

    if (finishImg) {
      finishImg.style.display = "block";
      finishImg.setAttribute(
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

    const fullWidth = xRange.right - xRange.left;

    let gaugeX;
    let bgWidth;
    let fillWidth;

    if (xRange.align === "right") {
      if (pieceId === 1) {
        gaugeX = 256;
        bgWidth = 709 - 256;
      } else if (pieceId === 9) {
        gaugeX = 330.61; // 정확한 경계 사용
        bgWidth = 709.008 - 330.61;
      } else {
        gaugeX = xRange.left;
        bgWidth = fullWidth;
      }
    } else {
      gaugeX = xRange.left;
      bgWidth = fullWidth;
    }

    // stroke-linecap: "round"로 인한 반지름만큼 여유 고려
    const strokeRadius = CONFIG.GAUGE.HEIGHT / 2;
    gaugeX = Math.max(gaugeX, xRange.left + strokeRadius);

    fillWidth = bgWidth;

    if (GAUGE_CONFIG.WIDTH_RATIOS && GAUGE_CONFIG.WIDTH_RATIOS[pieceId]) {
      const ratio = GAUGE_CONFIG.WIDTH_RATIOS[pieceId];
      fillWidth = bgWidth * ratio;
    }

    // 퍼즐 경계를 넘지 않도록 최대 길이 제한
    if (GAUGE_CONFIG.MAX_LENGTHS && GAUGE_CONFIG.MAX_LENGTHS[pieceId]) {
      const maxLength = GAUGE_CONFIG.MAX_LENGTHS[pieceId];
      fillWidth = Math.min(fillWidth, maxLength);
      bgWidth = Math.min(bgWidth, maxLength);
    }

    // stroke-linecap: "round"로 인한 반지름만큼 여유를 두고 경계 체크
    const maxEndX = xRange.right - strokeRadius; // 반지름만큼 여유
    const calculatedEndX = gaugeX + bgWidth;
    if (calculatedEndX > maxEndX) {
      bgWidth = maxEndX - gaugeX;
      fillWidth = Math.min(fillWidth, bgWidth);
    }

    const bgLine = SVGHelper.createElement("line", {
      x1: gaugeX,
      y1: gaugeY + CONFIG.GAUGE.HEIGHT / 2,
      x2: gaugeX + bgWidth,
      y2: gaugeY + CONFIG.GAUGE.HEIGHT / 2,
      stroke: CONFIG.GAUGE.BG_COLOR,
      "stroke-width": CONFIG.GAUGE.HEIGHT,
      "stroke-linecap": "round",
      opacity: CONFIG.GAUGE.BG_OPACITY,
      class: "gauge-bg-line",
    });
    bgLine.style.mixBlendMode = "multiply";
    gaugeGroup.appendChild(bgLine);

    const fillLine = SVGHelper.createElement("line", {
      x1: gaugeX,
      y1: gaugeY + CONFIG.GAUGE.HEIGHT / 2,
      x2: gaugeX + fillWidth,
      y2: gaugeY + CONFIG.GAUGE.HEIGHT / 2,
      stroke: CONFIG.GAUGE.FILL_COLOR,
      "stroke-width": CONFIG.GAUGE.HEIGHT,
      "stroke-linecap": "round",
      class: "gauge-fill-line",
      filter: "url(#gauge-fill-inner-shadow)",
      "data-gauge-length": fillWidth,
    });

    fillLine.style.strokeDasharray = `${fillWidth}`;
    fillLine.style.strokeDashoffset = `${fillWidth}`;
    fillLine.style.transition = "stroke-dashoffset 0.6s ease-out";

    gaugeGroup.appendChild(fillLine);
    svg.appendChild(gaugeGroup);
  }

  static updateGauge(pieceId, progress) {
    progress = Math.max(0, Math.min(100, progress));

    const fillLine = document.querySelector(
      `.piece-gauge-${pieceId} .gauge-fill-line`
    );

    if (!fillLine) return;

    const gaugeLength = parseFloat(fillLine.getAttribute("data-gauge-length"));
    if (!gaugeLength || isNaN(gaugeLength)) return;

    const offset = gaugeLength * (1 - progress / 100);

    requestAnimationFrame(() => {
      fillLine.style.strokeDashoffset = `${offset}`;
    });
  }
}

// ============================================================================
// UI 요소 생성 클래스
// ============================================================================
class UIElementFactory {
  static createPlayButton(pieceId, svg) {
    const position = BUTTON_POSITIONS.find((p) => p.id === pieceId);
    if (!position) return;

    const contentManager = PuzzleManager.instance?.contentManager;
    const content = contentManager?.getContent(pieceId);
    const isFileType = content?.type === "file";
    const groupColor = CONFIG.GROUP_COLORS[content?.group || 1];

    const buttonGroup = SVGHelper.createElement("g", {
      class: `piece-play-button piece-play-${pieceId}`,
      "data-piece": pieceId,
    });
    buttonGroup.style.cursor = "pointer";

    if (isFileType) {
      this._createFileIconWithBackground(
        buttonGroup,
        position.x,
        position.y,
        groupColor
      );
    } else {
      this._createPlayIcon(buttonGroup, position.x, position.y, groupColor);
    }

    svg.appendChild(buttonGroup);
  }

  static _createPlayIcon(group, x, y, groupColor) {
    const outerCircleGroup = SVGHelper.createElement("g", {
      filter: "url(#play-button-outer-filter)",
    });

    const mainCircle = SVGHelper.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: CONFIG.PLAY_BUTTON.RADIUS,
      ry: CONFIG.PLAY_BUTTON.RADIUS - 1,
      fill: groupColor,
      opacity: 0.95,
    });
    outerCircleGroup.appendChild(mainCircle);

    const strokeCircle = SVGHelper.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: CONFIG.PLAY_BUTTON.RADIUS,
      ry: CONFIG.PLAY_BUTTON.RADIUS,
      fill: "none",
      stroke: "white",
      "stroke-opacity": "0.9",
      "stroke-width": "4",
    });
    outerCircleGroup.appendChild(strokeCircle);

    group.appendChild(outerCircleGroup);

    const playIconGroup = SVGHelper.createElement("g", {
      filter: "url(#play-button-icon-filter)",
    });

    const iconSize = CONFIG.PLAY_BUTTON.ICON_SIZE;
    const trianglePath =
      `M${x - iconSize.width / 3},${y - iconSize.height / 2.5} ` +
      `L${x - iconSize.width / 3},${y + iconSize.height / 2.5} ` +
      `L${x + iconSize.width / 2},${y} Z`;

    const playTriangle = SVGHelper.createElement("path", {
      d: trianglePath,
      fill: "white",
    });
    playIconGroup.appendChild(playTriangle);

    group.appendChild(playIconGroup);
  }

  static _createFileIconWithBackground(group, centerX, centerY, groupColor) {
    const outerCircleGroup = SVGHelper.createElement("g", {
      filter: "url(#play-button-outer-filter)",
    });

    const mainCircle = SVGHelper.createElement("ellipse", {
      cx: centerX,
      cy: centerY,
      rx: CONFIG.PLAY_BUTTON.RADIUS,
      ry: CONFIG.PLAY_BUTTON.RADIUS - 1,
      fill: groupColor,
      opacity: 0.95,
    });
    outerCircleGroup.appendChild(mainCircle);

    const strokeCircle = SVGHelper.createElement("ellipse", {
      cx: centerX,
      cy: centerY,
      rx: CONFIG.PLAY_BUTTON.RADIUS,
      ry: CONFIG.PLAY_BUTTON.RADIUS,
      fill: "none",
      stroke: "white",
      "stroke-opacity": "0.9",
      "stroke-width": "4",
    });
    outerCircleGroup.appendChild(strokeCircle);

    group.appendChild(outerCircleGroup);

    this._createFileIcon(group, centerX, centerY, groupColor);
  }

  static _createFileIcon(group, centerX, centerY, groupColor = "#8F360B") {
    const iconWidth = 32;
    const iconHeight = 28;
    const x = centerX - iconWidth / 2;
    const y = centerY - iconHeight / 2;

    const iconGroup = SVGHelper.createElement("g", {
      transform: `translate(${x}, ${y})`,
    });

    const pdfBox = SVGHelper.createElement("rect", {
      x: "11.4277",
      y: "13.7109",
      width: "20.5714",
      height: "10.2845",
      rx: "1.14279",
      fill: "white",
    });
    iconGroup.appendChild(pdfBox);

    const docPath = SVGHelper.createElement("path", {
      d: "M10.2855 21.7114H6.85687L6.85687 3.42563H13.7141L13.7141 8.56851C13.7154 9.02275 13.8965 9.458 14.2177 9.7792C14.5389 10.1004 14.9741 10.2815 15.4283 10.2828H20.5712L20.5712 12.5685H22.2855L22.2855 8.56851C22.2886 8.45586 22.2671 8.3439 22.2227 8.24032C22.1784 8.13674 22.112 8.04401 22.0284 7.96851L16.0284 1.96848C15.9532 1.88436 15.8606 1.81774 15.7569 1.77331C15.6532 1.72888 15.5411 1.70773 15.4283 1.71133H6.85687C6.40263 1.71269 5.96738 1.89374 5.64618 2.21494C5.32498 2.53613 5.14393 2.97138 5.14258 3.42563L5.14258 21.7114C5.14393 22.1657 5.32498 22.6009 5.64618 22.9221C5.96738 23.2433 6.40263 23.4244 6.85687 23.4257H10.2855L10.2855 21.7114ZM15.4283 3.76849L20.2284 8.56851H15.4283L15.4283 3.76849Z",
      fill: "white",
    });
    iconGroup.appendChild(docPath);

    const pdfText = SVGHelper.createElement("path", {
      d: "M14.2689 22.5625L14.2689 16.1878H16.7839C17.2674 16.1878 17.6793 16.2802 18.0196 16.4648C18.3599 16.6475 18.6193 16.9017 18.7978 17.2274C18.9783 17.5512 19.0686 17.9247 19.0686 18.348C19.0686 18.7713 18.9773 19.1448 18.7947 19.4685C18.6121 19.7923 18.3475 20.0444 18.0009 20.2249C17.6565 20.4054 17.2394 20.4957 16.7497 20.4957H15.1467L15.1467 19.4156H16.5318C16.7912 19.4156 17.0049 19.371 17.173 19.2818C17.3431 19.1905 17.4697 19.0649 17.5527 18.9052C17.6378 18.7433 17.6803 18.5576 17.6803 18.348C17.6803 18.1363 17.6378 17.9517 17.5527 17.7939C17.4697 17.6342 17.3431 17.5107 17.173 17.4235C17.0028 17.3343 16.787 17.2897 16.5256 17.2897H15.6167L15.6167 22.5625H14.2689ZM21.9408 22.5625H19.681L19.681 16.1878H21.9595C22.6007 16.1878 23.1527 16.3154 23.6154 16.5707C24.0782 16.8238 24.434 17.188 24.6831 17.6632C24.9341 18.1384 25.0597 18.707 25.0597 19.3689C25.0597 20.033 24.9341 20.6036 24.6831 21.0809C24.434 21.5582 24.0761 21.9244 23.6092 22.1796C23.1444 22.4349 22.5882 22.5625 21.9408 22.5625ZM21.0288 21.4077H21.8848C22.2832 21.4077 22.6183 21.3372 22.8902 21.1961C23.1641 21.0529 23.3695 20.8319 23.5065 20.5331C23.6455 20.2322 23.715 19.8441 23.715 19.3689C23.715 18.8979 23.6455 18.513 23.5065 18.2141C23.3695 17.9153 23.1651 17.6954 22.8933 17.5543C22.6215 17.4132 22.2863 17.3426 21.8879 17.3426H21.0288L21.0288 21.4077ZM25.7951 22.5625L25.7951 16.1878H30.0158L30.0158 17.299H27.1429L27.1429 18.818H29.7357L29.7357 19.9292H27.1429L27.1429 22.5625H25.7951Z",
      fill: groupColor,
    });
    iconGroup.appendChild(pdfText);

    group.appendChild(iconGroup);
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
        "stroke-width": "8",
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
        "paint-order": "stroke fill",
        "font-size": "30",
        "font-weight": "bold",
        "pointer-events": "none",
        filter: "url(#text-shadow-filter)",
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

    this._initializeCompletedPieces();
  }

  _createSVG() {
    return SVGHelper.createElement("svg", {
      viewBox: CONFIG.SVG.VIEWBOX,
      fill: "none",
    });
  }

  _setupDefs() {
    const defs = SVGHelper.createElement("defs");

    GRADIENTS.forEach((grad) => {
      defs.appendChild(SVGHelper.createGradient(grad));
    });

    defs.appendChild(FilterFactory.createCompletedFilter());
    defs.appendChild(FilterFactory.createInnerShadowFilter());
    defs.appendChild(FilterFactory.createHoverShadowFilter());
    defs.appendChild(FilterFactory.createGaugeFillFilter());

    FilterFactory.createPlayButtonFilters().forEach((filter) => {
      defs.appendChild(filter);
    });

    defs.appendChild(FilterFactory.createTextShadowFilter());

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
          CONFIG.IMAGE_PATHS[CONFIG.COMPLETION_MODE].ACTIVE,
          false
        )
      );

      defs.appendChild(
        SVGHelper.createPattern(
          `bg-image-all-completed-${piece.id}`,
          CONFIG.IMAGE_PATHS[CONFIG.COMPLETION_MODE].ALL_COMPLETED,
          false
        )
      );

      defs.appendChild(
        SVGHelper.createPattern(
          `bg-image-finish-${piece.id}`,
          CONFIG.IMAGE_PATHS[CONFIG.COMPLETION_MODE].COMPLETED,
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

    // 완료된 퍼즐의 게이지를 100%로 업데이트
    this.updateGauge(pieceId, 100);

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
    this._showCompletionAnimation();

    setTimeout(() => {
      this._showRibbonAnimation();
    }, 500);

    setTimeout(() => {
      this.boardElement.classList.add("all-completed");
    }, 3100);

    this._showCelebration();
  }

  async _showRibbonAnimation() {
    const piece2 = this.pieces.find((p) => p.data.id === 2);
    if (!piece2) return;

    const piece2Group = piece2.group;
    const piece2Bbox = piece2Group.getBBox();
    const boardRect = this.boardElement.getBoundingClientRect();
    const svgRect = this.svg.getBoundingClientRect();

    const piece2CenterX = piece2Bbox.x + piece2Bbox.width / 2.1;
    const piece2BottomY = piece2Bbox.y + piece2Bbox.height / 2.2;

    const ribbonOriginalWidth = 377;
    const ribbonOriginalHeight = 336;
    const ribbonAspectRatio = ribbonOriginalWidth / ribbonOriginalHeight;
    const ribbonWidthInSVG = piece2Bbox.width * 0.9;
    const ribbonHeightInSVG = ribbonWidthInSVG / ribbonAspectRatio;

    try {
      const response = await fetch("./assets/images/onboarding/img_ribbon.svg");
      const svgText = await response.text();

      const ribbonContainer = document.createElement("div");
      ribbonContainer.className = "ribbon-animation-container";
      ribbonContainer.style.cssText = `
      position: fixed;
      top: ${svgRect.top}px;
      left: ${svgRect.left}px;
      width: ${svgRect.width}px;
      height: ${svgRect.height}px;
      pointer-events: none;
      z-index: 10000;
      overflow: visible;
    `;

      const svg = document.createElementNS(CONFIG.SVG.NAMESPACE, "svg");
      svg.setAttribute("viewBox", CONFIG.SVG.VIEWBOX);
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.cssText = `overflow: visible;`;

      const ribbonGroup = document.createElementNS(CONFIG.SVG.NAMESPACE, "g");
      const ribbonScale = ribbonWidthInSVG / ribbonOriginalWidth;

      ribbonGroup.setAttribute(
        "transform",
        `translate(${piece2CenterX - ribbonWidthInSVG / 2}, ${piece2BottomY - ribbonHeightInSVG / 2}) scale(${ribbonScale})`
      );

      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
      const ribbonSvg = svgDoc.documentElement;

      Array.from(ribbonSvg.children).forEach((child) => {
        const importedNode = document.importNode(child, true);
        ribbonGroup.appendChild(importedNode);
      });

      svg.appendChild(ribbonGroup);
      ribbonContainer.appendChild(svg);
      document.body.appendChild(ribbonContainer);

      const circles = ribbonGroup.querySelectorAll("circle");
      circles.forEach((circle) => {
        circle.style.opacity = "0";
        circle.style.transition = "opacity 0.8s ease";
        circle.style.mixBlendMode = "overlay";
        setTimeout(() => {
          circle.style.opacity = "1";
        }, 100);
      });

      const pathGroups = ribbonGroup.querySelectorAll("g[filter]");

      pathGroups.forEach((pathGroup, index) => {
        const startY = -300 - Math.random() * 200;
        const delay = index * 100 + Math.random() * 100;
        const duration = 800 + Math.random() * 400;

        pathGroup.style.opacity = "0";
        pathGroup.style.transform = `translateY(${startY}px)`;
        pathGroup.style.transition = `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
        pathGroup.style.transitionDelay = `${delay}ms`;

        setTimeout(() => {
          pathGroup.style.opacity = "1";
          pathGroup.style.transform = `translateY(0)`;
        }, 50);
      });

      setTimeout(() => {
        ribbonContainer.style.transition = "opacity 0.5s ease";
        ribbonContainer.style.opacity = "0";
      }, 2500);

      setTimeout(() => {
        ribbonContainer.remove();
      }, 3000);
    } catch (error) {
      console.error("리본 SVG 로드 실패:", error);
    }
  }

  _showCompletionAnimation() {
    const boardRect = this.boardElement.getBoundingClientRect();

    const animationContainer = document.createElement("div");
    animationContainer.className = "completion-animation-container";
    animationContainer.style.cssText = `
    position: fixed;
    top: ${boardRect.top}px;
    left: ${boardRect.left}px;
    width: ${boardRect.width}px;
    height: ${boardRect.height}px;
    pointer-events: none;
    z-index: 9999;
    opacity: 0;
    transition: opacity 1s ease;
  `;

    const svg = SVGHelper.createElement("svg", {
      viewBox: CONFIG.SVG.VIEWBOX,
      style: `
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 23.2px rgba(251, 255, 0, 0.80));
    `,
    });

    const defs = SVGHelper.createElement("defs");
    const completedPattern = SVGHelper.createPattern(
      "completion-animation-pattern",
      CONFIG.IMAGE_PATHS[CONFIG.COMPLETION_MODE].ALL_COMPLETED,
      false
    );
    defs.appendChild(completedPattern);
    defs.appendChild(FilterFactory.createInnerShadowFilter());
    defs.appendChild(FilterFactory.createCompletedFilter());
    svg.appendChild(defs);

    const boardGroup = SVGHelper.createElement("g");

    PUZZLE_PIECES.forEach((piece) => {
      const path = SVGHelper.createElement("path", {
        d: piece.path,
        fill: "url(#completion-animation-pattern)",
        stroke: "#333",
        "stroke-width": "2",
        filter: `url(#${CONFIG.FILTER_IDS.INNER_SHADOW}) url(#${CONFIG.FILTER_IDS.COMPLETED})`,
      });
      boardGroup.appendChild(path);
    });

    svg.appendChild(boardGroup);
    animationContainer.appendChild(svg);
    document.body.appendChild(animationContainer);

    setTimeout(() => {
      animationContainer.style.opacity = "1";
    }, 100);

    setTimeout(() => {
      animationContainer.style.opacity = "0";
    }, 3000);

    setTimeout(() => {
      animationContainer.remove();

      this.pieces.forEach((piece) => {
        piece.showAllCompleted();
      });
    }, 3100);
  }

  _showCelebration() {
    const pageTitle = document.querySelector(".page-title");
    if (!pageTitle) return;

    const p = pageTitle.querySelector("p");
    const emText = pageTitle.querySelector("h3 em")?.textContent;

    if (CONFIG.COMPLETION_MODE === "FINISH") {
      pageTitle.querySelector("h3").innerHTML = `
    <em>온보딩 필수 콘텐츠</em> 시청을 완료하셨습니다.
  `;
      if (p) {
        p.classList.add("fw-b");
        p.innerHTML = `
    필요할 땐 <em>언제든</em> 다시 볼 수 있어요.
  `;
      }
    } else {
      pageTitle.querySelector("h3").innerHTML = `
    <span><em>${emText}</em>님,</span> 수고하셨습니다.
  `;

      if (p) {
        p.innerHTML = `
    <em>온보딩 필수 콘텐츠 </em> 시청을 완료하셨습니다.
  `;
      }
    }
  }

  initializeWithCompletedPieces(completedPieceIds) {
    completedPieceIds.forEach((pieceId) => {
      const piece = this.pieces.find((p) => p.data.id === pieceId);
      if (piece) {
        piece.markComplete();
        this.completedCount++;
        // 완료된 퍼즐의 게이지를 100%로 업데이트
        this.updateGauge(pieceId, 100);
      }
    });
    this._updateProgress();
  }

  _initializeCompletedPieces() {
    const completedPieces = [];
    PUZZLE_PIECES.forEach((puzzlePiece) => {
      const content = this.contentManager.getContent(puzzlePiece.id);
      if (content?.completed === true) {
        completedPieces.push(puzzlePiece.id);
      }
    });

    if (completedPieces.length > 0) {
      this.initializeWithCompletedPieces(completedPieces);

      if (this.completedCount === PUZZLE_PIECES.length) {
        this.boardElement.classList.add("all-completed");

        this.pieces.forEach((piece) => {
          piece.showAllCompleted();
        });
      }
    }
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
