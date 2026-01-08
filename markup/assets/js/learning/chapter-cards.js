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
      document.querySelector(".lessons-gauge").appendChild(this.cardsContainer);
    }

    this.cardsContainer.innerHTML = "";

    this.config.chapters.forEach((chapter, chapterIndex) => {
      // 새 구조: 챕터 자체가 마커이므로 chapter에서 직접 정보 가져오기
      if (chapter.type === "chapter") {
        this._createCard(chapter, chapterIndex, chapter);
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
    thumbnail.loading = "lazy";
    thumbnailContainer.appendChild(thumbnail);

    // 플레이 버튼
    const playButton = document.createElement("img");
    playButton.className = "card-play-button";
    playButton.src = this._getPlayButtonImagePath(state);
    playButton.alt = "재생";
    playButton.loading = "lazy";
    thumbnailContainer.appendChild(playButton);

    // 스탬프 아이콘 추가 (completed 상태일 때만 표시)
    if (state === "completed") {
      const stamp = document.createElement("div");
      stamp.className = "ico-stamp";
      inner.appendChild(stamp);
    }

    // 게이지바 추가
    const gaugeBar = document.createElement("div");
    gaugeBar.className = "card-gauge-bar";
    thumbnailContainer.appendChild(gaugeBar);

    const gaugeFill = document.createElement("div");
    gaugeFill.className = "card-gauge-fill";

    const progressPercent = this._calculateChapterProgress(chapter);
    gaugeFill.style.width = progressPercent + "%";

    gaugeBar.appendChild(gaugeFill);
    inner.appendChild(thumbnailContainer);

    // 제목
    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = chapter.name;
    inner.appendChild(title);

    // 스탬프
    const stamp = document.createElement("div");
    stamp.className ="card-stamp";
    inner.appendChild(stamp);

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

    // 챕터는 시작점 표시용이므로 항상 첫 번째 미완료 lesson부터 시작
    let targetLessonIndex = 0; // 첫 번째 lesson

    // 첫 번째 미완료 lesson 찾기
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

    const targetLabel = chapter.lessons[targetLessonIndex].label;

    console.log(
      `[ChapterCardManager] 대상 학습: ${targetLabel} (글로벌 인덱스: ${globalIndex})`
    );

    this.modalInstance.loadChapter(chapter, chapterIndex, globalIndex);
  }

  /**
   * 챕터 상태 결정
   * @private
   */
  _getChapterState(chapter) {
    // 새 구조: chapter.completed 사용 (자동 업데이트됨)
    if (chapter.completed) return "completed";

    const anyCompleted = chapter.lessons.some((lesson) => lesson.completed);
    if (anyCompleted) return "current";

    // 챕터 자체가 활성화되어 있는지 확인
    const isActive = this._isChapterActive(chapter);
    if (isActive) return "current";

    return "base";
  }

  /**
   * 챕터 활성화 여부 확인
   * @private
   */
  _isChapterActive(chapter) {
    const allMarkers = this.config.getAllMarkers();
    const chapterMarkerIndex = allMarkers.findIndex(
      (m) => m.pathPercent === chapter.pathPercent && m.isChapterMarker === true
    );

    if (chapterMarkerIndex === -1) return false;
    if (chapterMarkerIndex === 0) return true;
    return allMarkers[chapterMarkerIndex - 1].completed;
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
   * 챕터 진행률 계산
   * @private
   * @param {Object} chapter - 챕터 객체
   * @returns {number} 진행률 (0-100)
   */
  _calculateChapterProgress(chapter) {
    const completedCount = chapter.lessons.filter(
      (lesson) => lesson.completed
    ).length;
    const totalCount = chapter.lessons.length;
    const progressPercent = Math.round((completedCount / totalCount) * 100);

    console.log(
      `[ChapterCardManager] 챕터 "${chapter.name}" 진행률: ${completedCount}/${totalCount} (${progressPercent}%)`
    );

    return progressPercent;
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
    const percentY = (point.y / viewBox.height) * 100 - 3;

    li.style.position = "absolute";
    li.style.left = `${percentX}%`;
    li.style.top = `${percentY}%`;
    li.style.transform = "translate(-50%, -105%)";
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
      const newProgress = this._calculateChapterProgress(chapter);

      const gaugeFill = card.element.querySelector(".card-gauge-fill");
      const currentProgress = gaugeFill
        ? parseInt(gaugeFill.style.width) || 0
        : 0;

      const shouldUpdate =
        forceUpdate ||
        card.state !== newState ||
        currentProgress !== newProgress;

      if (shouldUpdate) {
        console.log(
          `[ChapterCardManager] 챕터 ${index + 1} ${forceUpdate ? "강제 " : ""}업데이트`
        );

        card.element.className = "chapter-card";
        if (newState) {
          card.element.classList.add(newState);
        }

        const playButton = card.element.querySelector(".card-play-button");
        if (playButton) {
          playButton.src = this._getPlayButtonImagePath(newState);
        }

        if (gaugeFill) {
          gaugeFill.style.width = newProgress + "%";
        }

        // 스탬프 업데이트
        const inner = card.element.querySelector(".chapter-card-inner");
        const existingStamp = inner.querySelector(".ico-stamp");

        if (newState === "completed" && !existingStamp) {
          const stamp = document.createElement("div");
          stamp.className = "ico-stamp";
          // 제목 앞에 삽입
          const title = inner.querySelector(".card-title");
          inner.insertBefore(stamp, title);
        } else if (newState !== "completed" && existingStamp) {
          existingStamp.remove();
        }

        card.state = newState;
      }
    });
  }
}
