// ============================================================================
// 퍼즐 온보딩 시스템 (챕터 기반)
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
    INNER_SHADOW: "inner-shadow-effect",
    HOVER_SHADOW: "hover-shadow-effect",
    PIECE_EMBOSSING: "piece-embossing-effect",     
  },

  GRADIENT_IDS: {
    BOARD_1: "board_fill_1",
    BOARD_2: "board_fill_2",
    BOARD_3: "board_fill_3",
    BOARD_4: "board_fill_4",
  },

  IMAGE_PATHS: {
    BASE: "./assets/images/onboarding/bg_piece.jpg",
    COMPLETED: {
      ACTIVE: "./assets/images/onboarding/bg_piece_completed.png",
      COMPLETED: "./assets/images/onboarding/bg_piece_finish.png",
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
    VERTICAL_OFFSET: -10,
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
    // 바로세운_퍼즐판.svg line 14
    path: "M256.658 780V651.625H22V523H709V780H256.658Z",
  },
  {
    id: 2,
    title: "새로운 시대 준비된 우리",
    // 바로세운_퍼즐판.svg line 16
    path: "M709 11H1162L1161.99 268H709V11Z",
  },
  {
    id: 3,
    title: "기술개발센터소개",
    // 바로세운_퍼즐판.svg line 17
    path: "M1162 11H1615L1614.99 268H1162V11Z",
  },
  {
    id: 4,
    title: "건설산업의 디지털 전환을",
    // 바로세운_퍼즐판.svg line 19
    path: "M1162 268H1615L1614.99 523H1162V268Z",
  },
  {
    id: 5,
    title: "상용 S/W 소개",
    // 바로세운_퍼즐판.svg line 18
    path: "M709 268H1162L1161.99 523H709V268Z",
  },
  {
    id: 6,
    title: "축적의 시간",
    // 바로세운_퍼즐판.svg line 21
    path: "M709 523H1162L1161.99 780H709V523Z",
  },
  {
    id: 7,
    title: "회사생활 (경력)",
    // 바로세운_퍼즐판.svg line 22
    path: "M1162 523H1615L1614.99 780H1162V523Z",
  },
  {
    id: 8,
    title: "회사생활 (신규입사자편)",
    // 바로세운_퍼즐판.svg line 20
    path: "M1615 268H1853L1852.99 617H1615V268Z",
  },
  {
    id: 9,
    title: "한맥가족 소개 및 경영이념",
    // 바로세운_퍼즐판.svg line 23
    path: "M256 11V267H330V523H709V11H256Z",
  },
  {
    id: 10,
    title: "삼안 소개",
    // 바로세운_퍼즐판.svg line 15
    path: "M330 267H22L22.4984 523H330V267Z",
  },
];

// PUZZLE_PIECES 정의 바로 아래에 추가
const BOUNDARY_LINES = [
  // 수직 경계선들 (세로)
  { x1: 709, y1: 11, x2: 709, y2: 780, label: "vertical-709" },
  { x1: 1162, y1: 11, x2: 1162, y2: 780, label: "vertical-1162" },
  { x1: 1615, y1: 268, x2: 1615, y2: 617, label: "vertical-1615" },
  { x1: 330, y1: 267, x2: 330, y2: 523, label: "vertical-330" },
  { x1: 256, y1: 11, x2: 256, y2: 267, label: "vertical-256-top" },
  
  // 수평 경계선들 (가로)
  { x1: 709, y1: 268, x2: 1615, y2: 268, label: "horizontal-268" },
  { x1: 22, y1: 523, x2: 1615, y2: 523, label: "horizontal-523" },
  { x1: 256, y1: 267, x2: 330, y2: 267, label: "horizontal-267" },
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
    x1: "69.54%",
    y1: "3.97%",
    x2: "30.46%",
    y2: "96.03%",
    stops: [
      { offset: "14.97%", color: "#8E2F00" },
      { offset: "89.98%", color: "#662A0D" },
    ],
  },
  {
    id: CONFIG.GRADIENT_IDS.BOARD_2,
    x1: "69.54%",
    y1: "3.97%",
    x2: "30.46%",
    y2: "96.03%",
    stops: [
      { offset: "14.97%", color: "#2A5338" },
      { offset: "89.98%", color: "#306843" },
    ],
  },
  {
    id: CONFIG.GRADIENT_IDS.BOARD_3,
    x1: "69.54%",
    y1: "3.97%",
    x2: "30.46%",
    y2: "96.03%",
    stops: [
      { offset: "14.97%", color: "#5B4822" },
      { offset: "89.98%", color: "#795711" },
    ],
  },
  {
    id: CONFIG.GRADIENT_IDS.BOARD_4,
    x1: "69.54%",
    y1: "3.97%",
    x2: "30.46%",
    y2: "96.03%",
    stops: [
      { offset: "14.97%", color: "#1D375D" },
      { offset: "89.98%", color: "#385888" },
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

// 초기 타이틀은 PUZZLE_PIECES에서 가져오고, 챕터 데이터로 업데이트됨
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
  MAX_LENGTHS: {
    1: 453,
    2: 452.842,
    3: 452.84,
    4: 452.84,
    5: 452.842,
    6: 452.842,
    7: 452.84,
    8: 237.92,
    9: 378.398,
    10: 309,
  },
};

// ============================================================================
// 챕터 관리 클래스
// ============================================================================
class ChapterManager {
  constructor(chapterData, dependencies = {}) {
    this.chapters = chapterData || [];
    
    // 의존성 주입 (폴백 포함)
    this.errorHandler = dependencies.errorHandler || (typeof ErrorHandler !== 'undefined' ? ErrorHandler : null);
    this.utils = dependencies.utils || (typeof Utils !== 'undefined' ? Utils : null);
    
    console.log('[ChapterManager] 초기화:', this.chapters);
    
    try {
      this._validateAndInitialize();
    } catch (error) {
      this._handleError(error, 'ChapterManager.constructor');
    }
  }

  _validateAndInitialize() {
    try {
      this.chapters.forEach((chapter, index) => {
        if (!chapter.lessons || !Array.isArray(chapter.lessons)) {
          chapter.lessons = [];
        }
        
        // completed 속성 초기화
        if (chapter.completed === undefined) {
          chapter.completed = false;
        }
        
        chapter.lessons.forEach((lesson) => {
          if (lesson.completed === undefined) {
            lesson.completed = false;
          }
        });
        
        console.log(`[ChapterManager] 챕터 ${index}: ${chapter.name}, pieceId: ${chapter.pieceId}, lessons: ${chapter.lessons.length}`);
      });
    } catch (error) {
      this._handleError(error, 'ChapterManager._validateAndInitialize');
    }
  }

  /**
   * 에러 처리 헬퍼
   * @private
   */
  _handleError(error, context, additionalInfo = {}) {
    if (this.errorHandler) {
      this.errorHandler.handle(error, {
        context,
        component: 'ChapterManager',
        ...additionalInfo
      }, false);
    } else {
      console.error(`[ChapterManager] ${context}:`, error, additionalInfo);
    }
  }

  /**
   * 챕터 가져오기
   */
  getChapter(chapterIndex) {
    return this.chapters[chapterIndex];
  }

  /**
   * pieceId로 챕터 찾기
   */
  getChapterByPieceId(pieceId) {
    const chapterIndex = this.chapters.findIndex(
      (chapter) => chapter.pieceId === pieceId
    );
    if (chapterIndex === -1) return null;

    return {
      chapterIndex,
      chapter: this.chapters[chapterIndex],
    };
  }

  /**
   * 챕터의 진행률 계산 (completed 기반)
   */
  getChapterProgress(chapterIndex) {
    const chapter = this.chapters[chapterIndex];
    if (!chapter || !chapter.lessons || chapter.lessons.length === 0) {
      return 0;
    }

    const completedCount = chapter.lessons.filter(
      (lesson) => lesson.completed
    ).length;
    const totalCount = chapter.lessons.length;

    return Math.round((completedCount / totalCount) * 100);
  }

  /**
   * 전체 진행률 계산
   */
  getTotalProgress() {
    let totalLessons = 0;
    let completedLessons = 0;

    this.chapters.forEach((chapter) => {
      if (chapter.lessons && chapter.lessons.length > 0) {
        totalLessons += chapter.lessons.length;
        completedLessons += chapter.lessons.filter(
          (lesson) => lesson.completed
        ).length;
      }
    });

    if (totalLessons === 0) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
  }

  /**
   * 학습 완료 처리
   */
  completeLesson(chapterIndex, lessonIndex) {
    try {
      const chapter = this.chapters[chapterIndex];
      if (!chapter || !chapter.lessons || !chapter.lessons[lessonIndex]) {
        const error = new Error(`Invalid chapter or lesson index: [${chapterIndex}-${lessonIndex}]`);
        this._handleError(error, 'ChapterManager.completeLesson', { chapterIndex, lessonIndex });
        return;
      }

      const lesson = chapter.lessons[lessonIndex];
      
      // 이미 완료된 학습이면 처리하지 않음
      if (lesson.completed) {
        console.log(
          `[ChapterManager] 이미 완료된 학습: [${chapterIndex}-${lessonIndex}] ${lesson.label}`
        );
        return;
      }

      lesson.completed = true;
      console.log(
        `[ChapterManager] 학습 완료: [${chapterIndex}-${lessonIndex}] ${lesson.label}`
      );

      // 챕터의 모든 학습이 완료되었는지 확인
      const allCompleted = chapter.lessons.every((l) => l.completed);
      if (allCompleted && !chapter.completed) {
        chapter.completed = true;
        console.log(
          `[ChapterManager] 챕터 완료: [${chapterIndex}] ${chapter.name}`
        );
      }
    } catch (error) {
      this._handleError(error, 'ChapterManager.completeLesson', { chapterIndex, lessonIndex });
    }
  }

  /**
   * 챕터가 완료되었는지 확인
   */
  isChapterCompleted(chapterIndex) {
    const chapter = this.chapters[chapterIndex];
    if (!chapter) return false;
    return chapter.completed === true;
  }

  /**
   * 모든 챕터가 완료되었는지 확인
   */
  isAllCompleted() {
    return this.chapters.every((chapter) => chapter.completed === true);
  }

  /**
   * 챕터 데이터 가져오기
   */
  getChapterData(chapterIndex) {
    return this.chapters[chapterIndex];
  }

  /**
   * 전체 챕터 수
   */
  getTotalChapters() {
    return this.chapters.length;
  }
}

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
    const attributes = {
      id: gradientData.id,
    };

    // 그라데이션 방향 설정
    if (gradientData.x1) attributes.x1 = gradientData.x1;
    if (gradientData.y1) attributes.y1 = gradientData.y1;
    if (gradientData.x2) attributes.x2 = gradientData.x2;
    if (gradientData.y2) attributes.y2 = gradientData.y2;

    const gradient = this.createElement("linearGradient", attributes);

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

    // box-shadow: -14px -11px 4px 0 rgba(0, 0, 0, 0.25) inset (어두운 이너 쉐도우 - 좌상단)
    this._addInnerShadow(
      filter,
      -14,
      -11,
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0",
      "shape",
      "effect1_innerShadow",
      4 // blur: 4px
    );

    // box-shadow: 11px 6px 4px 0 rgba(255, 255, 255, 0.25) inset (밝은 이너 쉐도우 - 우하단)
    this._addInnerShadow(
      filter,
      11,
      6,
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
      "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0",
      "effect1_innerShadow",
      "effect2_innerShadow",
      4 // blur: 4px
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
    resultName,
    blur = 4
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
    // blur 값에 맞게 stdDeviation 설정 (blur / 2)
    filter.appendChild(
      SVGHelper.createElement("feGaussianBlur", { stdDeviation: String(blur / 2) })
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

     // 배경 이미지 고정
    filter.appendChild(
      SVGHelper.createElement("feFlood", {
        "flood-opacity": "0",
        result: "BackgroundImageFix",
      })
    );

     // 원본 모양 유지
    filter.appendChild(
      SVGHelper.createElement("feBlend", {
        mode: "normal",
        in: "SourceGraphic",
        in2: "BackgroundImageFix",
        result: "shape",
      })
    );


    // Alpha 채널 추출
    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        in: "SourceAlpha",
        type: "matrix",
        values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
        result: "hardAlpha",
      })
    );

    filter.appendChild(SVGHelper.createElement("feOffset", { dy: "-4" }));

    // 블러 (6px)
    filter.appendChild(
      SVGHelper.createElement("feGaussianBlur", {
        stdDeviation: "3",
      })
    );

    // 내부 그림자 처리
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
        values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0",
        result: "innerShadow",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        in: "SourceAlpha",
        type: "matrix",
        values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
        result: "dropShadowAlpha",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feOffset", {
        dx: "0",
        dy: "4",
        in: "dropShadowAlpha",
        result: "dropShadowOffset",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feGaussianBlur", {
        stdDeviation: "2",
        in: "dropShadowOffset",
        result: "dropShadowBlur",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        type: "matrix",
        values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0",
        in: "dropShadowBlur",
        result: "dropShadow",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feBlend", {
        mode: "normal",
        in: "innerShadow",
        in2: "dropShadow",
        result: "combinedShadow",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feBlend", {
        mode: "normal",
        in: "shape",
        in2: "combinedShadow",
        result: "final",
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

  static createBoardFilter() {
    const filter = SVGHelper.createElement("filter", {
      id: "board-3d-effect",
      x: "-10%",
      y: "-10%",
      width: "120%",
      height: "120%",
      filterUnits: "userSpaceOnUse",
      "color-interpolation-filters": "sRGB",
    });

    // Drop shadow (외부 그림자)
    filter.appendChild(
      SVGHelper.createElement("feFlood", {
        "flood-opacity": "0",
        result: "BackgroundImageFix",
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
        dy: "4",
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
        operator: "out",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        type: "matrix",
        values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feBlend", {
        mode: "normal",
        in2: "BackgroundImageFix",
        result: "effect1_dropShadow",
      })
    );

    // Shape (원본 모양 유지)
    filter.appendChild(
      SVGHelper.createElement("feBlend", {
        mode: "normal",
        in: "SourceGraphic",
        in2: "effect1_dropShadow",
        result: "shape",
      })
    );

    // Inner shadow (내부 그림자 - 상단)
    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        in: "SourceAlpha",
        type: "matrix",
        values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
        result: "hardAlpha2",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feOffset", {
        dy: "-4",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feComposite", {
        in2: "hardAlpha2",
        operator: "arithmetic",
        k2: "-1",
        k3: "1",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        type: "matrix",
        values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feBlend", {
        mode: "normal",
        in2: "shape",
        result: "effect2_innerShadow",
      })
    );

    return filter;
  }


  /**
   * 퍼즐 조각 엠보싱 효과 필터 생성
   * box-shadow: 13px 12px 6px 0 rgba(254, 227, 179, 0.80) inset,
   *             -11px -11px 5px 0 rgba(0, 0, 0, 0.40) inset
   * filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.80))
   */
  static createPieceEmbossingFilter() {
    const filter = SVGHelper.createElement("filter", {
      id: "piece-embossing-effect",
      x: "-50%",
      y: "-50%",
      width: "200%",
      height: "200%",
      filterUnits: "userSpaceOnUse",
      "color-interpolation-filters": "sRGB",
    });

    // 배경 이미지 고정
    filter.appendChild(
      SVGHelper.createElement("feFlood", {
        "flood-opacity": "0",
        result: "BackgroundImageFix",
      })
    );

    // 원본 모양 유지
    filter.appendChild(
      SVGHelper.createElement("feBlend", {
        mode: "normal",
        in: "SourceGraphic",
        in2: "BackgroundImageFix",
        result: "shape",
      })
    );

    // ========================================
    // Inner Shadow 1: 우하단 밝은 그림자
    // 13px 12px 6px rgba(254, 227, 179, 0.80)
    // ========================================
    
    // Alpha 채널 추출
    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        in: "SourceAlpha",
        type: "matrix",
        values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
        result: "hardAlpha1",
      })
    );

    // 오프셋 (13px, 12px)
    filter.appendChild(
      SVGHelper.createElement("feOffset", {
        dx: "13",
        dy: "12",
      })
    );

    // 블러 (6px)
    filter.appendChild(
      SVGHelper.createElement("feGaussianBlur", {
        stdDeviation: "2", // 6px / 2
      })
    );

    // 내부 그림자 처리
    filter.appendChild(
      SVGHelper.createElement("feComposite", {
        in2: "hardAlpha1",
        operator: "arithmetic",
        k2: "-1",
        k3: "1",
      })
    );

    // 색상 적용: rgba(254, 227, 179, 0.80)
    // R: 254/255 = 0.996, G: 227/255 = 0.890, B: 179/255 = 0.702, A: 0.80
    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        type: "matrix",
        values: "0 0 0 0 0.996 0 0 0 0 0.890 0 0 0 0 0.702 0 0 0 0.80 0",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feBlend", {
        mode: "color-dodge",
        in2: "shape",
        result: "effect1_innerShadow",
      })
    );

    // ========================================
    // Inner Shadow 2: 좌상단 어두운 그림자
    // -11px -11px 5px rgba(0, 0, 0, 0.40)
    // ========================================
    
    // Alpha 채널 추출
    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        in: "SourceAlpha",
        type: "matrix",
        values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
        result: "hardAlpha2",
      })
    );

    // 오프셋 (-11px, -11px)
    filter.appendChild(
      SVGHelper.createElement("feOffset", {
        dx: "-11",
        dy: "-11",
      })
    );

    // 블러 (5px)
    filter.appendChild(
      SVGHelper.createElement("feGaussianBlur", {
        stdDeviation: "2.5", // 5px / 2
      })
    );

    // 내부 그림자 처리
    filter.appendChild(
      SVGHelper.createElement("feComposite", {
        in2: "hardAlpha2",
        operator: "arithmetic",
        k2: "-1",
        k3: "1",
      })
    );

    // 색상 적용: rgba(0, 0, 0, 0.40)
    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        type: "matrix",
        values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.60 0",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feBlend", {
        mode: "normal",
        in2: "effect1_innerShadow",
        result: "effect2_innerShadow",
      })
    );

    // ========================================
    // Drop Shadow: 외부 그림자
    // 1px 1px 2px rgba(0, 0, 0, 0.80)
    // ========================================
    
    // 외부 그림자용 Alpha
    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        in: "SourceAlpha",
        type: "matrix",
        values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
        result: "hardAlpha3",
      })
    );

    // 오프셋 (1px, 1px)
    filter.appendChild(
      SVGHelper.createElement("feOffset", {
        dx: "1",
        dy: "1",
      })
    );

    // 블러 (2px)
    filter.appendChild(
      SVGHelper.createElement("feGaussianBlur", {
        stdDeviation: "1", // 2px / 2
      })
    );

    // 외부 그림자 처리
    filter.appendChild(
      SVGHelper.createElement("feComposite", {
        in2: "hardAlpha3",
        operator: "out",
      })
    );

    // 색상 적용: rgba(0, 0, 0, 0.80)
    filter.appendChild(
      SVGHelper.createElement("feColorMatrix", {
        type: "matrix",
        values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.80 0",
      })
    );

    filter.appendChild(
      SVGHelper.createElement("feBlend", {
        mode: "normal",
        in2: "BackgroundImageFix",
        result: "effect3_dropShadow",
      })
    );

    // 최종 합성
    const merge = SVGHelper.createElement("feMerge");
    merge.appendChild(
      SVGHelper.createElement("feMergeNode", {
        in: "effect3_dropShadow",
      })
    );
    merge.appendChild(
      SVGHelper.createElement("feMergeNode", {
        in: "effect2_innerShadow",
      })
    );
    filter.appendChild(merge);

    return filter;
  }
}

