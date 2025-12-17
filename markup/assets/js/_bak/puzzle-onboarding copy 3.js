// 퍼즐 온보딩 JavaScript
// puzzle-onboarding.js

// 퍼즐 조각 정보 (10개) - 경계선 정렬 수정
const pieces = [
  {
    id: 1,
    title: "왜 다워인인가 (최재천교수)",
    path: "M60.5 525.5L88.5 393L703.5 391L689.5 640H271L292 525.5H60.5Z",
  },
  {
    id: 2,
    title: "새로운 시대 준비된 우리",
    path: "M715 197L724 16L1112 16L1120 197H715Z",
  },
  {
    id: 3,
    title: "기술개발센터소개",
    path: "M1120 197L1112 16H1511L1533 195L1120 197Z",
  },
  {
    id: 4,
    title: "건설산업의 디지털 전환을",
    path: "M1128 387.5L1120 197L1533 195L1560.5 387.5H1128Z",
  },
  {
    id: 5,
    title: "상용 S/W 소개",
    path: "M705.5 387.5L715 197L1120 197L1128 387.5H705.5Z",
  },
  {
    id: 6,
    title: "축적의 시간",
    path: "M691.5 640L705 391L1128 389.5L1138.5 640H691.5Z",
  },
  {
    id: 7,
    title: "회사생활 (경력)",
    path: "M1138.5 640L1128 389.5H1559.5L1599.5 640H1138.5Z",
  },
  {
    id: 8,
    title: "회사생활 (신규입사자편)",
    path: "M1569 455L1533 195H1752L1800 449.5L1569 455Z",
  },
  {
    id: 9,
    title: "한맥가족 소개 및 경영이념",
    path: "M359 17.5L335.5 192.5H426.5L401.5 389H702L723 17.5H359Z",
  },
  {
    id: 10,
    title: "삼안 소개",
    path: "M88.5 390L124 193H426L402.5 389L88.5 390Z",
  },
];

// 비디오 URL (유튜브 ID)
const videoUrls = {
  1: "OXTYn3JkkCQ", // 왜 다워인인가
  2: "", // 새로운 시대 준비된 우리
  3: "T3pkeUl5fT4", // 기술개발센터 소개
  4: "T3pkeUl5fT4", // 건설산업의 디지털 전환을
  5: "T3pkeUl5fT4", // 상용 S/W 소개
  6: "8MugD6Cwhl8", // 축적의 시간
  7: "Py7nutVN53s", // 회사생활 (경력)
  8: "Py7nutVN53s", // 회사생활 (신규입사자편)
  9: "KWKJbTgtkrk", // 한맥가족 소개 및 경영이념
  10: "HugaMHZRBC8", // 삼안 소개
};

let completed = 0;
const totalPieces = pieces.length;
let puzzleBoard;

