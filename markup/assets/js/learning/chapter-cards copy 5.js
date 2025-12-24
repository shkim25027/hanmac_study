/**
 * 챕터 카드 관리 클래스
 */
class ChapterCardManager {
  constructor(config, gaugeManager) {
    this.config = config;
    this.gaugeManager = gaugeManager;
    this.chapterCards = [];
    this.cardsContainer = null;
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

    // chapter-card 클래스 추가
    li.classList.add("chapter-card");

    // 챕터 상태 결정
    const state = this._getChapterState(chapter);
    if (state) {
      li.classList.add(state); // 'completed', 'current' (빈 문자열이면 추가하지 않음)
    }

    // 클릭 가능 여부 확인
    const isClickable = this._isCardClickable(chapterLesson);

    // 클릭 이벤트 추가
    if (isClickable) {
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        this._handleCardClick(chapterLesson, chapterIndex);
      });
    } else {
      const settings = this.config.settings || {};
      if (settings.allowDisabledClick) {
        // 비활성 카드도 클릭 허용
        li.style.cursor = "pointer";
        li.addEventListener("click", () => {
          this._handleCardClick(chapterLesson, chapterIndex);
        });
      } else {
        li.style.cursor = "not-allowed";
      }
    }

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
      chapterLesson: chapterLesson,
    });
  }

  /**
   * 카드 클릭 핸들러
   * @private
   */
  _handleCardClick(chapterLesson, chapterIndex) {
    const isClickable = this._isCardClickable(chapterLesson);
    const settings = this.config.settings || {};

    if (isClickable && this.modalInstance) {
      // 클릭 가능한 카드 - 모달 열기
      console.log(
        `[ChapterCardManager] 챕터 카드 클릭: ${chapterLesson.label} (${this.config.chapters[chapterIndex].name})`
      );

      // 전체 마커 배열에서 해당 챕터 마커의 인덱스 찾기
      const allMarkers = this.config.getAllMarkers();
      const globalIndex = allMarkers.findIndex(
        (m) =>
          m.pathPercent === chapterLesson.pathPercent &&
          m.label === chapterLesson.label
      );

      if (globalIndex !== -1) {
        this.modalInstance.load(chapterLesson, globalIndex);
      }
    } else if (!isClickable) {
      // 비활성 카드 클릭
      if (settings.allowDisabledClick && this.modalInstance) {
        // 설정에서 비활성 카드 클릭을 허용하는 경우
        console.log(
          `[ChapterCardManager] 비활성 챕터 카드 클릭 허용: ${chapterLesson.label}`
        );

        const allMarkers = this.config.getAllMarkers();
        const globalIndex = allMarkers.findIndex(
          (m) =>
            m.pathPercent === chapterLesson.pathPercent &&
            m.label === chapterLesson.label
        );

        if (globalIndex !== -1) {
          this.modalInstance.load(chapterLesson, globalIndex);
        }
      } else {
        // 비활성 카드 클릭 불가
        console.log(
          `[ChapterCardManager] 비활성 챕터 카드 클릭 차단: ${chapterLesson.label}`
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
   * 카드 클릭 가능 여부 확인
   * @private
   */
  _isCardClickable(chapterLesson) {
    // 전체 마커 배열에서 해당 챕터 마커의 인덱스 찾기
    const allMarkers = this.config.getAllMarkers();
    const lessonIndex = allMarkers.findIndex(
      (m) =>
        m.pathPercent === chapterLesson.pathPercent &&
        m.label === chapterLesson.label
    );

    if (lessonIndex === -1) return false;

    // 첫 번째 레슨이거나, 이전 레슨이 완료된 경우 클릭 가능
    if (lessonIndex === 0) return true;
    return allMarkers[lessonIndex - 1].completed;
  }

  /**
   * 챕터 상태 결정
   * @private
   */
  _getChapterState(chapter) {
    // 챕터의 첫 번째 레슨(챕터 마커) 확인
    const firstLesson = chapter.lessons[0];
    const isActive = this._isLessonActive(firstLesson);

    let state = "";

    // 챕터 마커가 완료되었으면 completed
    if (firstLesson.completed) {
      state = "completed";
    }
    // 챕터 마커가 활성화(클릭 가능)이면 current
    else if (isActive) {
      state = "current";
    }
    // 그 외는 base (빈 문자열)
    else {
      state = "";
    }

    console.log(`[ChapterCardManager] 챕터 "${chapter.name}" 상태 결정:`, {
      챕터마커완료: firstLesson.completed,
      활성화: isActive,
      결정된상태: state,
    });

    return state;
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
      <g opacity="0.5" style="mix-blend-mode:multiply" filter="url(#filter_box_shadow)">
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
        <filter id="filter_box_shadow" x="0" y="0" width="196" height="18" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_2000_108617"/>
        </filter>
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
            "M108.56 136.266v-5h-1.295l-.836 1.078 2.131 1.64zm-7.794 13l-2.132 1.64 2.132 2.771 2.131-2.772-2.131-1.64zm-7.794-13l2.131-1.64-.836-1.077h-1.295v2.717zm98.167-135v2.717c3.093 0 5.61 2.516 5.61 5.61h5.433c0-6.092-4.951-11.044-11.043-11.044v2.717zm10.127 10.127h-2.717v114.746h5.434V11.393h-2.717zm0 114.746h-2.717c0 3.094-2.517 5.61-5.61 5.61v5.434c6.092 0 11.043-4.951 11.043-11.044h-2.716zm-10.127 10.127v-2.717H108.56v5.434h82.579v-2.717zm-82.58 0l-2.13-1.64-7.794 13 2.131 1.64 2.132 1.64 7.793-13-2.131-1.64zm-7.793 13l2.131-1.64-7.794-13-2.131 1.64-2.131 1.64 7.794 13 2.131-1.64zm-7.794-13v-2.717H11.393v5.434h73.586v-2.717zm-81.579 0v-2.717c-3.093 0-5.61-2.516-5.61-5.61H.817c0 6.093 4.952 11.044 11.044 11.044v-2.717zM1.266 126.139h2.717V11.393H-.55v114.746h2.717zm0-114.746h2.717c0-3.093 2.517-5.61 5.61-5.61V.35C3.5.35-1.45 5.301-1.45 11.393h2.717zm10.127-10.127v2.717h179.746V-.55H11.393v2.717z",
          screenPath:
            "M1.266 13.093c0-6.543 5.3-11.843 11.843-11.843h177.062c6.543 0 11.843 5.3 11.843 11.843v91.046H1.266V13.093z",
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
   * @param {boolean} forceUpdate - true일 경우 상태가 같아도 강제 업데이트
   */
  updateChapterCards(forceUpdate = false) {
    this.chapterCards.forEach((card, index) => {
      const chapter = card.chapter;
      const newState = this._getChapterState(chapter);

      // 상태가 변경되었거나 강제 업데이트일 때
      if (forceUpdate || card.state !== newState) {
        console.log(
          `[ChapterCardManager] 챕터 ${index + 1} 상태 ${forceUpdate ? "강제 " : ""}변경: "${card.state}" → "${newState}"`
        );

        // 1. 새 SVG 생성
        const svg = this._createSVG(chapter, newState, card.chapterIndex);

        // 2. 요소 복제 (이벤트 리스너 제거용)
        const newElement = card.element.cloneNode(false); // 자식 없이 복제

        // 3. 클래스 설정 (복제된 요소에)
        newElement.className = "chapter-card";
        if (newState) {
          newElement.classList.add(newState);
        }

        // 4. SVG 추가
        newElement.appendChild(svg);

        // 5. 클릭 이벤트 설정
        const isClickable = this._isCardClickable(card.chapterLesson);
        const settings = this.config.settings || {};

        if (isClickable) {
          newElement.style.cursor = "pointer";
          newElement.addEventListener("click", () => {
            this._handleCardClick(card.chapterLesson, card.chapterIndex);
          });
        } else {
          if (settings.allowDisabledClick) {
            newElement.style.cursor = "pointer";
            newElement.addEventListener("click", () => {
              this._handleCardClick(card.chapterLesson, card.chapterIndex);
            });
          } else {
            newElement.style.cursor = "not-allowed";
          }
        }

        // 6. 위치 스타일 복사
        newElement.style.position = card.element.style.position;
        newElement.style.left = card.element.style.left;
        newElement.style.top = card.element.style.top;
        newElement.style.transform = card.element.style.transform;
        newElement.style.zIndex = card.element.style.zIndex;

        // 7. DOM에서 교체
        card.element.parentNode.replaceChild(newElement, card.element);

        // 8. 참조 업데이트
        card.element = newElement;
        card.state = newState;

        console.log(
          `[ChapterCardManager] 챕터 ${index + 1} 업데이트 완료: 클래스 = "${newElement.className}"`
        );
      }
    });
  }
}