// ============================================================================
// 콘텐츠 관리 클래스
// ============================================================================
class ContentManager {
  constructor(chapterManager) {
    this.chapterManager = chapterManager;
  }

  /**
   * pieceId로 챕터 정보 가져오기
   */
  getChapterByPieceId(pieceId) {
    return this.chapterManager.getChapterByPieceId(pieceId);
  }

  /**
   * 썸네일 URL 가져오기
   */
  getThumbnailUrl(pieceId) {
    const chapterInfo = this.getChapterByPieceId(pieceId);
    if (!chapterInfo || !chapterInfo.chapter.lessons || 
        chapterInfo.chapter.lessons.length === 0) {
      return CONFIG.IMAGE_PATHS.BASE;
    }

    const firstLesson = chapterInfo.chapter.lessons[0];
    if (!firstLesson.url) {
      return CONFIG.IMAGE_PATHS.BASE;
    }

    return `https://img.youtube.com/vi/${firstLesson.url}/maxresdefault.jpg`;
  }

  /**
   * 그룹 색상 가져오기
   */
  getGroupColor(pieceId) {
    const chapterInfo = this.getChapterByPieceId(pieceId);
    if (!chapterInfo) return CONFIG.GROUP_COLORS[1];

    const group = chapterInfo.chapter.group || 1;
    return CONFIG.GROUP_COLORS[group] || CONFIG.GROUP_COLORS[1];
  }

  /**
   * 타입 가져오기
   */
  getType(pieceId) {
    const chapterInfo = this.getChapterByPieceId(pieceId);
    if (!chapterInfo) return "youtube";
    
    return chapterInfo.chapter.type || "youtube";
  }
}

// ============================================================================
// 퍼즐 조각 클래스
// ============================================================================

class PuzzlePiece {
  constructor(pieceData, contentManager, chapterManager, dependencies = {}) {
    this.data = pieceData;
    this.contentManager = contentManager;
    this.chapterManager = chapterManager;
    this.group = null;
    this.isCompleted = false;

    // 의존성 주입 (폴백 포함)
    this.eventManager = dependencies.eventManager || (typeof eventManager !== 'undefined' ? eventManager : null);
    this.errorHandler = dependencies.errorHandler || (typeof ErrorHandler !== 'undefined' ? ErrorHandler : null);
    this.domUtils = dependencies.domUtils || (typeof DOMUtils !== 'undefined' ? DOMUtils : null);

    // 이벤트 리스너 ID 저장 (정리용)
    this.listenerIds = [];
  }