// SVG 생성
function initializePuzzle() {
  puzzleBoard = document.getElementById("puzzleBoard");

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 1862 664");
  svg.setAttribute("fill", "none");

  const defs = document.createElementNS(svgNS, "defs");

  // 보드 배경 그라디언트
  const gradients = [
    {
      id: "board_fill_1",
      stops: [
        { offset: "0%", color: "#2A5338" },
        { offset: "100%", color: "#306843" },
      ],
    },
    {
      id: "board_fill_2",
      stops: [
        { offset: "0%", color: "#662A0D" },
        { offset: "100%", color: "#8E2F00" },
      ],
    },
    {
      id: "board_fill_3",
      stops: [
        { offset: "0%", color: "#1D375D" },
        { offset: "100%", color: "#385888" },
      ],
    },
    {
      id: "board_fill_4",
      stops: [
        { offset: "0%", color: "#5B4822" },
        { offset: "100%", color: "#795711" },
      ],
    },
  ];

  gradients.forEach((grad) => {
    const gradient = document.createElementNS(svgNS, "linearGradient");
    gradient.setAttribute("id", grad.id);
    grad.stops.forEach((stop) => {
      const stopEl = document.createElementNS(svgNS, "stop");
      stopEl.setAttribute("offset", stop.offset);
      stopEl.setAttribute("stop-color", stop.color);
      gradient.appendChild(stopEl);
    });
    defs.appendChild(gradient);
  });

  // 완료 상태 필터 추가
  const completedFilter = document.createElementNS(svgNS, "filter");
  completedFilter.setAttribute("id", "completed-effect");
  completedFilter.setAttribute("x", "-50%");
  completedFilter.setAttribute("y", "-50%");
  completedFilter.setAttribute("width", "200%");
  completedFilter.setAttribute("height", "200%");

  const feDropShadow = document.createElementNS(svgNS, "feDropShadow");
  feDropShadow.setAttribute("dx", "1");
  feDropShadow.setAttribute("dy", "1");
  feDropShadow.setAttribute("stdDeviation", "2");
  feDropShadow.setAttribute("flood-color", "rgba(0, 0, 0, 0.8)");
  completedFilter.appendChild(feDropShadow);

  defs.appendChild(completedFilter);

  // Inner Shadow 필터 (제공된 SVG filter 구조와 동일하게)
  const innerShadowFilter = document.createElementNS(svgNS, "filter");
  innerShadowFilter.setAttribute("id", "inner-shadow-effect");
  innerShadowFilter.setAttribute("x", "-50%");
  innerShadowFilter.setAttribute("y", "-50%");
  innerShadowFilter.setAttribute("width", "200%");
  innerShadowFilter.setAttribute("height", "200%");
  innerShadowFilter.setAttribute("filterUnits", "userSpaceOnUse");
  innerShadowFilter.setAttribute("color-interpolation-filters", "sRGB");

  // BackgroundImageFix
  const feFlood0 = document.createElementNS(svgNS, "feFlood");
  feFlood0.setAttribute("flood-opacity", "0");
  feFlood0.setAttribute("result", "BackgroundImageFix");
  innerShadowFilter.appendChild(feFlood0);

  // Shape blend
  const feBlend0 = document.createElementNS(svgNS, "feBlend");
  feBlend0.setAttribute("mode", "normal");
  feBlend0.setAttribute("in", "SourceGraphic");
  feBlend0.setAttribute("in2", "BackgroundImageFix");
  feBlend0.setAttribute("result", "shape");
  innerShadowFilter.appendChild(feBlend0);

  // === 첫 번째 Inner Shadow (어두운 그림자) ===
  // dx="-14" dy="-11" (왼쪽 위)

  const feColorMatrix1 = document.createElementNS(svgNS, "feColorMatrix");
  feColorMatrix1.setAttribute("in", "SourceAlpha");
  feColorMatrix1.setAttribute("type", "matrix");
  feColorMatrix1.setAttribute(
    "values",
    "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
  );
  feColorMatrix1.setAttribute("result", "hardAlpha");
  innerShadowFilter.appendChild(feColorMatrix1);

  const feOffset1 = document.createElementNS(svgNS, "feOffset");
  feOffset1.setAttribute("dx", "-14");
  feOffset1.setAttribute("dy", "-11");
  innerShadowFilter.appendChild(feOffset1);

  const feGaussian1 = document.createElementNS(svgNS, "feGaussianBlur");
  feGaussian1.setAttribute("stdDeviation", "2");
  innerShadowFilter.appendChild(feGaussian1);

  const feComposite1 = document.createElementNS(svgNS, "feComposite");
  feComposite1.setAttribute("in2", "hardAlpha");
  feComposite1.setAttribute("operator", "arithmetic");
  feComposite1.setAttribute("k2", "-1");
  feComposite1.setAttribute("k3", "1");
  innerShadowFilter.appendChild(feComposite1);

  const feColorMatrix2 = document.createElementNS(svgNS, "feColorMatrix");
  feColorMatrix2.setAttribute("type", "matrix");
  feColorMatrix2.setAttribute(
    "values",
    "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
  );
  innerShadowFilter.appendChild(feColorMatrix2);

  const feBlend1 = document.createElementNS(svgNS, "feBlend");
  feBlend1.setAttribute("mode", "normal");
  feBlend1.setAttribute("in2", "shape");
  feBlend1.setAttribute("result", "effect1_innerShadow");
  innerShadowFilter.appendChild(feBlend1);

  // === 두 번째 Inner Shadow (밝은 하이라이트) ===
  // dx="11" dy="6" (오른쪽 아래)

  const feColorMatrix3 = document.createElementNS(svgNS, "feColorMatrix");
  feColorMatrix3.setAttribute("in", "SourceAlpha");
  feColorMatrix3.setAttribute("type", "matrix");
  feColorMatrix3.setAttribute(
    "values",
    "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
  );
  feColorMatrix3.setAttribute("result", "hardAlpha");
  innerShadowFilter.appendChild(feColorMatrix3);

  const feOffset2 = document.createElementNS(svgNS, "feOffset");
  feOffset2.setAttribute("dx", "11");
  feOffset2.setAttribute("dy", "6");
  innerShadowFilter.appendChild(feOffset2);

  const feGaussian2 = document.createElementNS(svgNS, "feGaussianBlur");
  feGaussian2.setAttribute("stdDeviation", "2");
  innerShadowFilter.appendChild(feGaussian2);

  const feComposite2 = document.createElementNS(svgNS, "feComposite");
  feComposite2.setAttribute("in2", "hardAlpha");
  feComposite2.setAttribute("operator", "arithmetic");
  feComposite2.setAttribute("k2", "-1");
  feComposite2.setAttribute("k3", "1");
  innerShadowFilter.appendChild(feComposite2);

  const feColorMatrix4 = document.createElementNS(svgNS, "feColorMatrix");
  feColorMatrix4.setAttribute("type", "matrix");
  feColorMatrix4.setAttribute(
    "values",
    "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
  );
  innerShadowFilter.appendChild(feColorMatrix4);

  const feBlend2 = document.createElementNS(svgNS, "feBlend");
  feBlend2.setAttribute("mode", "normal");
  feBlend2.setAttribute("in2", "effect1_innerShadow");
  feBlend2.setAttribute("result", "effect2_innerShadow");
  innerShadowFilter.appendChild(feBlend2);

  defs.appendChild(innerShadowFilter);

  // ⭐ 호버용 필터 (위쪽에만 어두운 그림자)
  const hoverShadowFilter = document.createElementNS(svgNS, "filter");
  hoverShadowFilter.setAttribute("id", "hover-shadow-effect");
  hoverShadowFilter.setAttribute("x", "-50%");
  hoverShadowFilter.setAttribute("y", "-50%");
  hoverShadowFilter.setAttribute("width", "200%");
  hoverShadowFilter.setAttribute("height", "200%");

  // 위쪽 어두운 그림자만
  const feGaussianHover = document.createElementNS(svgNS, "feGaussianBlur");
  feGaussianHover.setAttribute("in", "SourceAlpha");
  feGaussianHover.setAttribute("stdDeviation", "4");
  feGaussianHover.setAttribute("result", "blurHover");
  hoverShadowFilter.appendChild(feGaussianHover);

  const feOffsetHover = document.createElementNS(svgNS, "feOffset");
  feOffsetHover.setAttribute("in", "blurHover");
  feOffsetHover.setAttribute("dx", "0"); // 가로 이동 없음
  feOffsetHover.setAttribute("dy", "-10"); // 위쪽으로 그림자
  feOffsetHover.setAttribute("result", "offsetBlurHover");
  hoverShadowFilter.appendChild(feOffsetHover);

  const feFloodHover = document.createElementNS(svgNS, "feFlood");
  feFloodHover.setAttribute("flood-color", "rgba(0, 0, 0, 0.5)");
  feFloodHover.setAttribute("result", "floodColorHover");
  hoverShadowFilter.appendChild(feFloodHover);

  const feCompositeHover = document.createElementNS(svgNS, "feComposite");
  feCompositeHover.setAttribute("in", "floodColorHover");
  feCompositeHover.setAttribute("in2", "offsetBlurHover");
  feCompositeHover.setAttribute("operator", "in");
  feCompositeHover.setAttribute("result", "shadowHover");
  hoverShadowFilter.appendChild(feCompositeHover);

  const feCompositeHoverClip = document.createElementNS(svgNS, "feComposite");
  feCompositeHoverClip.setAttribute("in", "shadowHover");
  feCompositeHoverClip.setAttribute("in2", "SourceAlpha");
  feCompositeHoverClip.setAttribute("operator", "in");
  feCompositeHoverClip.setAttribute("result", "innerShadowHover");
  hoverShadowFilter.appendChild(feCompositeHoverClip);

  const feMergeHover = document.createElementNS(svgNS, "feMerge");

  const feMergeNodeHover1 = document.createElementNS(svgNS, "feMergeNode");
  feMergeNodeHover1.setAttribute("in", "SourceGraphic");
  feMergeHover.appendChild(feMergeNodeHover1);

  const feMergeNodeHover2 = document.createElementNS(svgNS, "feMergeNode");
  feMergeNodeHover2.setAttribute("in", "innerShadowHover");
  feMergeHover.appendChild(feMergeNodeHover2);

  hoverShadowFilter.appendChild(feMergeHover);
  defs.appendChild(hoverShadowFilter);

  svg.appendChild(defs);

  // 이미지 패턴 생성
  const images = {
    base: "./assets/images/onboarding/bg_piece.png",
    completed: "./assets/images/onboarding/bg_piece_completed.png",
    allCompleted: "./assets/images/onboarding/bg_piece_all_completed.png",
  };

  pieces.forEach((piece) => {
    // 1. 기본 상태 패턴 (전체 이미지의 일부)
    createPattern(svgNS, defs, `bg-image-${piece.id}`, images.base, false);

    // 2. 호버 상태 패턴 (유튜브 썸네일 - 조각 크기에 맞춤)
    const videoId = videoUrls[piece.id];
    const thumbnailUrl = videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : images.base;
    createPattern(
      svgNS,
      defs,
      `bg-image-hover-${piece.id}`,
      thumbnailUrl,
      true
    );

    // 3. 완료 상태 패턴 (전체 이미지의 일부)
    createPattern(
      svgNS,
      defs,
      `bg-image-completed-${piece.id}`,
      images.completed,
      false
    );

    // 4. 전체 완료 상태 패턴 (전체 이미지의 일부)
    createPattern(
      svgNS,
      defs,
      `bg-image-all-completed-${piece.id}`,
      images.allCompleted,
      false
    );
  });

  // 보드 배경
  const boardPaths = [
    {
      d: "M703.993 381.536L723.919 10.5389C724.226 4.81364 719.667 0.00266044 713.933 0.00263375L156.183 3.71752e-05C151.512 1.54325e-05 147.464 3.23277 146.43 7.78739L62.2553 378.787C60.8358 385.044 65.5917 391 72.0074 391H206.029H694.007C699.322 391 703.708 386.843 703.993 381.536Z",
      fill: "url(#board_fill_1)",
    },
    {
      d: "M715.463 185.541L723.546 9.54123C723.791 4.20239 728.191 0 733.535 0H1722.28C1727.05 0 1731.15 3.36972 1732.09 8.04852L1767.1 184.049C1768.34 190.234 1763.6 196 1757.3 196H1534.35H725.452C719.749 196 715.201 191.238 715.463 185.541Z",
      fill: "url(#board_fill_2)",
    },
    {
      d: "M1139.73 645.293L1122.14 397.293C1121.77 392.058 1117.42 388 1112.17 388H70.206C65.5347 388 61.4858 391.234 60.4533 395.79L4.25149 643.79C2.83375 650.046 7.58954 656 14.0042 656H86.649H1129.75C1135.55 656 1140.14 651.08 1139.73 645.293Z",
      fill: "url(#board_fill_3)",
    },
    {
      d: "M1139.6 646.401L1121.9 207.399C1121.67 201.723 1126.21 196.996 1131.9 196.996H1761.43C1766.22 196.996 1770.33 200.382 1771.25 205.076L1857.15 644.078C1858.36 650.254 1853.63 655.998 1847.34 655.998H1627.13H1149.59C1144.22 655.998 1139.81 651.763 1139.6 646.401Z",
      fill: "url(#board_fill_4)",
    },
  ];

  boardPaths.forEach((board) => {
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", board.d);
    path.setAttribute("fill", board.fill);
    svg.appendChild(path);
  });

  // 퍼즐 조각 생성
  pieces.forEach((piece) => {
    const group = document.createElementNS(svgNS, "g");
    group.classList.add("puzzle-piece-group");
    group.setAttribute("data-piece", piece.id);
    group.setAttribute("data-title", piece.title);

    const currentUrl = window.location.href.split("#")[0];

    // 1. 기본 상태 이미지
    const baseImagePath = document.createElementNS(svgNS, "path");
    baseImagePath.setAttribute("d", piece.path);
    baseImagePath.setAttribute("class", "piece-base-image");
    baseImagePath.setAttribute(
      "fill",
      `url(${currentUrl}#bg-image-${piece.id})`
    );
    baseImagePath.setAttribute("fill-opacity", "1.0");
    baseImagePath.setAttribute("stroke", "#333");
    baseImagePath.setAttribute("stroke-width", "1");
    group.appendChild(baseImagePath);

    // 2. 호버 상태 이미지 (유튜브 썸네일)
    const hoverImagePath = document.createElementNS(svgNS, "path");
    hoverImagePath.setAttribute("d", piece.path);
    hoverImagePath.setAttribute("class", "piece-hover-image");
    hoverImagePath.setAttribute(
      "fill",
      `url(${currentUrl}#bg-image-hover-${piece.id})`
    );
    hoverImagePath.setAttribute("fill-opacity", "0");
    hoverImagePath.setAttribute("stroke", "#333");
    hoverImagePath.setAttribute("stroke-width", "1");
    hoverImagePath.style.transition = "fill-opacity 0.3s ease";
    group.appendChild(hoverImagePath);

    // 3. 완료 상태 이미지
    const completedImagePath = document.createElementNS(svgNS, "path");
    completedImagePath.setAttribute("d", piece.path);
    completedImagePath.setAttribute("class", "piece-completed-image");
    completedImagePath.setAttribute(
      "fill",
      `url(${currentUrl}#bg-image-completed-${piece.id})`
    );
    completedImagePath.setAttribute("fill-opacity", "1.0");
    completedImagePath.setAttribute("stroke", "#333");
    completedImagePath.setAttribute("stroke-width", "1");
    completedImagePath.style.display = "none";
    group.appendChild(completedImagePath);

    // 4. 전체 완료 상태 이미지
    const allCompletedImagePath = document.createElementNS(svgNS, "path");
    allCompletedImagePath.setAttribute("d", piece.path);
    allCompletedImagePath.setAttribute("class", "piece-all-completed-image");
    allCompletedImagePath.setAttribute(
      "fill",
      `url(${currentUrl}#bg-image-all-completed-${piece.id})`
    );
    allCompletedImagePath.setAttribute("fill-opacity", "1.0");
    allCompletedImagePath.setAttribute("stroke", "#333");
    allCompletedImagePath.setAttribute("stroke-width", "1");
    allCompletedImagePath.style.display = "none";
    group.appendChild(allCompletedImagePath);

    // 오버레이
    const overlayBase = document.createElementNS(svgNS, "path");
    overlayBase.setAttribute("d", piece.path);
    overlayBase.classList.add("piece-overlay-base");
    group.appendChild(overlayBase);

    const overlayHover = document.createElementNS(svgNS, "path");
    overlayHover.setAttribute("d", piece.path);
    overlayHover.classList.add("piece-overlay-hover");
    group.appendChild(overlayHover);

    // 호버 이벤트
    group.addEventListener("mouseenter", function () {
      if (!this.classList.contains("completed")) {
        const hoverImg = this.querySelector(".piece-hover-image");
        const overlayBase = this.querySelector(".piece-overlay-base");
        if (hoverImg) {
          hoverImg.setAttribute("fill-opacity", "1.0");
          // ⭐ 호버 시 엠보싱 효과 적용
          hoverImg.setAttribute("filter", "url(#inner-shadow-effect)");
        }
        // ⭐ 호버 시 색상 오버레이 숨김
        if (overlayBase) {
          overlayBase.style.display = "none";
        }
      }
    });

    group.addEventListener("mouseleave", function () {
      if (!this.classList.contains("completed")) {
        const hoverImg = this.querySelector(".piece-hover-image");
        const overlayBase = this.querySelector(".piece-overlay-base");
        if (hoverImg) {
          hoverImg.setAttribute("fill-opacity", "0");
          // ⭐ 호버 종료 시 필터 제거
          hoverImg.removeAttribute("filter");
        }
        // ⭐ 호버 종료 시 색상 오버레이 다시 표시
        if (overlayBase) {
          overlayBase.style.display = "block";
        }
      }
    });

    // 클릭 이벤트
    group.addEventListener("click", function () {
      const pieceId = this.getAttribute("data-piece");
      const pieceTitle = this.getAttribute("data-title");
      openVideoModal(pieceId, pieceTitle, this);
    });

    svg.appendChild(group);
  });

  puzzleBoard.appendChild(svg);

  // ⭐ 퍼즐 조각 위에 타이틀 추가
  addPieceTitles();
}

