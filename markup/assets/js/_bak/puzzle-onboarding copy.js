// 퍼즐 온보딩 JavaScript
// puzzle-onboarding.js

// 퍼즐 조각 정보 (10개)
const pieces = [
  {
    id: 1,
    title: "축적의 시간",
    path: "M60.5 525.5L88.5 393L703.5 391L689.5 640H271L292 525.5H60.5Z",
  },
  {
    id: 2,
    title: "상용 S/W 소개",
    path: "M715 197L724 16L1112 16L1120 197H715Z",
  },
  {
    id: 3,
    title: "새로운 시대 준비된 우리",
    path: "M1120.5 197L1112 16H1511L1533 195L1120.5 197Z",
  },
  {
    id: 4,
    title: "기술개발센터 소개",
    path: "M1128 387.5L1120 197.5L1533.5 194L1560.5 387.5H1128Z",
  },
  {
    id: 5,
    title: "한맥가족 소개 및 경영이념",
    path: "M705.5 387.5L715.5 197.5L1120 197.876L1128 387.5H705.5Z",
  },
  {
    id: 6,
    title: "건설산업의 디지털 전환",
    path: "M691.5 640L705 391L1128 389.5L1138.5 640H691.5Z",
  },
  {
    id: 7,
    title: "회사생활 (신규입사자편)",
    path: "M1138 640L1128 389.5H1559.5L1599.5 640H1138Z",
  },
  {
    id: 8,
    title: "회사생활 (경력)",
    path: "M1569 455L1533.5 194.5H1752L1800 449.5L1569 455Z",
  },
  {
    id: 9,
    title: "가족사소개",
    path: "M359 17.5L335.5 192.5H426.5L401.5 389H702L723 17.5H359Z",
  },
  {
    id: 10,
    title: "왜 다워인인가 (최재천교수)",
    path: "M88.5 390L124 193H426L402.5 389L88.5 390Z",
  },
];

let completed = 0;
const totalPieces = pieces.length;
let puzzleBoard;