  createElement() {
    this.group = SVGHelper.createElement("g", {
      class: "puzzle-piece-group",
      "data-piece": this.data.id,
      "data-title": this.data.title,
    });

    const currentUrl = window.location.href.split("#")[0];

    // Base 이미지 - stroke: 1, 엠보싱: 없음
    this._createImageLayer(
      "piece-base-image",
      `bg-image-${this.data.id}`,
      currentUrl
    );
    
    // Hover 이미지 - stroke: 2, 엠보싱: 적용
    this._createImageLayer(
      "piece-hover-image",
      `bg-image-hover-${this.data.id}`,
      currentUrl,
      "0"
    );
    
    // Completed 이미지 - stroke: 2, 엠보싱: 적용
    this._createImageLayer(
      "piece-completed-image",
      `bg-image-completed-${this.data.id}`,
      currentUrl,
      "1.0",
      true
    );
    
    // All Completed 이미지 - stroke: 0, 엠보싱: 없음 (하나의 이미지처럼)
    this._createImageLayer(
      "piece-all-completed-image",
      `bg-image-all-completed-${this.data.id}`,
      currentUrl,
      "1.0",
      true
    );
    
    // Finish 이미지 - stroke: 2, 엠보싱: 적용
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

  /**
   * 이미지 레이어 생성 (최종 버전)
   * @private
   */
  _createImageLayer(
    className,
    patternId,
    baseUrl,
    opacity = "1.0",
    hidden = false
  ) {
    const strokeWidth = 
      className === "piece-base-image" ? "2" :
      className === "piece-all-completed-image" ? "0" :
      className === "piece-completed-image" ? "2" :
      className === "piece-finish-image" ? "2" : "2";
  
    // ✅ 모든 레이어에서 stroke 색상을 #333 (검은색)으로 통일
    const strokeColor = "#000";
  
    const flatLayers = ["piece-base-image", "piece-all-completed-image", "piece-hover-image"];
    const shouldApplyEmbossing = !flatLayers.includes(className);
  
    const attributes = {
      d: this.data.path,
      class: className,
      fill: `url(${baseUrl}#${patternId})`,
      "fill-opacity": opacity,
      stroke: strokeColor,  // ✅ 항상 검은색
      "stroke-width": strokeWidth,
      "stroke-linejoin": "round",
      "stroke-linecap": "round",
    };
  
    if (shouldApplyEmbossing) {
      // PIECE_EMBOSSING만 적용 (completed-effect 제거)
      attributes.filter = `url(#${CONFIG.FILTER_IDS.PIECE_EMBOSSING})`;
    }
  
    if (className === "piece-completed-image") {
      attributes["clip-path"] = `url(#clip-piece-${this.data.id})`;
    }
  
    const path = SVGHelper.createElement("path", attributes);
  
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
    try {
      if (!this.group) {
        console.warn('[PuzzlePiece] group 요소가 없어 이벤트 리스너를 등록할 수 없습니다.');
        return;
      }

      const mouseEnterHandler = () => {
        try {
          this._handleHover(true);
        } catch (error) {
          this._handleError(error, 'PuzzlePiece._handleHover.enter');
        }
      };

      const mouseLeaveHandler = () => {
        try {
          this._handleHover(false);
        } catch (error) {
          this._handleError(error, 'PuzzlePiece._handleHover.leave');
        }
      };

      const clickHandler = () => {
        try {
          this._handleClick();
        } catch (error) {
          this._handleError(error, 'PuzzlePiece._handleClick');
        }
      };

      if (this.eventManager) {
        const enterId = this.eventManager.on(this.group, "mouseenter", mouseEnterHandler);
        const leaveId = this.eventManager.on(this.group, "mouseleave", mouseLeaveHandler);
        const clickId = this.eventManager.on(this.group, "click", clickHandler);
        
        this.listenerIds.push(
          { element: this.group, id: enterId, type: 'mouseenter' },
          { element: this.group, id: leaveId, type: 'mouseleave' },
          { element: this.group, id: clickId, type: 'click' }
        );
      } else {
        this.group.addEventListener("mouseenter", mouseEnterHandler);
        this.group.addEventListener("mouseleave", mouseLeaveHandler);
        this.group.addEventListener("click", clickHandler);
      }
    } catch (error) {
      this._handleError(error, 'PuzzlePiece._attachEventListeners');
    }
  }

  /**
   * 에러 처리 헬퍼
   * @private
   */
  _handleError(error, context, additionalInfo = {}) {
    if (this.errorHandler) {
      this.errorHandler.handle(error, {
        context,
        component: 'PuzzlePiece',
        pieceId: this.data?.id,
        ...additionalInfo
      }, false);
    } else {
      console.error(`[PuzzlePiece] ${context}:`, error, additionalInfo);
    }
  }

  /**
   * 리소스 정리 (이벤트 리스너 제거)
   */
  destroy() {
    try {
      if (this.eventManager && this.listenerIds.length > 0) {
        this.listenerIds.forEach(({ element, id }) => {
          this.eventManager.off(element, id);
        });
        this.listenerIds = [];
      }
      this.group = null;
    } catch (error) {
      this._handleError(error, 'PuzzlePiece.destroy');
    }
  }

  _handleHover(isHovering) {
    this._toggleText(isHovering);

    const hoverImg = this.group.querySelector(".piece-hover-image");
    const overlayBase = this.group.querySelector(".piece-overlay-base");

    if (hoverImg) {
      hoverImg.setAttribute("fill-opacity", isHovering ? "1.0" : "0");
      // 호버 시 INNER_SHADOW 필터 적용
      if (isHovering) {
        hoverImg.setAttribute("filter", `url(#${CONFIG.FILTER_IDS.INNER_SHADOW})`);
      } else {
        hoverImg.setAttribute("filter", "");
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
    const chapterInfo = this.contentManager.getChapterByPieceId(this.data.id);
    if (!chapterInfo) {
      console.error(`챕터를 찾을 수 없습니다: pieceId=${this.data.id}`);
      return;
    }

    const chapter = chapterInfo.chapter;

    if (chapter.type === "file") {
      console.log(`[PuzzlePiece] file 타입: ${chapter.name}`);
      this._handleFileType(chapter, chapterInfo.chapterIndex);
      return;
    }

    PuzzleManager.instance.openChapterModal(
      chapterInfo.chapterIndex,
      chapterInfo.chapter
    );
  }

  _handleFileType(chapter, chapterIndex) {
    if (!chapter.lessons || chapter.lessons.length === 0) {
      console.warn('[PuzzlePiece] file 타입이지만 lessons가 없습니다');
      return;
    }

    const firstLesson = chapter.lessons[0];
    const fileUrl = firstLesson.url;

    if (!fileUrl) {
      console.warn('[PuzzlePiece] file URL이 없습니다');
      alert('파일 URL이 설정되지 않았습니다.');
      return;
    }

    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      console.log('[PuzzlePiece] 새창에서 파일 열기:', fileUrl);
      window.open(fileUrl, '_blank');
    } else {
      console.log('[PuzzlePiece] 파일 다운로드:', fileUrl);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = firstLesson.label || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    if (!firstLesson.completed) {
      console.log(`[PuzzlePiece] file 타입 학습 완료 처리: [${chapterIndex}-0] ${firstLesson.label}`);
      PuzzleManager.instance.chapterManager.completeLesson(chapterIndex, 0);
      PuzzleManager.instance.updatePieceGauge(chapter.pieceId);
      PuzzleManager.instance._updateTotalProgress();
    }
  }

  markComplete() {
    if (this.isCompleted) return;
  
    this.isCompleted = true;
    this.group.classList.add("completed");
  
    const baseImage = this.group.querySelector(".piece-base-image");
    const completedImage = this.group.querySelector(".piece-completed-image");
  
    // ✅ base 이미지를 완전히 숨기고 completed 이미지만 표시
    if (baseImage) {
      baseImage.style.display = "none";
    }
  
    if (completedImage) {
      completedImage.style.display = "block";
      // completed-effect 필터 완전히 제거하고 PIECE_EMBOSSING만 적용
      completedImage.removeAttribute("filter");
      completedImage.setAttribute(
        "filter",
        `url(#${CONFIG.FILTER_IDS.PIECE_EMBOSSING})`
      );
    }
  }
  
  // ✅ 새로운 메서드: Finish Image 표시 (최종 표시)
showFinish() {
  const baseImg = this.group.querySelector(".piece-base-image");
  const completedImg = this.group.querySelector(".piece-completed-image");
  const allCompletedImg = this.group.querySelector(".piece-all-completed-image");
  const finishImg = this.group.querySelector(".piece-finish-image");

  // 모든 이미지 숨기기
  if (baseImg) baseImg.style.display = "none";
  if (completedImg) completedImg.style.display = "none";
  if (allCompletedImg) allCompletedImg.style.display = "none";

  // ✅ FINISH 이미지 표시 (bg_piece_finish.png - COMPLETED 이미지)
  if (finishImg) {
    finishImg.style.display = "block";
  }
}
  // ❌ showAllCompleted는 이제 사용 안 함 (showFinish로 대체)
  showAllCompleted() {
    // 더 이상 사용하지 않음 - showFinish로 대체
    this.showFinish();
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

    // 초기 생성 시에는 EMBOSSING_INSET을 적용하지 않음 (전체 영역 사용)
    // 완료 시에는 updateGauge에서 EMBOSSING_INSET을 적용
    const EMBOSSING_INSET = 0; // 초기에는 0, 완료 시 updateGauge에서 조정

    // 게이지 너비 결정 (MAX_LENGTHS가 있으면 사용, 없으면 fullWidth 사용)
    let bgWidth = fullWidth;
    if (GAUGE_CONFIG.MAX_LENGTHS && GAUGE_CONFIG.MAX_LENGTHS[pieceId]) {
      bgWidth = GAUGE_CONFIG.MAX_LENGTHS[pieceId];
    }

    // 1번 피스는 하단 영역 안쪽 중앙에 배치
    let centerX;
    if (pieceId === 1) {
      // 하단 영역: 256부터 right까지의 영역의 중앙
      const bottomAreaLeft = 256;
      const bottomAreaRight = xRange.right;
      centerX = (bottomAreaLeft + bottomAreaRight) / 2;
    } else {
      // 다른 피스는 전체 xRange의 중앙
      centerX = (xRange.left + xRange.right) / 2;
    }
    
    // 중앙 정렬: centerX에서 bgWidth의 절반을 빼서 시작점 계산
    let gaugeX = centerX - (bgWidth / 2);

    // strokeRadius 고려하여 최소 여백 확보
    const strokeRadius = CONFIG.GAUGE.HEIGHT / 2;
    const minMargin = strokeRadius;
    
    // 왼쪽 경계 확인 및 조정
    if (gaugeX < xRange.left + minMargin) {
      gaugeX = xRange.left + minMargin;
      // 오른쪽 경계도 확인하여 너비 조정
      const maxEndX = xRange.right - minMargin;
      bgWidth = Math.min(bgWidth, maxEndX - gaugeX);
    }
    
    // 오른쪽 경계 확인 및 조정
    const calculatedEndX = gaugeX + bgWidth;
    const maxEndX = xRange.right - minMargin;
    if (calculatedEndX > maxEndX) {
      bgWidth = maxEndX - gaugeX;
      // 너비가 줄어들었으므로 다시 중앙 정렬
      gaugeX = centerX - (bgWidth / 2);
      // 다시 왼쪽 경계 확인
      if (gaugeX < xRange.left + minMargin) {
        gaugeX = xRange.left + minMargin;
        bgWidth = maxEndX - gaugeX;
      }
    }

    let fillWidth = bgWidth;

    const bgLine = SVGHelper.createElement("line", {
      x1: gaugeX,
      y1: gaugeY + CONFIG.GAUGE.HEIGHT / 2,
      x2: gaugeX + bgWidth,
      y2: gaugeY + CONFIG.GAUGE.HEIGHT / 2,
      stroke: CONFIG.GAUGE.BG_COLOR,
      "stroke-width": CONFIG.GAUGE.HEIGHT,
      "stroke-linecap": "round",
      opacity: 0, // 초기에는 학습 내용이 없으므로 opacity 0
      class: "gauge-bg-line",
      "data-original-x1": gaugeX, // 원본 좌표 저장
      "data-original-x2": gaugeX + bgWidth, // 원본 좌표 저장
      "data-original-opacity": CONFIG.GAUGE.BG_OPACITY, // 원본 opacity 저장
    });
    bgLine.style.mixBlendMode = "multiply";
    gaugeGroup.appendChild(bgLine);

    const fillLine = SVGHelper.createElement("rect", {
      x: gaugeX,
      y: gaugeY,
      width: 0,
      height: CONFIG.GAUGE.HEIGHT,
      rx: CONFIG.GAUGE.RADIUS,
      fill: CONFIG.GAUGE.FILL_COLOR,
      class: "gauge-fill-line",
      filter: "url(#gauge-fill-inner-shadow)",
      "data-gauge-length": Math.round(fillWidth), // 반올림하여 정수로 저장
      "data-original-x1": gaugeX, // 원본 시작점 저장
    });

    fillLine.style.transition = "width 0.6s ease-out";

    gaugeGroup.appendChild(fillLine);
    svg.appendChild(gaugeGroup);
  }

  static updateGauge(pieceId, progress, isCompleted = false) {
    progress = Math.max(0, Math.min(100, progress));

    const fillLine = document.querySelector(
      `.piece-gauge-${pieceId} .gauge-fill-line`
    );
    const bgLine = document.querySelector(
      `.piece-gauge-${pieceId} .gauge-bg-line`
    );

    if (!fillLine) return;

    // 원본 길이 가져오기
    let originalLength = parseFloat(fillLine.getAttribute("data-original-length"));
    if (!originalLength || isNaN(originalLength)) {
      originalLength = parseFloat(fillLine.getAttribute("data-gauge-length"));
      fillLine.setAttribute("data-original-length", originalLength);
    }

    // 완료 시에만 EMBOSSING_INSET 적용
    const EMBOSSING_INSET = isCompleted ? 8 : 0;
    const adjustedLength = originalLength - (EMBOSSING_INSET * 2);

    // 원본 시작점 가져오기
    let originalX1 = parseFloat(fillLine.getAttribute("data-original-x1"));
    if (!originalX1 || isNaN(originalX1)) {
      originalX1 = parseFloat(fillLine.getAttribute("x1"));
      fillLine.setAttribute("data-original-x1", originalX1);
    }

    // 중앙 정렬 유지: 원본 중앙에서 조정된 길이의 절반씩 빼고 더함
    const originalX2 = originalX1 + originalLength;
    const originalCenterX = (originalX1 + originalX2) / 2;
    const newX = originalCenterX - (adjustedLength / 2);

    // 게이지 길이 및 위치 업데이트
    fillLine.setAttribute("data-gauge-length", Math.round(adjustedLength)); // 반올림하여 정수로 저장
    fillLine.setAttribute("x", newX);

    // 배경 라인도 조정 (중앙 정렬 유지)
    if (bgLine) {
      let originalX1 = parseFloat(bgLine.getAttribute("data-original-x1"));
      let originalX2 = parseFloat(bgLine.getAttribute("data-original-x2"));
      
      // 원본 좌표가 없으면 현재 좌표를 원본으로 저장
      if (!originalX1 || isNaN(originalX1)) {
        originalX1 = parseFloat(bgLine.getAttribute("x1"));
        originalX2 = parseFloat(bgLine.getAttribute("x2"));
        bgLine.setAttribute("data-original-x1", originalX1);
        bgLine.setAttribute("data-original-x2", originalX2);
      }
      
      // 원본 opacity 가져오기
      let originalOpacity = parseFloat(bgLine.getAttribute("data-original-opacity"));
      if (!originalOpacity || isNaN(originalOpacity)) {
        originalOpacity = CONFIG.GAUGE.BG_OPACITY;
        bgLine.setAttribute("data-original-opacity", originalOpacity);
      }
      
      // progress에 따라 opacity 설정: 학습 내용이 없으면(progress === 0) opacity 0, 있으면 원본 opacity
      if (progress > 0) {
        bgLine.setAttribute("opacity", originalOpacity);
      } else {
        bgLine.setAttribute("opacity", 0);
      }
      
      if (isCompleted) {
        // 중앙 정렬 유지: 원본 중앙에서 조정된 너비의 절반씩 빼고 더함
        const originalCenterX = (originalX1 + originalX2) / 2;
        const adjustedBgWidth = (originalX2 - originalX1) - (EMBOSSING_INSET * 2);
        const newX1 = originalCenterX - (adjustedBgWidth / 2);
        const newX2 = originalCenterX + (adjustedBgWidth / 2);
        
        bgLine.setAttribute("x1", newX1);
        bgLine.setAttribute("x2", newX2);
      } else {
        // 완료되지 않았으면 원본 좌표로 복원
        bgLine.setAttribute("x1", originalX1);
        bgLine.setAttribute("x2", originalX2);
      }
    }

    const newWidth = adjustedLength * (progress / 100);

    requestAnimationFrame(() => {
      fillLine.style.width = `${newWidth}px`;
    });
  }
}

// ============================================================================
// UI 요소 생성 클래스
// ============================================================================
class UIElementFactory {
  static createPlayButton(pieceId, svg, contentManager) {
    const position = BUTTON_POSITIONS.find((p) => p.id === pieceId);
    if (!position) return;

    const isFileType = contentManager.getType(pieceId) === "file";
    const groupColor = contentManager.getGroupColor(pieceId);

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

  /**
 * 퍼즐 조각 경계선 생성
 */
static createBoundaryLines(svg) {
  const boundaryGroup = SVGHelper.createElement("g", {
    class: "puzzle-boundaries",
    id: "puzzleBoundaries",
    style: "pointer-events: none;", // 클릭 이벤트 차단
  });

  BOUNDARY_LINES.forEach((boundary) => {
    const line = SVGHelper.createElement("line", {
      x1: boundary.x1,
      y1: boundary.y1,
      x2: boundary.x2,
      y2: boundary.y2,
      stroke: "#000000", // 검은색
      "stroke-width": "2",
      "stroke-linecap": "butt",
      "stroke-opacity": "0.8", // 약간 투명하게
      class: "boundary-line",
      "data-boundary": boundary.label,
    });

    boundaryGroup.appendChild(line);
  });

  svg.appendChild(boundaryGroup);
}
}
// ============================================================================
// 모달 관리 클래스 (VideoModalBase 활용) - 퍼즐 온보딩 전용
// ============================================================================
class PuzzleModalManager {
  // VideoModalBase 인스턴스 저장
  static videoModalBase = null;

  /**
   * VideoModalBase 초기화
   * @private
   */
  static _initVideoModalBase() {
    if (!this.videoModalBase) {
      this.videoModalBase = new VideoModalBase({
        videos: [],
        modalPath: "./_modal/video-onboarding.html",
        modalPathTemplate: "./_modal/video-{type}.html",
        enableHeightAdjustment: false, // onboarding은 자체 높이 조정 사용
        enableCommentResizer: false,
        enableCommentBox: true, // 댓글 입력 시 작성 버튼 활성화
      });
    }
    return this.videoModalBase;
  }

  /**
   * 챕터 모달 열기 (VideoModalBase 활용)
   * @param {number} chapterIndex - 챕터 인덱스
   * @param {Object} chapter - 챕터 데이터
   */
  static async openChapterModal(chapterIndex, chapter) {
    console.log(
      `[PuzzleModalManager] 챕터 모달 열기: [${chapterIndex}] ${chapter.name}`
    );

    try {
      // VideoModalBase 초기화
      const videoModalBase = this._initVideoModalBase();
      
      // 기존 모달 제거
      this._removeExistingModal();

      // VideoModalBase를 사용하여 모달 HTML 로드
      const modalHTML = await videoModalBase.loadModalHTML("onboarding");
      
      // VideoModalBase를 사용하여 모달 요소 생성
      const modal = videoModalBase.createModalFromHTML(modalHTML, "onboarding");
      
      // DOM에 추가
      document.body.appendChild(modal);
      
      // ✅ 모달을 먼저 숨긴 상태로 표시 (높이 조정이 보이지 않도록)
      modal.style.display = "block";
      modal.style.visibility = "hidden";
      modal.style.opacity = "0";

      // 모달 초기화
      setTimeout(() => {
        this._setupModal(modal, chapter, chapterIndex);
      }, 50);
    } catch (error) {
      console.error("모달 로드 오류:", error);
      this._openFallbackModal(chapterIndex, chapter);
    }
  }

  /**
   * 기존 모달 제거 (VideoModalBase 활용)
   * @private
   */
  static _removeExistingModal() {
    const existingModal = document.querySelector(".modal.video");
    if (existingModal) {
      // VideoBase를 사용하여 비디오 중지
      const iframe = existingModal.querySelector("#videoFrame");
      if (iframe) {
        VideoBase.stop(iframe);
      }

      // Observer들 정리
      if (existingModal._resizeObserver) {
        existingModal._resizeObserver.disconnect();
      }
      if (existingModal._mutationObserver) {
        existingModal._mutationObserver.disconnect();
      }
      if (existingModal._heightAdjustTimer) {
        clearTimeout(existingModal._heightAdjustTimer);
      }
      if (existingModal._windowResizeHandler) {
        window.removeEventListener("resize", existingModal._windowResizeHandler);
      }
      existingModal.remove();
    }

    // VideoModalBase 인스턴스도 정리
    if (this.videoModalBase) {
      this.videoModalBase.destroy();
    }
  }

  /**
   * 모달 설정
   * @private
   */
  static _setupModal(modal, chapter, chapterIndex) {
    // 모달 상태 객체 생성
    const modalState = {
      currentLessonIndex: 0,
      retryCount: 0,
      isVisible: false,
      isAdjustingHeight: false,
      isInitialLoadComplete: false,
    };
  
    // 첫 번째 학습 로드
    this._loadLesson(modal, chapter, modalState.currentLessonIndex);
  
    // 진행률 업데이트
    this._updateProgress(modal, chapter);
  
    // 닫기 이벤트 먼저 설정
    this._setupCloseEvents(modal, chapter, chapterIndex, modalState);

    // 댓글 입력 시 작성/취소 버튼 활성화
    if (this.videoModalBase && this.videoModalBase.setupCommentBox) {
      this.videoModalBase.setupCommentBox(modal);
    }
  
    // 학습 목차 생성
    this._createLearningList(modal, chapter, chapterIndex, modalState);
  
    // ✅ 높이 조정 후 모달 표시
    this._initializeHeightAdjustment(modal, modalState, () => {
      // 높이 조정 완료 후 모달을 보이게 함
      modal.style.visibility = "visible";
      modal.style.opacity = "1";
      modal.style.transition = "opacity 0.3s ease";
      modalState.isVisible = true;
      modalState.isInitialLoadComplete = true;
      
      // 현재 학습으로 스크롤
      setTimeout(() => {
        this._scrollToCurrentLesson(modal);
      }, 100);
    });
  }

  // ============================================================================
  // 높이 조정 시스템 (VideoModal 방식 적용)
  // ============================================================================

  /**
   * 높이 조정 초기화
   * @private
   * @param {HTMLElement} modal - 모달 요소
   * @param {Object} modalState - 모달 상태
   * @param {Function} onComplete - 높이 조정 완료 후 실행할 콜백
   */
  static _initializeHeightAdjustment(modal, modalState, onComplete) {
    // ✅ 최적화: 높이 조정을 3단계로 축소 (리플로우 최소화)
    let pendingAdjust = null;
    
    const scheduleAdjust = () => {
      if (pendingAdjust) {
        cancelAnimationFrame(pendingAdjust);
      }
      pendingAdjust = requestAnimationFrame(() => {
        this._adjustModalContentHeight(modal, modalState);
        this._adjustVideoListHeight(modal, modalState);
        pendingAdjust = null;
      });
    };

    // 1단계: 즉시 시도 (첫 렌더링)
    scheduleAdjust();

    // 2단계: requestAnimationFrame (2프레임 대기)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scheduleAdjust();
      });
    });

    // 3단계: 지연 시도 (이미지 로딩 대기 후)
    this._waitForImagesAndAdjust(modal, modalState).then(() => {
      scheduleAdjust();
      if (onComplete) {
        onComplete();
      }
    });
  
    // Observer 설정 (초기 로딩 후에만 작동)
    this._setupResizeObserver(modal, modalState);
    this._setupMutationObserver(modal, modalState);
  }

