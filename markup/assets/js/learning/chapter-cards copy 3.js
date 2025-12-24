/**
 * 챕터 카드 관리 클래스
 */
class ChapterCardManager {
  constructor(config, gaugeManager) {
    this.config = config;
    this.gaugeManager = gaugeManager;
    this.chapterCards = [];
    this.cardsContainer = null;
  }

  /**
   * 챕터 카드 생성
   */
  createChapterCards() {
    // 챕터 카드 컨테이너 생성 또는 가져오기
    this.cardsContainer = document.querySelector(".chapter-list");
    if (!this.cardsContainer) {
      this.cardsContainer = document.createElement("ul");
      this.cardsContainer.className = "chapter-list";
      document
        .querySelector(".learning-gauge")
        .appendChild(this.cardsContainer);
    }

    // 기존 카드 제거
    this.cardsContainer.innerHTML = "";

    // 각 챕터의 첫 번째 마커(챕터 마커) 위치에 카드 생성
    this.config.chapters.forEach((chapter, chapterIndex) => {
      const chapterLesson = chapter.lessons[0]; // 챕터 마커
      if (chapterLesson && chapterLesson.type === "chapter") {
        this._createCard(chapter, chapterIndex, chapterLesson);
      }
    });

    console.log(
      `[ChapterCardManager] ${this.chapterCards.length}개의 챕터 카드 생성 완료`
    );
  }

  /**
   * 개별 챕터 카드 생성
   * @private
   */
  _createCard(chapter, chapterIndex, chapterLesson) {
    const li = document.createElement("li");

    // 챕터 상태 결정
    const state = this._getChapterState(chapter);
    li.className = state; // 'completed', 'current', 또는 빈 문자열

    // SVG 카드 생성
    const svg = this._createSVG(chapter, state, chapterIndex);
    li.appendChild(svg);

    // 위치 설정 (챕터 마커 위치 기준)
    this._positionCard(li, chapterLesson);

    this.cardsContainer.appendChild(li);

    this.chapterCards.push({
      element: li,
      chapter: chapter,
      state: state,
      chapterIndex: chapterIndex,
    });
  }

  /**
   * 챕터 상태 결정
   * @private
   */
  _getChapterState(chapter) {
    const allCompleted = chapter.lessons.every((lesson) => lesson.completed);
    const someCompleted = chapter.lessons.some((lesson) => lesson.completed);

    // 챕터의 첫 번째 레슨(챕터 마커)이 클릭 가능한지 확인
    const firstLesson = chapter.lessons[0];
    const isActive = this._isLessonActive(firstLesson);

    if (allCompleted) {
      return "completed"; // 전체 완료
    } else if (someCompleted) {
      return "current"; // 진행 중 (일부 완료)
    } else if (isActive) {
      return "current"; // 활성화 (클릭 가능)
    } else {
      return ""; // 미시작 (base)
    }
  }

  /**
   * 레슨이 활성화(클릭 가능) 상태인지 확인
   * @private
   */
  _isLessonActive(lesson) {
    // 전체 마커 배열에서 해당 레슨의 인덱스 찾기
    const allMarkers = this.config.getAllMarkers();
    const lessonIndex = allMarkers.findIndex(
      (m) => m.pathPercent === lesson.pathPercent && m.label === lesson.label
    );

    if (lessonIndex === -1) return false;

    // 첫 번째 레슨이거나, 이전 레슨이 완료된 경우 활성화
    if (lessonIndex === 0) return true;
    return allMarkers[lessonIndex - 1].completed;
  }

  /**
   * SVG 카드 생성
   * @private
   */
  _createSVG(chapter, state, chapterIndex) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    // 상태별 크기 및 viewBox 설정
    const svgConfig = this._getSVGConfig(state);
    svg.setAttribute("width", svgConfig.width);
    svg.setAttribute("height", svgConfig.height);
    svg.setAttribute("viewBox", svgConfig.viewBox);
    svg.setAttribute("fill", "none");