// SVG 생성
function initializePuzzle() {
  puzzleBoard = document.getElementById("puzzleBoard");

  // SVG 컨테이너 생성
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 1862 664");
  svg.setAttribute("fill", "none");

  // defs 추가 (그라디언트)
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

  // ⭐ 완료 상태 필터 추가 (inner shadow + drop shadow)

  // 1. Drop Shadow 필터 (외부 그림자)
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

  // 2. Inner Shadow 필터 (내부 그림자 - 조각 안쪽)
  const innerShadowFilter = document.createElementNS(svgNS, "filter");
  innerShadowFilter.setAttribute("id", "inner-shadow-effect");
  innerShadowFilter.setAttribute("x", "-50%");
  innerShadowFilter.setAttribute("y", "-50%");
  innerShadowFilter.setAttribute("width", "200%");
  innerShadowFilter.setAttribute("height", "200%");

  // 원본 소스 저장
  const feSourceGraphic = document.createElementNS(svgNS, "feImage");
  feSourceGraphic.setAttribute("result", "source");

  // 밝은 inner shadow (왼쪽 상단 = top/left에 밝은 하이라이트)
  const feGaussian1 = document.createElementNS(svgNS, "feGaussianBlur");
  feGaussian1.setAttribute("in", "SourceAlpha");
  feGaussian1.setAttribute("stdDeviation", "4");
  feGaussian1.setAttribute("result", "blur1");
  innerShadowFilter.appendChild(feGaussian1);

  const feOffset1 = document.createElementNS(svgNS, "feOffset");
  feOffset1.setAttribute("in", "blur1");
  feOffset1.setAttribute("dx", "-10"); // 음수 = 왼쪽
  feOffset1.setAttribute("dy", "-10"); // 음수 = 위쪽
  feOffset1.setAttribute("result", "offsetBlur1");
  innerShadowFilter.appendChild(feOffset1);

  const feFlood1 = document.createElementNS(svgNS, "feFlood");
  feFlood1.setAttribute("flood-color", "rgba(255, 255, 255, 0.4)"); // 반투명 흰색
  feFlood1.setAttribute("result", "floodColor1");
  innerShadowFilter.appendChild(feFlood1);

  const feComposite1 = document.createElementNS(svgNS, "feComposite");
  feComposite1.setAttribute("in", "floodColor1");
  feComposite1.setAttribute("in2", "offsetBlur1");
  feComposite1.setAttribute("operator", "in");
  feComposite1.setAttribute("result", "shadow1");
  innerShadowFilter.appendChild(feComposite1);

  // 조각 형태로 클립 (안쪽만)
  const feComposite1Clip = document.createElementNS(svgNS, "feComposite");
  feComposite1Clip.setAttribute("in", "shadow1");
  feComposite1Clip.setAttribute("in2", "SourceAlpha");
  feComposite1Clip.setAttribute("operator", "in");
  feComposite1Clip.setAttribute("result", "innerShadow1");
  innerShadowFilter.appendChild(feComposite1Clip);

  // 어두운 inner shadow (오른쪽 하단 = bottom/right에 어두운 그림자)
  const feGaussian2 = document.createElementNS(svgNS, "feGaussianBlur");
  feGaussian2.setAttribute("in", "SourceAlpha");
  feGaussian2.setAttribute("stdDeviation", "3");
  feGaussian2.setAttribute("result", "blur2");
  innerShadowFilter.appendChild(feGaussian2);

  const feOffset2 = document.createElementNS(svgNS, "feOffset");
  feOffset2.setAttribute("in", "blur2");
  feOffset2.setAttribute("dx", "8"); // 양수 = 오른쪽
  feOffset2.setAttribute("dy", "8"); // 양수 = 아래쪽
  feOffset2.setAttribute("result", "offsetBlur2");
  innerShadowFilter.appendChild(feOffset2);

  const feFlood2 = document.createElementNS(svgNS, "feFlood");
  feFlood2.setAttribute("flood-color", "rgba(0, 0, 0, 0.5)");
  feFlood2.setAttribute("result", "floodColor2");
  innerShadowFilter.appendChild(feFlood2);

  const feComposite2 = document.createElementNS(svgNS, "feComposite");
  feComposite2.setAttribute("in", "floodColor2");
  feComposite2.setAttribute("in2", "offsetBlur2");
  feComposite2.setAttribute("operator", "in");
  feComposite2.setAttribute("result", "shadow2");
  innerShadowFilter.appendChild(feComposite2);

  // 조각 형태로 클립 (안쪽만)
  const feComposite2Clip = document.createElementNS(svgNS, "feComposite");
  feComposite2Clip.setAttribute("in", "shadow2");
  feComposite2Clip.setAttribute("in2", "SourceAlpha");
  feComposite2Clip.setAttribute("operator", "in");
  feComposite2Clip.setAttribute("result", "innerShadow2");
  innerShadowFilter.appendChild(feComposite2Clip);

  // 모든 요소 합치기
  const feMerge = document.createElementNS(svgNS, "feMerge");

  const feMergeNode1 = document.createElementNS(svgNS, "feMergeNode");
  feMergeNode1.setAttribute("in", "SourceGraphic");
  feMerge.appendChild(feMergeNode1);

  const feMergeNode2 = document.createElementNS(svgNS, "feMergeNode");
  feMergeNode2.setAttribute("in", "innerShadow1");
  feMerge.appendChild(feMergeNode2);

  const feMergeNode3 = document.createElementNS(svgNS, "feMergeNode");
  feMergeNode3.setAttribute("in", "innerShadow2");
  feMerge.appendChild(feMergeNode3);

  innerShadowFilter.appendChild(feMerge);
  defs.appendChild(innerShadowFilter);

  svg.appendChild(defs);

  // ⭐ 전체 이미지를 조각별로 나누기 (3가지 상태)
  const images = {
    base: "./assets/images/bg_piece.png",
    completed: "./assets/images/bg_piece_completed.png",
    allCompleted: "./assets/images/bg_piece_all_completed.png",
  };

  pieces.forEach((piece, index) => {
    // 1. 기본 상태 패턴
    const patternBase = document.createElementNS(svgNS, "pattern");
    patternBase.setAttribute("id", `bg-image-${piece.id}`);
    patternBase.setAttribute("patternUnits", "userSpaceOnUse");
    patternBase.setAttribute("patternContentUnits", "userSpaceOnUse");
    patternBase.setAttribute("x", "0");
    patternBase.setAttribute("y", "0");
    patternBase.setAttribute("width", "1862");
    patternBase.setAttribute("height", "664");

    const imageBase = document.createElementNS(svgNS, "image");
    imageBase.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      images.base
    );
    imageBase.setAttribute("href", images.base);
    imageBase.setAttribute("x", "0");
    imageBase.setAttribute("y", "0");
    imageBase.setAttribute("width", "1862");
    imageBase.setAttribute("height", "664");
    imageBase.setAttribute("preserveAspectRatio", "none");

    patternBase.appendChild(imageBase);
    defs.appendChild(patternBase);

    // 2. 개별 완료 상태 패턴
    const patternCompleted = document.createElementNS(svgNS, "pattern");
    patternCompleted.setAttribute("id", `bg-image-completed-${piece.id}`);
    patternCompleted.setAttribute("patternUnits", "userSpaceOnUse");
    patternCompleted.setAttribute("patternContentUnits", "userSpaceOnUse");
    patternCompleted.setAttribute("x", "0");
    patternCompleted.setAttribute("y", "0");
    patternCompleted.setAttribute("width", "1862");
    patternCompleted.setAttribute("height", "664");

    const imageCompleted = document.createElementNS(svgNS, "image");
    imageCompleted.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      images.completed
    );
    imageCompleted.setAttribute("href", images.completed);
    imageCompleted.setAttribute("x", "0");
    imageCompleted.setAttribute("y", "0");
    imageCompleted.setAttribute("width", "1862");
    imageCompleted.setAttribute("height", "664");
    imageCompleted.setAttribute("preserveAspectRatio", "none");

    patternCompleted.appendChild(imageCompleted);
    defs.appendChild(patternCompleted);

    // 3. 전체 완료 상태 패턴
    const patternAllCompleted = document.createElementNS(svgNS, "pattern");
    patternAllCompleted.setAttribute(
      "id",
      `bg-image-all-completed-${piece.id}`
    );
    patternAllCompleted.setAttribute("patternUnits", "userSpaceOnUse");
    patternAllCompleted.setAttribute("patternContentUnits", "userSpaceOnUse");
    patternAllCompleted.setAttribute("x", "0");
    patternAllCompleted.setAttribute("y", "0");
    patternAllCompleted.setAttribute("width", "1862");
    patternAllCompleted.setAttribute("height", "664");

    const imageAllCompleted = document.createElementNS(svgNS, "image");
    imageAllCompleted.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      images.allCompleted
    );
    imageAllCompleted.setAttribute("href", images.allCompleted);
    imageAllCompleted.setAttribute("x", "0");
    imageAllCompleted.setAttribute("y", "0");
    imageAllCompleted.setAttribute("width", "1862");
    imageAllCompleted.setAttribute("height", "664");
    imageAllCompleted.setAttribute("preserveAspectRatio", "none");

    patternAllCompleted.appendChild(imageAllCompleted);
    defs.appendChild(patternAllCompleted);
  });

  // 보드 배경 (4개의 색상 영역)
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

  // 퍼즐 조각들 생성
  pieces.forEach((piece, index) => {
    const group = document.createElementNS(svgNS, "g");
    group.classList.add("puzzle-piece-group");
    group.setAttribute("data-piece", piece.id);
    group.setAttribute("data-title", piece.title);

    // 이미지 레이어 (3개 - 기본, 완료, 전체완료)
    const currentUrl = window.location.href.split("#")[0];

    // 배경색 레이어 (미완료 상태에만 표시)
    const bgColorPath = document.createElementNS(svgNS, "path");
    bgColorPath.setAttribute("d", piece.path);
    bgColorPath.setAttribute("class", "piece-bg-color");
    bgColorPath.setAttribute("fill", "#fff"); // 조각별 색상
    bgColorPath.setAttribute("fill-opacity", "0. "); // 투명도 조절
    group.appendChild(bgColorPath);

    // 1. 기본 상태 이미지
    const baseImagePath = document.createElementNS(svgNS, "path");
    baseImagePath.setAttribute("d", piece.path);
    baseImagePath.setAttribute("class", "piece-base-image");
    baseImagePath.setAttribute(
      "fill",
      `url(${currentUrl}#bg-image-${piece.id})`
    );
    baseImagePath.setAttribute("fill-opacity", "1.0"); // 완전 불투명
    baseImagePath.setAttribute("stroke", "#333");
    baseImagePath.setAttribute("stroke-width", "1");
    group.appendChild(baseImagePath);

    // 2. 개별 완료 상태 이미지
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

    // 3. 전체 완료 상태 이미지
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

    // 기본 오버레이 (완료 시 밝게)
    const overlayBase = document.createElementNS(svgNS, "path");
    overlayBase.setAttribute("d", piece.path);
    overlayBase.classList.add("piece-overlay-base");
    group.appendChild(overlayBase);

    // 호버 오버레이 (어두운 효과)
    const overlayHover = document.createElementNS(svgNS, "path");
    overlayHover.setAttribute("d", piece.path);
    overlayHover.classList.add("piece-overlay-hover");
    group.appendChild(overlayHover);

    // 클릭 이벤트
    group.addEventListener("click", function () {
      const pieceId = this.getAttribute("data-piece");
      const pieceTitle = this.getAttribute("data-title");
      markPieceComplete(pieceId, this);
    });

    svg.appendChild(group);
  });

  puzzleBoard.appendChild(svg);
}