  /**
   * 모달 컨텐츠 전체 높이 조정
   * 화면 높이의 80% 이상일 때만 조절하고, 아닐 경우 80%로 유지
   * @private
   */
  static _adjustModalContentHeight(modal, modalState) {
    const modalContent = modal?.querySelector(".modal-content");
    if (!modalContent) {
      console.warn("[ModalManager] modal-content 요소를 찾을 수 없습니다");
      return;
    }

    // 화면 높이의 80% 계산
    const viewportHeight = window.innerHeight;
    const maxHeight = viewportHeight * 0.8;

    // 현재 모달 컨텐츠의 실제 높이 (스타일이 적용되기 전의 자연스러운 높이)
    const originalHeight = modalContent.style.height;
    modalContent.style.height = "auto";
    const actualHeight = modalContent.scrollHeight;
    modalContent.style.height = originalHeight;

    // 실제 높이가 80% 이상이면 조절하지 않고 그대로 유지, 그렇지 않으면 80%로 설정
    if (actualHeight >= maxHeight) {
      // 80% 이상이면 높이를 조절하지 않음
      modalContent.style.height = "auto";
      modalContent.style.overflowY = "auto";
    } else {
      // 80% 미만이면 80%로 설정
      modalContent.style.height = maxHeight + "px";
      modalContent.style.overflowY = "auto";
    }

    console.log("[ModalManager] 모달 컨텐츠 높이 조정:", {
      viewportHeight,
      maxHeight,
      actualHeight,
      finalHeight: modalContent.style.height,
    });
  }