    // 이미지 URL (챕터별로 다른 이미지 사용 가능)
    const imageUrl = `./assets/images/learning/img_learning_${String(chapterIndex + 1).padStart(2, "0")}.jpg`;

    // 재생 버튼 색상 결정
    const playButtonColors = this._getPlayButtonColors(state);

    // 텍스트 색상 결정
    const textColor = this._getTextColor(state);

    // 그라데이션 opacity 결정
    const gradientOpacity = state === "completed" ? "1" : "0.2";

    // 그라데이션 정의
    const gradientDef = this._getGradientDefinition(state, chapterIndex);
    const gradientId = `grad_${chapterIndex}_${state}`;

    svg.innerHTML = `
      <!-- 그림자 -->
      <g opacity="0.4">
        <ellipse cx="${svgConfig.shadowCx}" cy="${svgConfig.shadowCy}" rx="${svgConfig.shadowRx}" ry="${svgConfig.shadowRy}" fill="#8A7D64" opacity="0.5" style="mix-blend-mode:multiply"/>
      </g>

      <!-- 말풍선 배경 -->
      <mask id="mask-${chapterIndex}-${state}" maskUnits="userSpaceOnUse" x="${svgConfig.maskX}" y="${svgConfig.maskY}" width="${svgConfig.maskWidth}" height="${svgConfig.maskHeight}" fill="#000">
        <path fill="#fff" d="M${svgConfig.maskX} ${svgConfig.maskY}h${svgConfig.maskWidth}v${svgConfig.maskHeight}h-${svgConfig.maskWidth}z"/>
        <path d="${svgConfig.balloonPath}"/>
      </mask>
      
      <path d="${svgConfig.balloonPath}" fill="#fff" fill-opacity="${svgConfig.bgOpacity}"/>
      <path d="${svgConfig.balloonPath}" fill="url(#${gradientId})" fill-opacity="${gradientOpacity}"/>
      <path d="${svgConfig.balloonStrokePath}" fill="url(#stroke_${gradientId})" fill-opacity="0.1" mask="url(#mask-${chapterIndex}-${state})"/>

      <!-- 이미지 영역 -->
      <defs>
        <mask id="screen-mask-${chapterIndex}-${state}">
          <path d="${svgConfig.screenPath}" fill="white"/>
        </mask>
      </defs>
      
      <image href="${imageUrl}" x="${svgConfig.imageX}" y="${svgConfig.imageY}" width="${svgConfig.imageWidth}" height="${svgConfig.imageHeight}" preserveAspectRatio="xMidYMid slice" mask="url(#screen-mask-${chapterIndex}-${state})"/>
      
      <!-- 어두운 오버레이 -->
      <path d="${svgConfig.screenPath}" fill="#6A5A4E" fill-opacity="0.3"/>

      <!-- 하단 텍스트 -->
      <text x="${svgConfig.textX}" y="${svgConfig.textY}" fill="${textColor}" font-size="${svgConfig.textSize}" font-weight="bold" text-anchor="middle" font-family="Arial, sans-serif">${chapter.name}</text>


      <!-- 재생 버튼 -->
      <circle cx="${svgConfig.playCx}" cy="${svgConfig.playCy}" r="19" fill="${playButtonColors.fill}" fill-opacity="${playButtonColors.opacity}"/>
      <circle cx="${svgConfig.playCx}" cy="${svgConfig.playCy}" r="18" stroke="white" stroke-opacity="0.3" stroke-width="2" fill="none"/>
      <path d="M${svgConfig.playPath}" fill="white"/>

      <defs>
        ${gradientDef}
      </defs>
    `;