// 퍼즐 조각 완료 처리
function markPieceComplete(pieceId, pieceElement) {
  if (!pieceElement.classList.contains("completed")) {
    pieceElement.classList.add("completed");

    const baseImage = pieceElement.querySelector(".piece-base-image");
    const completedImage = pieceElement.querySelector(".piece-completed-image");

    if (baseImage) baseImage.style.display = "none";
    if (completedImage) {
      completedImage.style.display = "block";
      // ⭐ 완료 시 필터 효과 적용
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
        const completedImg = group.querySelector(".piece-completed-image");
        const allCompletedImg = group.querySelector(
          ".piece-all-completed-image"
        );

        if (baseImg) baseImg.style.display = "none";
        if (completedImg) completedImg.style.display = "none";
        if (allCompletedImg) {
          allCompletedImg.style.display = "block";
          // ⭐ 전체 완료 시에도 필터 효과 적용
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

// 진행률 업데이트
function updateProgress() {
  const percentage = (completed / totalPieces) * 100;
  document.getElementById("progressFill").style.width = percentage + "%";
  document.getElementById("completedCount").textContent = completed;
}

// 축하 메시지 표시
function showCelebration() {
  document.getElementById("overlay").classList.add("show");
  document.getElementById("celebration").classList.add("show");
}

// 오버레이 클릭 이벤트
function initializeOverlay() {
  document.getElementById("overlay").addEventListener("click", function () {
    this.classList.remove("show");
    document.getElementById("celebration").classList.remove("show");
  });
}

// 초기화 함수 - 이미 완료된 콘텐츠 설정
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

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", function () {
  initializePuzzle();
  initializeOverlay();

  // 테스트: 일부 조각을 완료 상태로 초기화
  // initializeProgress([1, 3, 5]);
});