  /**
   * video-list 높이 조정 (개선 버전)
   * @private
   * @returns {boolean} 성공 여부
   */
  static _adjustVideoListHeight(modal, modalState) {
    const videoSide = modal.querySelector(".video-side");
    const videoHeader = modal.querySelector(".video-header");
    const videoList = modal.querySelector(".video-list");
    const learningList = modal.querySelector(".learning-list");
    const commentWrap = modal.querySelector(".comment-wrap");

    if (!videoSide || !videoHeader || !videoList || !learningList) {
      console.warn("[ModalManager] 필요한 요소를 찾을 수 없습니다");
      modalState.isAdjustingHeight = false;
      return false;
    }

    // ✅ 높이 조정 중 플래그 설정
    modalState.isAdjustingHeight = true;

    // ✅ 스크롤 위치 저장
    const savedScrollTop = learningList.scrollTop;

    // 전체 높이
    const totalHeight = videoSide.clientHeight;

    // 높이가 0이거나 비정상적으로 작으면 DOM이 아직 렌더링되지 않은 것
    if (totalHeight < 100) {
      console.warn(
        `[ModalManager] videoSide 높이가 비정상적으로 작습니다: ${totalHeight}px. 재측정 예약...`
      );

      // 최대 3번까지만 재시도
      if (modalState.retryCount < 3) {
        modalState.retryCount++;
        modalState.isAdjustingHeight = false;
        setTimeout(() => this._adjustVideoListHeight(modal, modalState), 100);
      } else {
        console.error("[ModalManager] 높이 측정 재시도 횟수 초과");
        modalState.retryCount = 0;
        modalState.isAdjustingHeight = false;
      }
      return false;
    }

    // 재시도 카운터 초기화
    modalState.retryCount = 0;

    // 헤더 높이
    const headerHeight = videoHeader.offsetHeight;

    // comment-wrap 높이
    const commentWrapHeight = commentWrap ? commentWrap.offsetHeight : 0;

    // comment-list-wrap 높이 (comment-wrap 내부에 있을 수 있음)
    const commentListWrap = modal.querySelector(".comment-list-wrap");
    const commentListWrapHeight = commentListWrap ? commentListWrap.offsetHeight : 0;

    // video-list의 제목 높이
    const videoListTitle = videoList.querySelector("h5.tit");
    const titleHeight = videoListTitle ? videoListTitle.offsetHeight : 0;

    // video-list의 padding 값 계산
    const videoListStyle = window.getComputedStyle(videoList);
    const paddingTop = parseInt(videoListStyle.paddingTop) || 0;
    const paddingBottom = parseInt(videoListStyle.paddingBottom) || 0;

    // comment-info 존재 여부 확인
    const commentInfo = modal.querySelector(".comment-info");
    const commentInfoOffset = commentInfo ? 40 : 0;

    // learning-list에 사용 가능한 최대 높이
    // comment-list-wrap 높이도 고려 (comment-wrap과 별도로 계산)
    const availableHeight = totalHeight - headerHeight - commentWrapHeight - 
                           (commentListWrapHeight > 0 ? commentListWrapHeight : 0) -
                           titleHeight - paddingTop - paddingBottom - 
                           commentInfoOffset - 20;

    // 사용 가능한 높이가 음수이거나 너무 작으면 경고
    if (availableHeight < 50) {
      console.warn(
        `[ModalManager] 사용 가능한 높이가 너무 작습니다: ${availableHeight}px`
      );
      modalState.isAdjustingHeight = false;
      return false;
    }

    // ✅ learning-list의 실제 컨텐츠 높이 측정 (스타일 제거 후)
    const originalHeight = learningList.style.height;
    const originalOverflow = learningList.style.overflowY;
    
    learningList.style.height = 'auto';
    learningList.style.overflowY = 'visible';
    
    const listContentHeight = learningList.scrollHeight;
    
    learningList.style.height = originalHeight;
    learningList.style.overflowY = originalOverflow;

    // ✅ video-list의 실제 컨텐츠 높이 측정 (comment-list-wrap 높이 고려)
    const videoListOriginalHeight = videoList.style.height;
    const videoListOriginalOverflow = videoList.style.overflowY;
    
    videoList.style.height = 'auto';
    videoList.style.overflowY = 'visible';
    
    const videoListContentHeight = videoList.scrollHeight;
    
    videoList.style.height = videoListOriginalHeight;
    videoList.style.overflowY = videoListOriginalOverflow;

    // video-list에 사용 가능한 높이 계산
    // video-list는 컨테이너이므로, 내부 요소(제목, padding)는 빼지 않음
    // comment-wrap만 빼면 됨 (comment-list-wrap은 이미 commentWrapHeight에 포함됨)
    const videoListAvailableHeight = totalHeight - headerHeight - commentWrapHeight - 10;

    // 컨텐츠가 적으면 컨텐츠 높이만큼, 많으면 사용 가능한 높이만큼
    const listHeight = Math.min(listContentHeight, availableHeight);
    const videoListHeight = Math.min(videoListContentHeight, videoListAvailableHeight);

    // 최소 높이 보장
    const finalHeight = Math.max(listHeight, 100);
    const videoListFinalHeight = Math.max(videoListHeight, 100);

    // ✅ 현재 설정된 높이 확인
    const currentHeight = learningList.style.height
      ? parseInt(learningList.style.height)
      : learningList.offsetHeight;
    
    const videoListCurrentHeight = videoList.style.height
      ? parseInt(videoList.style.height)
      : videoList.offsetHeight;

    // 스크롤 필요 여부 확인
    const needsScroll = listContentHeight > availableHeight;
    const videoListNeedsScroll = videoListContentHeight > videoListAvailableHeight;

    console.log("[ModalManager] 높이 측정 성공:", {
      totalHeight,
      headerHeight,
      commentWrapHeight,
      commentListWrapHeight,
      titleHeight,
      paddingTop,
      paddingBottom,
      availableHeight,
      listContentHeight,
      listHeight,
      finalHeight,
      currentHeight,
      needsScroll,
      videoListContentHeight,
      videoListAvailableHeight,
      videoListHeight,
      videoListFinalHeight,
      videoListCurrentHeight,
      videoListNeedsScroll,
      savedScrollTop,
    });

    // ✅ 높이가 실제로 변경되는 경우에만 스타일 업데이트
    const heightChanged = Math.abs(currentHeight - finalHeight) > 1;
    const videoListHeightChanged = Math.abs(videoListCurrentHeight - videoListFinalHeight) > 1;

    // learning-list의 height와 overflow-y는 CSS로 관리 (인라인 스타일 제거)

    // ✅ video-list 높이 및 스크롤 설정 (overflow-y: hidden 제거, CSS 기본값 사용)
    if (videoListHeightChanged) {
      videoList.style.height = videoListFinalHeight + "px";
    }
    // 스크롤이 필요할 때만 auto 설정, 필요 없을 때는 CSS 기본값 사용
    if (videoListNeedsScroll) {
      videoList.style.overflowY = "auto";
    } else {
      videoList.style.overflowY = ""; // CSS 기본값 사용
    }

    // ✅ 컨텐츠 높이를 CSS 변수로 설정 (::before 요소에서 사용)
    learningList.style.setProperty('--scroll-height', `${listContentHeight}px`);

    // ✅ 스크롤 위치 복원 (높이 변경 여부와 관계없이)
    requestAnimationFrame(() => {
      learningList.scrollTop = savedScrollTop;
      // 높이 조정 완료 후 플래그 해제
      modalState.isAdjustingHeight = false;
    });
    
    return true;
  }

  /**
   * ResizeObserver 설정
   * @private
   */
  static _setupResizeObserver(modal, modalState) {
    const videoSide = modal.querySelector(".video-side");
    const commentWrap = modal.querySelector(".comment-wrap");
    const modalContent = modal.querySelector(".modal-content");
  
    if (!videoSide) return;
  
    if (!modal._resizeObserver) {
      // ✅ throttle 적용 (리플로우 최소화)
      const throttledAdjust = Utils.throttle(() => {
        if (!modalState.isInitialLoadComplete) {
          return;
        }
        
        let pendingAdjust = null;
        if (pendingAdjust) {
          cancelAnimationFrame(pendingAdjust);
        }
        pendingAdjust = requestAnimationFrame(() => {
          this._adjustModalContentHeight(modal, modalState);
          this._adjustVideoListHeight(modal, modalState);
          pendingAdjust = null;
        });
      }, 100); // 100ms throttle

      modal._resizeObserver = new ResizeObserver((entries) => {
        // ✅ 초기 로딩 중에는 무시
        if (!modalState.isInitialLoadComplete) {
          return;
        }
        throttledAdjust();
      });
  
      modal._resizeObserver.observe(videoSide);
      if (commentWrap) {
        modal._resizeObserver.observe(commentWrap);
      }
      if (modalContent) {
        modal._resizeObserver.observe(modalContent);
      }
    }
  
    // Window resize 이벤트 (throttle 적용)
    if (!modal._windowResizeHandler) {
      const throttledResize = Utils.throttle(() => {
        if (!modalState.isInitialLoadComplete) {
          return;
        }
        
        let pendingAdjust = null;
        if (pendingAdjust) {
          cancelAnimationFrame(pendingAdjust);
        }
        pendingAdjust = requestAnimationFrame(() => {
          this._adjustModalContentHeight(modal, modalState);
          this._adjustVideoListHeight(modal, modalState);
          pendingAdjust = null;
        });
      }, 100); // 100ms throttle

      modal._windowResizeHandler = throttledResize;
      window.addEventListener("resize", modal._windowResizeHandler);
    }
  }

  /**
   * MutationObserver 설정
   * @private
   */
  static _setupMutationObserver(modal, modalState) {
    const learningList = modal.querySelector(".learning-list");
  
    if (!learningList) return;
  
    if (!modal._mutationObserver) {
      modal._mutationObserver = new MutationObserver((mutations) => {
        // ✅ 초기 로딩 중에는 무시
        if (!modalState.isInitialLoadComplete) {
          console.log("[ModalManager] 초기 로딩 중 - MutationObserver 무시");
          return;
        }
  
        // ✅ 높이 조정 중이면 무시
        if (modalState.isAdjustingHeight) {
          return;
        }
  
        const hasRelevantChange = mutations.some((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style" &&
            mutation.target === learningList
          ) {
            return false;
          }
          return mutation.type === "childList" || 
                 (mutation.type === "attributes" && mutation.target !== learningList);
        });
  
        if (!hasRelevantChange) {
          return;
        }
  
        // ✅ throttle 적용 (리플로우 최소화)
        if (!modal._mutationThrottle) {
          modal._mutationThrottle = Utils.throttle(() => {
            let pendingAdjust = null;
            if (pendingAdjust) {
              cancelAnimationFrame(pendingAdjust);
            }
            pendingAdjust = requestAnimationFrame(() => {
              this._adjustModalContentHeight(modal, modalState);
              this._adjustVideoListHeight(modal, modalState);
              pendingAdjust = null;
            });
          }, 100); // 100ms throttle
        }
        modal._mutationThrottle();
      });
  
      modal._mutationObserver.observe(learningList, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }
  }

