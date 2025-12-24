/**
 * 챕터 카드 관리 클래스 (CSS 기반 디자인)
 */
class ChapterCardManager {
  constructor(config, gaugeManager) {
    this.config = config;
    this.gaugeManager = gaugeManager;
    this.chapterCards = [];
    this.cardsContainer = null;
    this.modalInstance = null;

    // CSS 스타일 주입
    this._injectStyles();
  }

  /**
   * CSS 스타일 주입
   * @private
   */
  _injectStyles() {
    if (document.getElementById("chapter-card-styles")) return;

    const style = document.createElement("style");
    style.id = "chapter-card-styles";
    style.textContent = `

      .chapter-card:hover .card-play-button {
        transform: translate(-50%, -50%) scale(1.1);
      }


      /* 호버 효과 */
      .chapter-card:hover .chapter-card-inner {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      }

      .chapter-card.current:hover .chapter-card-inner {
        box-shadow: 0 12px 32px rgba(31, 155, 118, 0.3);
      }

      .chapter-card.completed:hover .chapter-card-inner {
        box-shadow: 0 12px 32px rgba(171, 61, 0, 0.25);
      }
    `;
    document.head.appendChild(style);
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
    this.cardsContainer = document.querySelector(".chapter-list");
    if (!this.cardsContainer) {
      this.cardsContainer = document.createElement("ul");
      this.cardsContainer.className = "chapter-list";
      document
        .querySelector(".learning-gauge")
        .appendChild(this.cardsContainer);
    }

    this.cardsContainer.innerHTML = "";

    this.config.chapters.forEach((chapter, chapterIndex) => {
      const chapterLesson = chapter.lessons[0];
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
    li.classList.add("chapter-card");

    const state = this._getChapterState(chapter);
    if (state) {
      li.classList.add(state);
    }

    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
      this._handleCardClick(chapter, chapterIndex);
    });

    const cardContent = this._createCardContent(chapter, state, chapterIndex);
    li.appendChild(cardContent);

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
   * 카드 콘텐츠 생성
   * @private
   */
  _createCardContent(chapter, state, chapterIndex) {
    const inner = document.createElement("div");
    inner.className = "chapter-card-inner";

    // 썸네일 영역
    const thumbnailContainer = document.createElement("div");
    thumbnailContainer.className = "card-thumbnail-container";

    const thumbnail = document.createElement("img");
    thumbnail.className = "card-thumbnail";
    thumbnail.src = `./assets/images/learning/img_learning_0${(chapterIndex % 6) + 1}.jpg`;
    thumbnail.alt = chapter.name;
    thumbnailContainer.appendChild(thumbnail);

    // 플레이 버튼
    const playButton = document.createElement("img");
    playButton.className = "card-play-button";
    playButton.src = this._getPlayButtonImagePath(state);
    playButton.alt = "재생";
    thumbnailContainer.appendChild(playButton);

    inner.appendChild(thumbnailContainer);

    // 제목
    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = chapter.name;
    inner.appendChild(title);

    // 그림자
    const shadow = document.createElement("div");
    shadow.className = "shadow-effect";
    inner.appendChild(shadow);
    return inner;
  }

  /**
   * 카드 클릭 핸들러
   * @private
   */
  _handleCardClick(chapter, chapterIndex) {
    if (!this.modalInstance) return;

    console.log(
      `[ChapterCardManager] 챕터 카드 클릭: ${chapter.name} (챕터 ${chapterIndex + 1})`
    );

    let targetLessonIndex = 0;
    for (let i = 0; i < chapter.lessons.length; i++) {
      if (!chapter.lessons[i].completed) {
        targetLessonIndex = i;
        break;
      }
    }

    const globalIndex = this.config.toGlobalIndex(
      chapterIndex,
      targetLessonIndex
    );
    const targetLesson = chapter.lessons[targetLessonIndex];

    console.log(
      `[ChapterCardManager] 대상 학습: ${targetLesson.label} (글로벌 인덱스: ${globalIndex})`
    );

    this.modalInstance.loadChapter(chapter, chapterIndex, globalIndex);
  }

  /**
   * 챕터 상태 결정
   * @private
   */
  _getChapterState(chapter) {
    const allCompleted = chapter.lessons.every((lesson) => lesson.completed);
    if (allCompleted) return "completed";

    const anyCompleted = chapter.lessons.some((lesson) => lesson.completed);
    if (anyCompleted) return "current";

    const firstLesson = chapter.lessons[0];
    const isActive = this._isLessonActive(firstLesson);
    if (isActive) return "current";

    return "base";
  }

  /**
   * 레슨 활성화 여부 확인
   * @private
   */
  _isLessonActive(lesson) {
    const allMarkers = this.config.getAllMarkers();
    const lessonIndex = allMarkers.findIndex(
      (m) => m.pathPercent === lesson.pathPercent && m.label === lesson.label
    );

    if (lessonIndex === -1) return false;
    if (lessonIndex === 0) return true;
    return allMarkers[lessonIndex - 1].completed;
  }

  /**
   * 플레이 버튼 이미지 경로 반환
   * @private
   */
  _getPlayButtonImagePath(state) {
    switch (state) {
      case "completed":
        return "./assets/images/learning/btn_play_completed.png";
      case "current":
        return "./assets/images/learning/btn_play_current.png";
      default:
        return "./assets/images/learning/btn_play_base.png";
    }
  }

  /**
   * 카드 위치 설정
   * @private
   */
  _positionCard(li, chapterLesson) {
    const gaugeSvg = document.getElementById("gauge-svg");
    const viewBox = gaugeSvg.viewBox.baseVal;

    const point = this.gaugeManager.getPointAtPercent(
      chapterLesson.pathPercent
    );

    const percentX = (point.x / viewBox.width) * 100 + 1.3;
    const percentY = (point.y / viewBox.height) * 100 - 4;

    li.style.position = "absolute";
    li.style.left = `${percentX}%`;
    li.style.top = `${percentY}%`;
    li.style.transform = "translate(-50%, -100%)";
    li.style.zIndex = "10";

    console.log(
      `[ChapterCardManager] 카드 위치: (${percentX.toFixed(2)}%, ${percentY.toFixed(2)}%)`
    );
  }

  /**
   * 챕터 카드 상태 업데이트
   * @param {boolean} forceUpdate - 강제 업데이트 여부
   */
  updateChapterCards(forceUpdate = false) {
    this.chapterCards.forEach((card, index) => {
      const chapter = card.chapter;
      const newState = this._getChapterState(chapter);

      if (forceUpdate || card.state !== newState) {
        console.log(
          `[ChapterCardManager] 챕터 ${index + 1} 상태 ${forceUpdate ? "강제 " : ""}변경: "${card.state}" → "${newState}"`
        );

        // 클래스만 업데이트 (CSS가 자동으로 스타일 변경)
        card.element.className = "chapter-card";
        if (newState) {
          card.element.classList.add(newState);
        }

        // 플레이 버튼 이미지 업데이트
        const playButton = card.element.querySelector(".card-play-button");
        if (playButton) {
          playButton.src = this._getPlayButtonImagePath(newState);
        }

        card.state = newState;

        console.log(
          `[ChapterCardManager] 챕터 ${index + 1} 업데이트 완료: 클래스 = "${card.element.className}"`
        );
      }
    });
  }
}