// 퍼즐 조각 위에 타이틀 추가 함수
function addPieceTitles() {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = puzzleBoard.querySelector("svg");

  // 각 조각의 중심 좌표와 텍스트 줄바꿈 설정
  const titlePositions = [
    { id: 1, x: 430, y: 490, lines: ["왜 다워인인가 (최재천교수)"] },
    { id: 2, x: 915, y: 100, lines: ["새로운 시대 준비된 우리"] },
    { id: 3, x: 1320, y: 100, lines: ["기술개발센터소개"] },
    { id: 4, x: 1340, y: 290, lines: ["건설산업의 디지털 전환을"] },
    { id: 5, x: 915, y: 290, lines: ["상용 S/W 소개"] },
    { id: 6, x: 910, y: 515, lines: ["축적의 시간"] },
    { id: 7, x: 1370, y: 515, lines: ["회사생활 (경력)"] },
    { id: 8, x: 1660, y: 320, lines: ["회사생활", "(신규입사자편)"] },
    { id: 9, x: 560, y: 200, lines: ["한맥가족 소개", "및 경영이념"] },
    { id: 10, x: 260, y: 290, lines: ["삼안 소개"] },
  ];

  titlePositions.forEach((pos) => {
    const piece = pieces.find((p) => p.id === pos.id);
    if (!piece) return;

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", pos.x);
    text.setAttribute("y", pos.y);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "black");
    text.setAttribute("stroke", "white");
    text.setAttribute("stroke-width", "8");
    text.setAttribute("stroke-linejoin", "round");
    text.setAttribute("stroke-linecap", "round");
    text.setAttribute("paint-order", "stroke fill");
    text.setAttribute("font-size", "30");
    text.setAttribute("font-weight", "bold");
    text.setAttribute("pointer-events", "none");

    // 여러 줄 처리
    const lineHeight = 36; // 줄 간격
    const totalHeight = (pos.lines.length - 1) * lineHeight;
    const startY = pos.y - totalHeight / 2;

    pos.lines.forEach((line, index) => {
      const tspan = document.createElementNS(svgNS, "tspan");
      tspan.setAttribute("x", pos.x);
      tspan.setAttribute("dy", index === 0 ? 0 : lineHeight);
      tspan.textContent = line;
      text.appendChild(tspan);
    });

    svg.appendChild(text);
  });
}

