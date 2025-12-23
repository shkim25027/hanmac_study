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
    svg.setAttribute("width", "203");
    svg.setAttribute("height", "166");
    svg.setAttribute("viewBox", "0 0 203 166");
    svg.setAttribute("fill", "none");

    // 이미지 URL (챕터별로 다른 이미지 사용 가능)
    const imageUrl = `./assets/images/learning/img_learning_${String(chapterIndex + 1).padStart(2, "0")}.jpg`;

    // 재생 버튼 색상 결정
    const playButtonColors = this._getPlayButtonColors(state);

    svg.innerHTML = `
      <!-- 그림자 -->
      <g opacity="0.4">
        <ellipse cx="102" cy="156" rx="94" ry="5" fill="#8A7D64" opacity="0.5" style="mix-blend-mode:multiply"/>
        <ellipse cx="102" cy="156.5" rx="69" ry="1.5" fill="#8A7D64" opacity="0.5" style="mix-blend-mode:multiply"/>
      </g>

      <!-- 말풍선 배경 -->
      <path d="M191.139 1.26581C196.731 1.26581 201.266 5.80003 201.266 11.3928V126.139C201.266 131.732 196.731 136.266 191.139 136.266H108.56L100.766 149.266L92.9717 136.266H11.3926C5.79985 136.266 1.26562 131.732 1.26562 126.139V11.3928C1.26562 5.80003 5.79985 1.26581 11.3926 1.26581H191.139Z" fill="white" fill-opacity="0.9"/>
      <path d="M191.139 1.26581C196.731 1.26581 201.266 5.80003 201.266 11.3928V126.139C201.266 131.732 196.731 136.266 191.139 136.266H108.56L100.766 149.266L92.9717 136.266H11.3926C5.79985 136.266 1.26562 131.732 1.26562 126.139V11.3928C1.26562 5.80003 5.79985 1.26581 11.3926 1.26581H191.139Z" fill="url(#grad_${chapterIndex})" fill-opacity="0.3"/>

      <!-- 이미지 영역 -->
      <defs>
        <mask id="screen-mask-${chapterIndex}">
          <path d="M1.26562 13.5545C1.26562 6.76766 6.76748 1.26581 13.5544 1.26581H188.977C195.764 1.26581 201.266 6.76766 201.266 13.5545V104.266H1.26562V13.5545Z" fill="white"/>
        </mask>
      </defs>
      
      <image href="${imageUrl}" x="1.26562" y="1.26581" width="200" height="103" preserveAspectRatio="xMidYMid slice" mask="url(#screen-mask-${chapterIndex})"/>
      
      <!-- 어두운 오버레이 -->
      <path d="M1.26562 13.5545C1.26562 6.76766 6.76748 1.26581 13.5544 1.26581H188.977C195.764 1.26581 201.266 6.76766 201.266 13.5545V104.266H1.26562V13.5545Z" fill="#6A5A4E" fill-opacity="0.3"/>

      <!-- 하단 텍스트 (${chapter.name}) -->
      <text x="101" y="120" fill="${state === "completed" ? "#AB3D00" : state === "current" ? "#1D9B75" : "#7E7E7E"}" font-size="16" font-weight="bold" text-anchor="middle" font-family="Arial, sans-serif">${chapter.name}</text>

      <!-- 구분선 -->
      <path d="M1.26562 102.266H201.266V105.266H1.26562V102.266Z" fill="white" fill-opacity="0.5"/>

      <!-- 재생 버튼 -->
      <circle cx="101" cy="53" r="19" fill="${playButtonColors.fill}" fill-opacity="${playButtonColors.opacity}"/>
      <circle cx="101" cy="53" r="18" stroke="white" stroke-opacity="0.3" stroke-width="2" fill="none"/>
      <path d="M107 53L95 60V46L107 53Z" fill="white"/>

      <defs>
        <linearGradient id="grad_${chapterIndex}" x1="101" y1="1" x2="101" y2="150" gradientUnits="userSpaceOnUse">
          <stop stop-color="#4A4A4A" stop-opacity="0"/>
          <stop offset="1" stop-color="#4A4A4A"/>
        </linearGradient>
      </defs>
    `;

    return svg;
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
        return { fill: "#B1B1B1", opacity: "0.9" }; // 회색 - 진행중
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
    const percentX = (point.x / viewBox.width) * 100;
    const percentY = (point.y / viewBox.height) * 100;

    // 카드를 마커 하단 중앙에 배치
    // transform: translate(-50%, 0) = 카드의 수평 중앙을 마커 중앙에 맞춤
    // top 위치 = 마커 위치 그대로 (카드 상단이 마커 하단에 오도록)
    li.style.position = "absolute";
    li.style.left = `${percentX}%`;
    li.style.top = `${percentY}%`;
    li.style.transform = "translate(-45%, -95%)"; // 수평 중앙 정렬만
    li.style.zIndex = "10"; // 마커보다 위에 표시

    console.log(
      `[ChapterCardManager] 카드 위치: (${percentX.toFixed(2)}%, ${percentY.toFixed(2)}%) - 마커 하단 중앙`
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