  /**
   * 이미지 로딩 대기 후 높이 조정
   * @private
   */
  static async _waitForImagesAndAdjust(modal, modalState) {
    const learningList = modal.querySelector(".learning-list");
    if (!learningList) return;

    const images = learningList.querySelectorAll("img");

    if (images.length === 0) {
      console.log("[ModalManager] 학습 목록에 이미지 없음");
      return;
    }

    console.log(`[ModalManager] 이미지 ${images.length}개 로딩 대기 중...`);

    const imagePromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();

      return new Promise((resolve) => {
        img.onload = () => {
          console.log("[ModalManager] 이미지 로드 완료:", img.src);
          resolve();
        };
        img.onerror = () => {
          console.warn("[ModalManager] 이미지 로드 실패:", img.src);
          resolve();
        };

        // 10초 타임아웃
        setTimeout(resolve, 10000);
      });
    });

    await Promise.all(imagePromises);

    console.log("[ModalManager] 모든 이미지 로딩 완료: 높이 재조정");
    this._adjustModalContentHeight(modal, modalState);
    this._adjustVideoListHeight(modal, modalState);

    // 이미지 로딩 후 다시 스크롤
    setTimeout(() => {
      this._scrollToCurrentLesson(modal);
    }, 100);
  }

  // ============================================================================
  // 스크롤 관리 (개선 버전)
  // ============================================================================

  /**
   * 현재 학습 중인 항목으로 스크롤
   * @private
   */
  static _scrollToCurrentLesson(modal) {
    const learningList = modal.querySelector(".learning-list");
    if (!learningList) {
      console.warn("[ModalManager] 학습 목록을 찾을 수 없습니다");
      return;
    }

    // 현재 학습 중인 항목 찾기
    const currentItem = learningList.querySelector('li[data-current="true"]');
    if (!currentItem) {
      console.warn("[ModalManager] 현재 학습 항목을 찾을 수 없습니다");
      return;
    }

    // 스크롤 위치 계산
    const listRect = learningList.getBoundingClientRect();
    const itemRect = currentItem.getBoundingClientRect();

    // 목록 중앙에 현재 항목이 오도록 스크롤
    const scrollOffset =
      itemRect.top - listRect.top - listRect.height / 2 + itemRect.height / 2;

    // 부드러운 스크롤
    learningList.scrollTo({
      top: learningList.scrollTop + scrollOffset,
      behavior: "smooth",
    });

    console.log(`[ModalManager] 현재 학습으로 스크롤 이동:`, {
      currentItem: currentItem.querySelector(".title")?.textContent,
      scrollOffset,
    });

    // ✅ 시각적 강조 효과
    this._highlightCurrentLesson(currentItem);
  }

  /**
   * 현재 학습 항목 시각적 강조
   * @private
   */
  static _highlightCurrentLesson(currentItem) {
    // 간단한 강조 효과
    currentItem.style.transition = "all 0.3s ease";

    setTimeout(() => {
      currentItem.style.transition = "";
    }, 1000);
  }

  // ============================================================================
  // 기존 메서드들 (학습 로드, 진행률, 목차 등)
  // ============================================================================

  /**
   * 학습 로드 (VideoModalBase 활용)
   * @private
   */
  static _loadLesson(modal, chapter, lessonIndex) {
    const lesson = chapter.lessons[lessonIndex];
    const videoModalBase = this._initVideoModalBase();
    
    // VideoModalBase의 setupVideo 메서드 활용
    if (chapter.type === "youtube" && lesson.url) {
      const videoData = { url: lesson.url, id: lesson.url };
      videoModalBase.setupVideo(modal, videoData);
    } else if (chapter.type === "file") {
      // 파일 타입은 직접 설정
      const iframe = modal.querySelector("#videoFrame");
      if (iframe) {
        iframe.src = lesson.url || "";
      }
    }

    // 현재 강의 제목 업데이트
    const subTxt = modal.querySelector(".video-header .sub-txt");
    if (subTxt) {
      subTxt.textContent = lesson.label;
    }
  }

  /**
   * 진행률 업데이트
   * @private
   */
  static _updateProgress(modal, chapter) {
    const completedCount = chapter.lessons.filter(l => l.completed).length;
    const totalCount = chapter.lessons.length;
    const progressPercent = Math.round((completedCount / totalCount) * 100);

    // 게이지바
    const gaugeFill = modal.querySelector("#gaugeFill");
    if (gaugeFill) {
      gaugeFill.style.width = progressPercent + "%";
    }

    // 진도율 텍스트
    const currentValue = modal.querySelector("#currentValue em");
    if (currentValue) {
      currentValue.textContent = progressPercent;
    }

    // 차시 정보
    const labelElement = modal.querySelector(".gauge-labels .label:not(.current)");
    if (labelElement) {
      labelElement.innerHTML = `<em>${completedCount}</em> /${totalCount} 강`;
    }
  }

  /**
   * 학습 목차 생성
   * @private
   */
  static _createLearningList(modal, chapter, chapterIndex, modalState) {
    try {
      const domUtils = typeof DOMUtils !== 'undefined' ? DOMUtils : null;
      const eventManager = typeof eventManager !== 'undefined' ? eventManager : null;
      const errorHandler = typeof ErrorHandler !== 'undefined' ? ErrorHandler : null;

      const list = domUtils?.$(".learning-list", modal) || modal.querySelector(".learning-list");
      if (!list) {
        console.warn('[ModalManager] 학습 목록 요소를 찾을 수 없습니다.');
        return;
      }

      domUtils?.empty(list) || (list.innerHTML = "");

      chapter.lessons.forEach((lesson, index) => {
        try {
          const li = domUtils?.createElement('li') || document.createElement("li");
          
          // 상태 클래스
          if (index === modalState.currentLessonIndex) {
            domUtils?.addClasses(li, 'active') || li.classList.add("active");
            li.setAttribute("data-current", "true");
          } else if (lesson.completed) {
            domUtils?.addClasses(li, 'complet') || li.classList.add("complet");
          }

          // 이미지 번호 (1-6 순환)
          const imageNum = (index % 6) + 1;

          // 상태 텍스트
          let stateText = "미진행";
          if (index === modalState.currentLessonIndex) {
            stateText = "학습중";
          } else if (lesson.completed) {
            stateText = "학습완료";
          }

          li.innerHTML = `
            <a href="#" class="list" data-lesson-index="${index}">
              <span class="seq">${index + 1}차시</span>
              <div class="learning-box">
                <div class="thumb">
                  <img src="./assets/images/video/img_learning_thumb_0${imageNum}.png" alt="${lesson.label}" loading="lazy" />
                </div>
                <div class="txt-box">
                  <div class="title">${lesson.label}</div>
                  <span class="state">${stateText}</span>
                </div>
              </div>
            </a>
          `;

          // 클릭 이벤트 (EventManager 사용)
          const link = domUtils?.$(".list", li) || li.querySelector(".list");
          if (link) {
            const clickHandler = (e) => {
              try {
                e.preventDefault();
                
                const clickedIndex = parseInt(e.currentTarget.dataset.lessonIndex);
                if (isNaN(clickedIndex)) {
                  console.error('[ModalManager] 유효하지 않은 lesson index:', e.currentTarget.dataset.lessonIndex);
                  return;
                }

                console.log(`[ModalManager] 학습 클릭: ${clickedIndex}, 이전: ${modalState.currentLessonIndex}`);
                
                // 이전 학습 완료 처리
                if (modalState.currentLessonIndex !== clickedIndex) {
                  const prevLesson = chapter.lessons[modalState.currentLessonIndex];
                  if (prevLesson && !prevLesson.completed) {
                    console.log(`[ModalManager] 학습 완료 처리: [${chapterIndex}-${modalState.currentLessonIndex}] ${prevLesson.label}`);
                    PuzzleManager.instance.chapterManager.completeLesson(
                      chapterIndex,
                      modalState.currentLessonIndex
                    );
                    PuzzleManager.instance.updatePieceGauge(chapter.pieceId);
                  }
                }

                // 새 학습 로드
                modalState.currentLessonIndex = clickedIndex;
                console.log(`[ModalManager] currentLessonIndex 업데이트: ${modalState.currentLessonIndex}`);
                
                this._loadLesson(modal, chapter, modalState.currentLessonIndex);
                this._updateProgress(modal, chapter);
                this._createLearningList(modal, chapter, chapterIndex, modalState);
                
                // ✅ 목록 재생성 후 높이 재조정 및 스크롤
                setTimeout(() => {
                  this._adjustModalContentHeight(modal, modalState);
                  this._adjustVideoListHeight(modal, modalState);
                  setTimeout(() => {
                    this._scrollToCurrentLesson(modal);
                  }, 100);
                }, 50);
              } catch (error) {
                if (errorHandler) {
                  errorHandler.handle(error, {
                    context: 'PuzzleModalManager._createLearningList.clickHandler',
                    chapterIndex,
                    lessonIndex: index
                  }, false);
                } else {
                  console.error('[ModalManager] 클릭 핸들러 에러:', error);
                }
              }
            };

            if (eventManager) {
              const listenerId = eventManager.on(link, "click", clickHandler);
              // 리스너 ID를 modal에 저장하여 나중에 정리할 수 있도록
              if (!modal._learningListListenerIds) {
                modal._learningListListenerIds = [];
              }
              modal._learningListListenerIds.push({ element: link, id: listenerId });
            } else {
              link.addEventListener("click", clickHandler);
            }
          }

          list.appendChild(li);
        } catch (error) {
          if (errorHandler) {
            errorHandler.handle(error, {
              context: 'PuzzleModalManager._createLearningList.lesson',
              chapterIndex,
              lessonIndex: index
            }, false);
          } else {
            console.error(`[ModalManager] 학습 항목 생성 에러 [${index}]:`, error);
          }
        }
      });
    } catch (error) {
      const errorHandler = typeof ErrorHandler !== 'undefined' ? ErrorHandler : null;
      if (errorHandler) {
        errorHandler.handle(error, {
          context: 'PuzzleModalManager._createLearningList',
          chapterIndex
        }, false);
      } else {
        console.error('[ModalManager] 학습 목록 생성 에러:', error);
      }
    }
  }

  /**
   * 닫기 이벤트 설정 (ModalUtils 활용)
   * @private
   */
  static _setupCloseEvents(modal, chapter, chapterIndex, modalState) {
    const closeModal = () => {
      console.log(`[ModalManager] closeModal 호출 - currentLessonIndex: ${modalState.currentLessonIndex}`);
      
      // 현재 학습 완료 처리
      const currentLesson = chapter.lessons[modalState.currentLessonIndex];
      console.log(`[ModalManager] 현재 학습 정보:`, {
        chapterIndex,
        lessonIndex: modalState.currentLessonIndex,
        lesson: currentLesson,
        completed: currentLesson?.completed
      });
      
      if (currentLesson && !currentLesson.completed) {
        console.log(`[ModalManager] 모달 닫기 - 학습 완료 처리: [${chapterIndex}-${modalState.currentLessonIndex}] ${currentLesson.label}`);
        PuzzleManager.instance.chapterManager.completeLesson(
          chapterIndex,
          modalState.currentLessonIndex
        );
        PuzzleManager.instance.updatePieceGauge(chapter.pieceId);
        PuzzleManager.instance._updateTotalProgress();
      } else if (currentLesson && currentLesson.completed) {
        console.log(`[ModalManager] 모달 닫기 - 이미 완료된 학습: [${chapterIndex}-${modalState.currentLessonIndex}] ${currentLesson.label}`);
      } else {
        console.error(`[ModalManager] 학습 정보를 찾을 수 없음: [${chapterIndex}-${modalState.currentLessonIndex}]`);
      }

      // ModalUtils를 사용하여 정리 및 제거
      ModalUtils.remove(modal, {
        duration: 300,
        onComplete: () => {
          console.log(`[ModalManager] 모달 제거 완료`);
        },
      });
    };

    // ModalUtils를 사용하여 공통 닫기 이벤트 설정
    ModalUtils.setupCloseEvents(modal, {
      onClose: closeModal,
      onCleanup: () => {
        // Observer 정리는 ModalUtils.remove에서 자동 처리됨
      },
    });
  }

  /**
   * 폴백 모달 (모달 파일 로드 실패 시)
   * @private
   */
  static _openFallbackModal(chapterIndex, chapter) {
    console.log("[ModalManager] 폴백 모달 사용");
    
    const modalHTML = `
      <div class="modal video" style="display: block;">
        <div class="modal-content">
          <div class="modal-body">
            <div class="video-contents">
              <div class="video-box">
                <iframe
                  id="videoFrame"
                  width="100%"
                  height="100%"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
            <div class="video-side step">
              <div class="video-header">
                <div class="tit-box">
                  <h5 class="tit">현재강의</h5>
                  <p class="sub-txt"></p>
                </div>
                <div class="gauge-container">
                  <div class="gauge-bar">
                    <div class="gauge-fill" id="gaugeFill"></div>
                  </div>
                  <div class="gauge-labels">
                    <span class="label"><em>0</em> /0강</span>
                    <span class="label current" id="currentValue">진도율 <em>0</em>%</span>
                  </div>
                </div>
                <span class="close">&times;</span>
              </div>
              <div class="video-list">
                <h5 class="tit">학습목차</h5>
                <ul class="learning-list"></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
    const modal = document.querySelector(".modal.video");
    
    const modalState = {
      currentLessonIndex: 0,
      retryCount: 0,
      isVisible: false,
      isAdjustingHeight: false,
      isInitialLoadComplete: false,
    };
    
    this._setupModal(modal, chapter, chapterIndex);
  }
}

// ============================================================================
// 메인 퍼즐 관리 클래스
// ============================================================================
class PuzzleManager {
  static instance = null;

  constructor(boardElementId, chapterData = null, dependencies = {}) {
    if (PuzzleManager.instance) {
      return PuzzleManager.instance;
    }

    console.log('[PuzzleManager] 초기화 시작');
    console.log('[PuzzleManager] 챕터 데이터:', chapterData);

    // 의존성 주입 (폴백 포함)
    this.domUtils = dependencies.domUtils || (typeof DOMUtils !== 'undefined' ? DOMUtils : null);
    this.eventManager = dependencies.eventManager || (typeof eventManager !== 'undefined' ? eventManager : null);
    this.errorHandler = dependencies.errorHandler || (typeof ErrorHandler !== 'undefined' ? ErrorHandler : null);
    this.utils = dependencies.utils || (typeof Utils !== 'undefined' ? Utils : null);
    this.animationUtils = dependencies.animationUtils || (typeof AnimationUtils !== 'undefined' ? AnimationUtils : null);

    // 이벤트 리스너 ID 저장 (정리용)
    this.listenerIds = [];

    try {
      this.boardElement = this.domUtils?.$(`#${boardElementId}`) || document.getElementById(boardElementId);
      if (!this.boardElement) {
        const error = new Error(`보드 엘리먼트를 찾을 수 없습니다: ${boardElementId}`);
        this._handleError(error, 'PuzzleManager.constructor');
        return;
      }

      this.svg = null;
      this.pieces = [];
      this.chapterManager = new ChapterManager(chapterData, {
        errorHandler: this.errorHandler,
        utils: this.utils
      });
      this.contentManager = new ContentManager(this.chapterManager);
      this.videoModal = null; // VideoModal 인스턴스

      // VideoModal 초기화 시도
      this._initializeVideoModal();

      PuzzleManager.instance = this;
      console.log('[PuzzleManager] 초기화 완료');
    } catch (error) {
      this._handleError(error, 'PuzzleManager.constructor');
    }
  }

  /**
   * 에러 처리 헬퍼
   * @private
   */
  _handleError(error, context, additionalInfo = {}) {
    if (this.errorHandler) {
      this.errorHandler.handle(error, {
        context,
        component: 'PuzzleManager',
        ...additionalInfo
      }, false);
    } else {
      console.error(`[PuzzleManager] ${context}:`, error, additionalInfo);
    }
  }

  /**
   * VideoModal 초기화
   * @private
   */
  _initializeVideoModal() {
    if (window.VideoModal) {
      console.log('[PuzzleManager] VideoModal 감지 - 통합 모드');
      
      // VideoModal에 필요한 config와 markerManager 어댑터 생성
      const puzzleConfig = {
        modalPath: "./_modal/video-onboarding.html",
      };

      const puzzleMarkerManager = {
        completeLesson: (chapterIndex, lessonIndex) => {
          this.chapterManager.completeLesson(chapterIndex, lessonIndex);
        },
      };

      try {
        this.videoModal = {
          openPuzzleChapter: async (chapter, chapterIndex, videoData) => {
            console.log(`[PuzzleManager] VideoModal로 챕터 열기: ${chapter.name}`);
            
            // 실제 VideoModal 인스턴스가 필요한 경우
            // 여기서는 간단한 모달을 사용
            await PuzzleModalManager._openSimpleModal(chapterIndex, chapter);
          }
        };
        
        console.log('[PuzzleManager] VideoModal 어댑터 생성 완료');
      } catch (error) {
        console.error('[PuzzleManager] VideoModal 초기화 실패:', error);
        this.videoModal = null;
      }
    } else {
      console.log('[PuzzleManager] VideoModal 없음 - 기본 모달 사용');
    }
  }

  initialize() {
    this.svg = this._createSVG();
    this._setupDefs();
    this._createBoardBackground();
    this._createPuzzlePieces();
    
    // ✅ 경계선 추가 (타이틀과 버튼 전에 추가하여 아래에 배치)
    UIElementFactory.createBoundaryLines(this.svg);
    
    UIElementFactory.createTitles(this.svg);
    this._createPlayButtonsAndGauges();
  
    this.boardElement.appendChild(this.svg);
  
    // 챕터 데이터로 타이틀 업데이트
    this._updateTitlesFromChapters();
    
    this._initializeCompletedPieces();
  }

  /**
   * 챕터 데이터로 퍼즐 조각 타이틀 업데이트
   * @private
   */
  _updateTitlesFromChapters() {
    this.chapterManager.chapters.forEach((chapter) => {
      if (!chapter.pieceId || !chapter.name) return;

      const pieceId = chapter.pieceId;
      const titlePos = TITLE_POSITIONS.find((t) => t.id === pieceId);
      if (!titlePos) return;

      // 타이틀 업데이트
      const texts = this.svg.querySelectorAll("text");
      for (let text of texts) {
        const x = parseFloat(text.getAttribute("x"));
        const y = parseFloat(text.getAttribute("y"));

        if (Math.abs(x - titlePos.x) < 1 && Math.abs(y - titlePos.y) < 1) {
          const tspans = text.querySelectorAll("tspan");
          
          // 한 줄 또는 두 줄로 나누기
          const words = chapter.name.split(" ");
          if (tspans.length >= 2 && words.length >= 3) {
            // 두 줄로 나누기
            const midPoint = Math.ceil(words.length / 2);
            tspans[0].textContent = words.slice(0, midPoint).join(" ");
            tspans[1].textContent = words.slice(midPoint).join(" ");
          } else if (tspans.length >= 1) {
            // 한 줄로
            tspans[0].textContent = chapter.name;
            if (tspans[1]) tspans[1].textContent = "";
          }
          break;
        }
      }
    });
  }

  _createSVG() {
    return SVGHelper.createElement("svg", {
      viewBox: CONFIG.SVG.VIEWBOX,
      fill: "none",
    });
  }

  _setupDefs() {
    const defs = SVGHelper.createElement("defs");

    // 그라데이션
    GRADIENTS.forEach((grad) => {
      defs.appendChild(SVGHelper.createGradient(grad));
    });


    // 필터
    defs.appendChild(FilterFactory.createInnerShadowFilter());
    defs.appendChild(FilterFactory.createHoverShadowFilter());
    defs.appendChild(FilterFactory.createGaugeFillFilter());
    defs.appendChild(FilterFactory.createBoardFilter()); // 보드
    //  3D 효과 필터
    defs.appendChild(FilterFactory.createPieceEmbossingFilter());
    
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

      // clipPath 생성: completed-image가 base-image 영역 밖으로 나가지 않도록
      const clipPath = SVGHelper.createElement("clipPath", {
        id: `clip-piece-${piece.id}`,
      });
      const clipPathElement = SVGHelper.createElement("path", {
        d: piece.path,
      });
      clipPath.appendChild(clipPathElement);
      defs.appendChild(clipPath);

      // mask 제거: completed-image도 base-image와 동일한 stroke를 표시하도록 함
    });

    this.svg.appendChild(defs);
  }

  _createBoardBackground() {
    BOARD_PATHS.forEach((boardData) => {
      const path = SVGHelper.createElement("path", {
        d: boardData.d,
        fill: boardData.fill,
        filter: "url(#board-3d-effect)", // 3D 효과 필터 적용
      });
      this.svg.appendChild(path);
    });
  }

  _createPuzzlePieces() {
    try {
      // 의존성 전달
      const dependencies = {
        eventManager: this.eventManager,
        errorHandler: this.errorHandler,
        domUtils: this.domUtils
      };

      PUZZLE_PIECES.forEach((pieceData) => {
        try {
          const piece = new PuzzlePiece(
            pieceData,
            this.contentManager,
            this.chapterManager,
            dependencies
          );
          const element = piece.createElement();
          if (element && this.svg) {
            this.pieces.push(piece);
            this.svg.appendChild(element);
          } else {
            console.warn(`[PuzzleManager] 퍼즐 조각 ${pieceData.id} 생성 실패`);
          }
        } catch (error) {
          this._handleError(error, 'PuzzleManager._createPuzzlePieces.piece', { pieceId: pieceData.id });
        }
      });
    } catch (error) {
      this._handleError(error, 'PuzzleManager._createPuzzlePieces');
    }
  }

  _createPlayButtonsAndGauges() {
    PUZZLE_PIECES.forEach((piece) => {
      UIElementFactory.createPlayButton(
        piece.id,
        this.svg,
        this.contentManager
      );
      GaugeManager.createGauge(piece.id, this.svg);
    });
  }

  /**
   * 챕터 모달 열기
   */
  openChapterModal(chapterIndex, chapter) {
    PuzzleModalManager.openChapterModal(chapterIndex, chapter);
  }

  /**
   * 퍼즐 조각의 게이지 업데이트 (completed 기반)
   */
  updatePieceGauge(pieceId) {
    const chapterInfo = this.contentManager.getChapterByPieceId(pieceId);
    if (!chapterInfo) return;

    const progress = this.chapterManager.getChapterProgress(
      chapterInfo.chapterIndex
    );
    
    // 완료 상태 확인
    const isCompleted = this.chapterManager.isChapterCompleted(
      chapterInfo.chapterIndex
    );
    
    console.log(
      `[PuzzleManager] 게이지 업데이트: piece=${pieceId}, progress=${progress}%, completed=${isCompleted}`
    );
    
    GaugeManager.updateGauge(pieceId, progress, isCompleted);

    // 챕터가 완료되면 퍼즐 조각 완료 표시
    if (isCompleted) {
      const piece = this.pieces.find((p) => p.data.id === pieceId);
      if (piece && !piece.isCompleted) {
        console.log(`[PuzzleManager] 퍼즐 조각 완료: piece=${pieceId}`);
        piece.markComplete();
        this._checkAllCompleted();
      }
    }
  }

  /**
   * 전체 진행률 업데이트
   */
  _updateTotalProgress() {
    const percentage = this.chapterManager.getTotalProgress();

    const progressFill = document.getElementById("progressFill");
    const progressPercent = document.getElementById("progressPercent");

    if (progressFill) progressFill.style.width = percentage + "%";
    if (progressPercent) progressPercent.textContent = Math.round(percentage);

    console.log(`[PuzzleManager] 전체 진행률: ${percentage}%`);
  }

  /**
   * 모든 퍼즐 완료 확인
   */
  _checkAllCompleted() {
    if (this.chapterManager.isAllCompleted()) {
      console.log("[PuzzleManager] 모든 챕터 완료!");
      this._handleAllComplete();
    }
  }

  _handleAllComplete() {
    this._showCompletionAnimation();
  
    setTimeout(() => {
      this._showRibbonAnimation();
    }, 500);
  
    setTimeout(() => {
      this.boardElement.classList.add("all-completed");
      
      // ✅ 경계선 숨기기
      const boundaries = this.svg.querySelector("#puzzleBoundaries");
      if (boundaries) {
        boundaries.style.opacity = "0";
        boundaries.style.transition = "opacity 0.5s ease";
      }
    }, 3100);

    // 애니메이션 시작 시 문구 (이름님 수고하셨습니다 / 온보딩 필수 콘텐츠 시청을 완료하셨습니다)
    this._showCelebrationStart();
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
    // 애니메이션 시작 시 h3 문구 먼저 변경 (한 프레임 뒤 오버레이 표시해 변경이 보이도록)
    this._showCelebrationStart();
    requestAnimationFrame(() => {
      this._runCompletionAnimationOverlay();
    });
  }

  _runCompletionAnimationOverlay() {
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
      animation: completionFadeIn 0.5s ease forwards, completionPulse 2.5s ease-in-out 0.5s infinite;
    `;

    // CSS 애니메이션 스타일 추가
    if (!document.getElementById('completion-animation-styles')) {
      const style = document.createElement('style');
      style.id = 'completion-animation-styles';
      style.textContent = `
        @keyframes completionFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes completionPulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 20px rgba(255, 235, 59, 0.6));
          }
          50% {
            transform: scale(1.02);
            filter: drop-shadow(0 0 35px rgba(255, 235, 59, 0.9)) drop-shadow(0 0 50px rgba(255, 193, 7, 0.5));
          }
        }
      `;
      document.head.appendChild(style);
    }

    const svg = SVGHelper.createElement("svg", {
      viewBox: CONFIG.SVG.VIEWBOX,
      style: `
      width: 100%;
      height: 100%;
    `,
    });

    const defs = SVGHelper.createElement("defs");
    const completedPattern = SVGHelper.createPattern(
      "completion-animation-pattern",
      CONFIG.IMAGE_PATHS[CONFIG.COMPLETION_MODE].ALL_COMPLETED,
      false
    );
    defs.appendChild(completedPattern);
    svg.appendChild(defs);

    const boardGroup = SVGHelper.createElement("g");
    boardGroup.style.cssText = `
      animation: completionGlow 2.5s ease-in-out infinite;
    `;

    // 글로우 애니메이션 스타일 추가
    if (!document.getElementById('completion-glow-styles')) {
      const glowStyle = document.createElement('style');
      glowStyle.id = 'completion-glow-styles';
      glowStyle.textContent = `
        @keyframes completionGlow {
          0%, 100% {
            filter: drop-shadow(0 0 15px rgba(255, 235, 59, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(255, 235, 59, 0.8)) drop-shadow(0 0 45px rgba(255, 193, 7, 0.4));
          }
        }
      `;
      document.head.appendChild(glowStyle);
    }

    PUZZLE_PIECES.forEach((piece) => {
      const path = SVGHelper.createElement("path", {
        d: piece.path,
        fill: "url(#completion-animation-pattern)",
        stroke: "#333",
        "stroke-width": "0",  // ✅ stroke: 0 (하나의 이미지처럼)
        // ✅ 엠보싱 없음 (필터 적용 안 함)
      });
      boardGroup.appendChild(path);
    });

    svg.appendChild(boardGroup);
    animationContainer.appendChild(svg);
    document.body.appendChild(animationContainer);

    // 페이드 아웃 애니메이션
    setTimeout(() => {
      animationContainer.style.animation = 'completionFadeOut 0.5s ease forwards';
      
      // 페이드 아웃 애니메이션 스타일 추가
      if (!document.getElementById('completion-fadeout-styles')) {
        const fadeOutStyle = document.createElement('style');
        fadeOutStyle.id = 'completion-fadeout-styles';
        fadeOutStyle.textContent = `
          @keyframes completionFadeOut {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(0.98);
            }
          }
        `;
        document.head.appendChild(fadeOutStyle);
      }
    }, 3000);

    setTimeout(() => {
      animationContainer.remove();
  
      // ✅ 애니메이션 후 Finish Image 표시
      console.log('[PuzzleManager] 애니메이션 종료 - showFinish 호출 시작');
      this.pieces.forEach((piece) => {
        piece.showFinish();
      });
      console.log('[PuzzleManager] 애니메이션 종료 - showFinish 호출 완료');
  
      // ✅ 애니메이션 종료 시 문구 변경
      this._showCelebrationEnd();
    }, 3500);
  }

  /** 애니메이션 시작 시 표시 (h3: 온보딩 필수 콘텐츠 시청을 완료하셨습니다) */
  _showCelebrationStart() {
    const pageTitle = document.querySelector(".page-title");
    if (!pageTitle) return;

    const p = pageTitle.querySelector("p");
    const emText = pageTitle.querySelector("h3 em")?.textContent;

    pageTitle.querySelector("h3").innerHTML = `
    <span><em>${emText}</em>님,</span> 수고하셨습니다.
  `;
    if (p) {
      p.innerHTML = `
    <em>온보딩 필수 콘텐츠 </em> 시청을 완료하셨습니다.
  `;
    }
  }

  /** 애니메이션 종료 시 표시 (p: 필요할 땐 언제든 다시 볼 수 있어요) */
  _showCelebrationEnd() {
    const pageTitle = document.querySelector(".page-title");
    if (!pageTitle) return;
    const p = pageTitle.querySelector("p");
    pageTitle.querySelector("h3").innerHTML = `
    <em>온보딩 필수 콘텐츠</em> 시청을 완료하셨습니다.
  `;
    if (p) {
      p.classList.add("fw-b");
      p.innerHTML = `
    필요할 땐 <em>언제든</em> 다시 볼 수 있어요.
  `;
    }
  }

  _initializeCompletedPieces() {
    console.log('[PuzzleManager] 완료 상태 초기화 시작');
    
    // 각 챕터의 완료 상태 확인
    this.chapterManager.chapters.forEach((chapter, chapterIndex) => {
      if (!chapter.pieceId) {
        console.warn(`[PuzzleManager] 챕터 ${chapterIndex}에 pieceId가 없습니다`);
        return;
      }

      // 게이지 초기화
      const progress = this.chapterManager.getChapterProgress(chapterIndex);
      const isCompleted = this.chapterManager.isChapterCompleted(chapterIndex);
      console.log(`[PuzzleManager] 챕터 ${chapterIndex} (piece ${chapter.pieceId}): ${progress}% 진행, completed=${isCompleted}`);
      GaugeManager.updateGauge(chapter.pieceId, progress, isCompleted);

      // 완료된 챕터의 퍼즐 조각 완료 표시
      if (this.chapterManager.isChapterCompleted(chapterIndex)) {
        const piece = this.pieces.find((p) => p.data.id === chapter.pieceId);
        if (piece) {
          console.log(`[PuzzleManager] 퍼즐 조각 ${chapter.pieceId} 완료 표시`);
          piece.markComplete();
        }
      }
    });

    // 모든 챕터가 완료되었으면 완료 상태 표시
    if (this.chapterManager.isAllCompleted()) {
      console.log('[PuzzleManager] 모든 챕터 완료!');
      this.boardElement.classList.add("all-completed");
      this.pieces.forEach((piece) => {
        piece.showFinish();  // ✅ showAllCompleted → showFinish 변경
      });
    }

    // 전체 진행률 업데이트
    this._updateTotalProgress();
    console.log('[PuzzleManager] 완료 상태 초기화 종료');
  }
}

// ============================================================================
// 전역 함수
// ============================================================================
function updatePieceGaugeByCompletion(pieceId) {
  if (PuzzleManager.instance) {
    PuzzleManager.instance.updatePieceGauge(pieceId);
  }
}

// ============================================================================
// 초기화
// ============================================================================
function initializeOverlay() {
  try {
    const domUtils = typeof DOMUtils !== 'undefined' ? DOMUtils : null;
    const eventManager = typeof eventManager !== 'undefined' ? eventManager : null;
    const errorHandler = typeof ErrorHandler !== 'undefined' ? ErrorHandler : null;

    const overlay = domUtils?.$("#overlay") || document.getElementById("overlay");
    const celebration = domUtils?.$("#celebration") || document.getElementById("celebration");

    if (overlay && celebration) {
      const clickHandler = function () {
        try {
          this.classList.remove("show");
          celebration.classList.remove("show");
        } catch (error) {
          if (errorHandler) {
            errorHandler.handle(error, { context: 'initializeOverlay.clickHandler' }, false);
          } else {
            console.error('[Overlay] 클릭 핸들러 에러:', error);
          }
        }
      };

      if (eventManager) {
        eventManager.on(overlay, "click", clickHandler);
      } else {
        overlay.addEventListener("click", clickHandler);
      }
    }
  } catch (error) {
    const errorHandler = typeof ErrorHandler !== 'undefined' ? ErrorHandler : null;
    if (errorHandler) {
      errorHandler.handle(error, { context: 'initializeOverlay' }, false);
    } else {
      console.error('[Overlay] 초기화 에러:', error);
    }
  }
}

// 초기화 함수 (에러 처리 포함)
function initializePuzzleOnboarding() {
  try {
    const chapterData = window.puzzleChapterData || null;

    // 의존성 주입
    const dependencies = {
      domUtils: typeof DOMUtils !== 'undefined' ? DOMUtils : null,
      eventManager: typeof eventManager !== 'undefined' ? eventManager : null,
      errorHandler: typeof ErrorHandler !== 'undefined' ? ErrorHandler : null,
      utils: typeof Utils !== 'undefined' ? Utils : null,
      animationUtils: typeof AnimationUtils !== 'undefined' ? AnimationUtils : null,
    };

    const puzzleManager = new PuzzleManager("puzzleBoard", chapterData, dependencies);
    
    if (puzzleManager && puzzleManager.initialize) {
      puzzleManager.initialize();
    } else {
      console.error('[PuzzleOnboarding] PuzzleManager 초기화 실패');
    }
    
    initializeOverlay();
  } catch (error) {
    const errorHandler = typeof ErrorHandler !== 'undefined' ? ErrorHandler : null;
    if (errorHandler) {
      errorHandler.handle(error, {
        context: 'initializePuzzleOnboarding'
      }, true); // 사용자에게 표시
    } else {
      console.error('[PuzzleOnboarding] 초기화 에러:', error);
      alert('퍼즐 온보딩 초기화 중 오류가 발생했습니다.');
    }
  }
}

// DOMContentLoaded 이벤트 처리
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initializePuzzleOnboarding);
} else {
  // 이미 로드된 경우 즉시 실행
  initializePuzzleOnboarding();
}

// ============================================================================
// Export
// ============================================================================
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PuzzleManager,
    ChapterManager,
    ContentManager,
    GaugeManager,
    updatePieceGaugeByCompletion,
  };
}