// 패턴 생성 헬퍼 함수
function createPattern(svgNS, defs, patternId, imageUrl, isThumbnail = false) {
  const pattern = document.createElementNS(svgNS, "pattern");
  pattern.setAttribute("id", patternId);

  const image = document.createElementNS(svgNS, "image");

  if (isThumbnail) {
    // 호버용 썸네일: 조각 크기에 맞춤
    pattern.setAttribute("patternUnits", "objectBoundingBox");
    pattern.setAttribute("patternContentUnits", "objectBoundingBox");
    pattern.setAttribute("width", "1");
    pattern.setAttribute("height", "1");

    image.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      imageUrl
    );
    image.setAttribute("href", imageUrl);
    image.setAttribute("x", "0");
    image.setAttribute("y", "0");
    image.setAttribute("width", "1");
    image.setAttribute("height", "1");
    image.setAttribute("preserveAspectRatio", "xMidYMid slice"); // 조각에 맞춰서 자름
  } else {
    // 전체 이미지: 전체 좌표계 기준
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("patternContentUnits", "userSpaceOnUse");
    pattern.setAttribute("x", "0");
    pattern.setAttribute("y", "0");
    pattern.setAttribute("width", "1862");
    pattern.setAttribute("height", "664");

    image.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      imageUrl
    );
    image.setAttribute("href", imageUrl);
    image.setAttribute("x", "0");
    image.setAttribute("y", "0");
    image.setAttribute("width", "1862");
    image.setAttribute("height", "664");
    image.setAttribute("preserveAspectRatio", "none");
  }

  pattern.appendChild(image);
  defs.appendChild(pattern);
}