    return svg;
  }

  /**
   * 상태별 SVG 설정 가져오기
   * @private
   */
  _getSVGConfig(state) {
    switch (state) {
      case "completed":
        return {
          width: "203",
          height: "152",
          viewBox: "0 0 203 152",
          shadowCx: "102",
          shadowCy: "146",
          shadowRx: "94",
          shadowRy: "5",
          maskX: "-.734",
          maskY: "-.734",
          maskWidth: "204",
          maskHeight: "153",
          balloonPath:
            "M191.139 1.266c5.592 0 10.127 4.534 10.127 10.127v114.746c0 5.592-4.535 10.127-10.127 10.127H108.56l-7.794 13-7.794-13h-81.58c-5.592 0-10.126-4.535-10.126-10.127V11.393C1.266 5.8 5.8 1.266 11.393 1.266h179.746z",
          balloonStrokePath:
            "M108.56 136.266V135h-.717l-.369.615 1.086.651zm-7.794 13l-1.086.651 1.086 1.81 1.085-1.81-1.085-.651zm-7.794-13l1.085-.651-.368-.615h-.717v1.266zm98.167-135V2.53A8.862 8.862 0 01200 11.393h2.531C202.531 5.1 197.43 0 191.139 0v1.266zm10.127 10.127H200v114.746h2.531V11.393h-1.265zm0 114.746H200a8.862 8.862 0 01-8.861 8.861v2.531c6.291 0 11.392-5.101 11.392-11.392h-1.265zm-10.127 10.127V135H108.56v2.531h82.579v-1.265zm-82.579 0l-1.086-.651-7.794 13 1.086.651 1.085.651 7.794-13-1.085-.651zm-7.794 13l1.085-.651-7.794-13-1.085.651-1.086.651 7.794 13 1.086-.651zm-7.794-13V135h-81.58v2.531h81.58v-1.265zm-81.58 0V135a8.862 8.862 0 01-8.86-8.861H0c0 6.291 5.1 11.392 11.393 11.392v-1.265zM1.267 126.139H2.53V11.393H0v114.746h1.266zm0-114.746H2.53a8.861 8.861 0 018.862-8.862V0C5.1 0 0 5.1 0 11.393h1.266zM11.393 1.266V2.53h179.746V0H11.393v1.266z",
          screenPath:
            "M1.266 13.554C1.266 6.768 6.768 1.266 13.554 1.266h175.423c6.787 0 12.289 5.502 12.289 12.288v90.712H1.266V13.554z",
          dividerPath: "M1.266 102.266h200v3h-200v-3z",
          imageX: "1.266",
          imageY: "1.266",
          imageWidth: "200",
          imageHeight: "103",
          textX: "101",
          textY: "127",
          textSize: "20",
          playCx: "101",
          playCy: "53",
          playPath: "107 53L95 60V46L107 53Z",
          bgOpacity: "0.9",
        };

      case "current":
        return {
          width: "338",
          height: "242",
          viewBox: "0 0 338 242",
          shadowCx: "169",
          shadowCy: "232",
          shadowRx: "156",
          shadowRy: "8",
          maskX: "0",
          maskY: "0",
          maskWidth: "338",
          maskHeight: "242",
          balloonPath:
            "M318.196 5C326.372 5 333 11.628 333 19.804v184.392c0 8.176-6.628 14.804-14.804 14.804H179.777L169 233l-10.777-14H19.803C11.629 219 5 212.372 5 204.196V19.804C5 11.628 11.628 5 19.804 5h298.392z",
          balloonStrokePath:
            "M179.777 219v-5h-2.461l-1.501 1.95 3.962 3.05zM169 233l-3.962 3.05 3.962 5.147 3.962-5.147L169 233zm-10.777-14l3.962-3.05-1.501-1.95h-2.461v5zM318.196 5v5c5.414 0 9.804 4.39 9.804 9.804h10C338 8.867 329.133 0 318.196 0v5zM333 19.804h-5v184.392h10V19.804h-5zm0 184.392h-5c0 5.414-4.39 9.804-9.804 9.804v10c10.937 0 19.804-8.867 19.804-19.804h-5zM318.196 219v-5H179.777v10h138.419v-5zm-138.419 0l-3.962-3.05-10.777 14L169 233l3.962 3.05 10.777-14-3.962-3.05zM169 233l3.962-3.05-10.777-14-3.962 3.05-3.962 3.05 10.777 14L169 233zm-10.777-14v-5H19.803v10h138.42v-5zm-138.42 0v-5C14.39 214 10 209.61 10 204.196H0C0 215.133 8.867 224 19.804 224v-5zM5 204.196h5V19.804H0v184.392h5zM5 19.804h5C10 14.39 14.39 10 19.804 10V0C8.867 0 0 8.867 0 19.804h5zM19.804 5v5h298.392V0H19.804v5z",
          screenPath:
            "M5 22.504C5 13.393 12.393 6 21.504 6h295.392C326.007 6 333.4 13.393 333.4 22.504v149.392H5V22.504z",
          dividerPath: "M5 169.896h328.4v5H5v-5z",
          imageX: "5",
          imageY: "6",
          imageWidth: "328",
          imageHeight: "164",
          textX: "169",
          textY: "203",
          textSize: "24",
          playCx: "169",
          playCy: "88",
          playPath: "180 88L162 98V78L180 88Z",
          bgOpacity: "1",
        };

      default: // base
        return {
          width: "142",
          height: "107",
          viewBox: "0 0 142 107",
          shadowCx: "70",
          shadowCy: "102",
          shadowRx: "66",
          shadowRy: "3",
          maskX: "-.113",
          maskY: "-.113",
          maskWidth: "142",
          maskHeight: "107",
          balloonPath:
            "M133.798.887a7.09 7.09 0 017.089 7.089v80.822a7.09 7.09 0 01-7.089 7.089H75.872l-5.485 9-5.486-9H7.976a7.089 7.089 0 01-7.09-7.09V7.977a7.09 7.09 0 017.09-7.09h125.822z",
          balloonStrokePath:
            "M75.872 95.887V95h-.498l-.259.425.757.46zm-5.485 9l-.757.461.757 1.241.756-1.241-.756-.461zm-5.486-9l.757-.461-.259-.425h-.498v.886zm68.897-95v.886a6.204 6.204 0 016.203 6.203h1.772A7.975 7.975 0 00133.798 0v.886zm7.089 7.089h-.886v80.822h1.772V7.976h-.886zm0 80.822h-.886A6.203 6.203 0 01133.798 95v1.772a7.975 7.975 0 007.975-7.975h-.886zm-7.089 7.089V95H75.872v1.772h57.926v-.886zm-57.926 0l-.757-.461-5.485 9 .757.461.756.461 5.486-9-.757-.461zm-5.485 9l.756-.461-5.485-9-.757.46-.756.462 5.485 9 .757-.461zm-5.486-9V95H7.976v1.772H64.9v-.886zm-56.925 0V95a6.203 6.203 0 01-6.203-6.203H0a7.975 7.975 0 007.975 7.975v-.886zm-7.09-7.09h.887V7.977H0v80.822h.886zm0-80.821h.887a6.203 6.203 0 016.203-6.203V0A7.975 7.975 0 000 7.976h.886zm7.09-7.09v.887h125.822V0H7.976v.886z",
          screenPath:
            "M.887 9.477C.887 4.88 4.88.887 9.477.887h123.322c4.597 0 8.49 3.993 8.49 8.59v56.71H.887V9.477z",
          imageX: ".887",
          imageY: ".887",
          imageWidth: "140",
          imageHeight: "70",
          textX: "70",
          textY: "90",
          textSize: "16",
          playCx: "70",
          playCy: "37",
          playPath: "75 37L66 42V32L75 37Z",
          bgOpacity: "0.2",
        };
    }
  }

  /**
   * 텍스트 색상 결정
   * @private
   */
  _getTextColor(state) {
    switch (state) {
      case "completed":
        return "#AB3D00"; // 주황색 - 완료
      case "current":
        return "#1D9B75"; // 초록색 - 진행중
      default:
        return "#7E7E7E"; // 회색 - 기본
    }
  }

  /**
   * 그라데이션 정의 가져오기
   * @private
   */
  _getGradientDefinition(state, chapterIndex) {
    const gradientId = `grad_${chapterIndex}_${state}`;
    const strokeGradientId = `stroke_${gradientId}`;

    switch (state) {
      case "completed":
        return `
          <linearGradient id="${gradientId}" x1="224.67" y1="39.884" x2="-20.902" y2="39.526" gradientUnits="userSpaceOnUse">
            <stop offset=".312" stop-color="#fff"/>
            <stop offset="1" stop-color="#EAD7CC"/>
          </linearGradient>
          <linearGradient id="${strokeGradientId}" x1="101" y1="0" x2="101" y2="140" gradientUnits="userSpaceOnUse">
            <stop stop-color="#fff" stop-opacity=".1"/>
            <stop offset="1" stop-color="#fff" stop-opacity=".1"/>
          </linearGradient>
        `;
      case "current":
        return `
          <linearGradient id="${gradientId}" x1="169" y1="126.673" x2="169" y2="248.346" gradientUnits="userSpaceOnUse">
            <stop stop-color="#1F9B76" stop-opacity="0"/>
            <stop offset="1" stop-color="#1F9B76"/>
          </linearGradient>
          <linearGradient id="${strokeGradientId}" x1="169" y1="0" x2="169" y2="242" gradientUnits="userSpaceOnUse">
            <stop stop-color="#1F9B76" stop-opacity=".2"/>
            <stop offset="1" stop-color="#1F9B76" stop-opacity=".2"/>
          </linearGradient>
        `;
      default:
        return `
          <linearGradient id="${gradientId}" x1="70.887" y1="53.288" x2="70.887" y2="112.334" gradientUnits="userSpaceOnUse">
            <stop stop-color="#4A4A4A" stop-opacity="0"/>
            <stop offset="1" stop-color="#4A4A4A"/>
          </linearGradient>
          <linearGradient id="${strokeGradientId}" x1="70" y1="0" x2="70" y2="107" gradientUnits="userSpaceOnUse">
            <stop stop-color="#fff" stop-opacity=".2"/>
            <stop offset="1" stop-color="#fff" stop-opacity=".2"/>
          </linearGradient>
        `;
    }
  }

  /**
   * 재생 버튼 색상 결정
   * @private
   */
  _getPlayButtonColors(state) {
    switch (state) {
      case "completed":
        return { fill: "#FF4D00", opacity: "1" }; // 주황색 - 완료
      case "current":
        return { fill: "#188F6B", opacity: "0.9" }; // 초록색 - 진행중
      default:
        return { fill: "#B1B1B1", opacity: "0.9" }; // 회색 - 기본
    }
  }

  /**
   * 카드 위치 설정
   * @private
   */
  _positionCard(li, chapterLesson) {
    const gaugeSvg = document.getElementById("gauge-svg");
    const viewBox = gaugeSvg.viewBox.baseVal;

    // 챕터 마커의 SVG path 위치
    const point = this.gaugeManager.getPointAtPercent(
      chapterLesson.pathPercent
    );

    // 퍼센트 기반 위치 계산
    const percentX = (point.x / viewBox.width) * 100 + 1.2;
    const percentY = (point.y / viewBox.height) * 100 - 1.2;

    // 카드를 경로 안쪽으로 배치
    li.style.position = "absolute";
    li.style.left = `${percentX}%`;
    li.style.top = `${percentY}%`;
    li.style.transform = "translate(-50%, -100%)"; // 수평 중앙 정렬 + 위로 100%
    li.style.zIndex = "10";

    console.log(
      `[ChapterCardManager] 카드 위치: (${percentX.toFixed(2)}%, ${percentY.toFixed(2)}%)`
    );
  }

  /**
   * 챕터 카드 상태 업데이트
   */
  updateChapterCards() {
    this.chapterCards.forEach((card, index) => {
      const chapter = card.chapter;
      const newState = this._getChapterState(chapter);

      if (card.state !== newState) {
        // 상태가 변경되면 SVG 다시 생성
        const svg = this._createSVG(chapter, newState, card.chapterIndex);
        card.element.className = newState;
        card.element.innerHTML = "";
        card.element.appendChild(svg);
        card.state = newState;

        console.log(
          `[ChapterCardManager] 챕터 ${index + 1} 상태 업데이트: ${newState}`
        );
      }
    });
  }
}