// 비디오 모달 열기
function openVideoModal(pieceId, pieceTitle, pieceElement) {
  console.log(`조각 ${pieceId} (${pieceTitle}) 클릭됨`);

  fetch("./_modal/video-onboarding.html")
    .then((response) => {
      if (!response.ok) throw new Error("모달 로드 실패");
      return response.text();
    })
    .then((modalHTML) => {
      const existingModal = document.querySelector(".modal.video");
      if (existingModal) existingModal.remove();

      document.body.insertAdjacentHTML("beforeend", modalHTML);
      const modal = document.querySelector(".modal.video");
      modal.style.display = "block";

      const iframe = modal.querySelector("#videoFrame");
      if (iframe && videoUrls[pieceId]) {
        iframe.src = `https://www.youtube.com/embed/${videoUrls[pieceId]}?autoplay=1`;
      }

      const titleElement = modal.querySelector(".tit-box h3");
      if (titleElement) {
        titleElement.textContent = pieceTitle;
      }

      setupModalCloseEvents(modal, pieceId, pieceElement);
    })
    .catch((error) => {
      console.error("모달 로드 오류:", error);
      markPieceComplete(pieceId, pieceElement);
    });
}

// 모달 닫기
function setupModalCloseEvents(modal, pieceId, pieceElement) {
  const closeBtn = modal.querySelector(".close");

  const closeModal = () => {
    const iframe = modal.querySelector("#videoFrame");
    if (iframe) iframe.src = "";

    modal.style.opacity = "0";
    setTimeout(() => modal.remove(), 300);

    markPieceComplete(pieceId, pieceElement);
  };

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

// 완료 처리
function markPieceComplete(pieceId, pieceElement) {
  if (!pieceElement.classList.contains("completed")) {
    pieceElement.classList.add("completed");

    const baseImage = pieceElement.querySelector(".piece-base-image");
    const hoverImage = pieceElement.querySelector(".piece-hover-image");
    const completedImage = pieceElement.querySelector(".piece-completed-image");

    if (baseImage) baseImage.style.display = "none";
    if (hoverImage) hoverImage.style.display = "none";
    if (completedImage) {
      completedImage.style.display = "block";
      completedImage.setAttribute(
        "filter",
        "url(#inner-shadow-effect) url(#completed-effect)"
      );
    }

    completed++;
    updateProgress();

    if (completed === totalPieces) {
      puzzleBoard.classList.add("all-completed");
      document.querySelectorAll(".puzzle-piece-group").forEach((group) => {
        const baseImg = group.querySelector(".piece-base-image");
        const hoverImg = group.querySelector(".piece-hover-image");
        const completedImg = group.querySelector(".piece-completed-image");
        const allCompletedImg = group.querySelector(
          ".piece-all-completed-image"
        );

        if (baseImg) baseImg.style.display = "none";
        if (hoverImg) hoverImg.style.display = "none";
        if (completedImg) completedImg.style.display = "none";
        if (allCompletedImg) {
          allCompletedImg.style.display = "block";
          allCompletedImg.setAttribute(
            "filter",
            "url(#inner-shadow-effect) url(#completed-effect)"
          );
        }
      });

      setTimeout(showCelebration, 600);
    }
  }
}

function updateProgress() {
  const percentage = (completed / totalPieces) * 100;
  const progressFill = document.getElementById("progressFill");
  const completedCount = document.getElementById("completedCount");
  if (progressFill) progressFill.style.width = percentage + "%";
  if (completedCount) completedCount.textContent = completed;
}

function showCelebration() {
  const overlay = document.getElementById("overlay");
  const celebration = document.getElementById("celebration");
  if (overlay) overlay.classList.add("show");
  if (celebration) celebration.classList.add("show");
}

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

function initializeProgress(completedPieces) {
  completedPieces.forEach((pieceNum) => {
    const group = document.querySelector(`[data-piece="${pieceNum}"]`);
    if (group) {
      group.classList.add("completed");
      completed++;
    }
  });
  updateProgress();
}

document.addEventListener("DOMContentLoaded", function () {
  initializePuzzle();
  initializeOverlay();
});
