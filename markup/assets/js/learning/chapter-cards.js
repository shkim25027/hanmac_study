/**
 * 챕터 카드 관리 클래스 (CSS 기반 디자인)
 * 개선된 공통 모듈 활용 (EventManager, ErrorHandler, DOMUtils)
 */
class ChapterCardManager {
  constructor(config, gaugeManager, dependencies = {}) {
    this.config = config;
    this.gaugeManager = gaugeManager;
    this.chapterCards = [];
    this.cardsContainer = null;
    this.modalInstance = null;

    // 의존성 주입 (폴백 포함)
    this.domUtils = dependencies.domUtils || (typeof DOMUtils !== 'undefined' ? DOMUtils : null);
    this.eventManager = dependencies.eventManager || (typeof eventManager !== 'undefined' ? eventManager : null);
    this.errorHandler = dependencies.errorHandler || (typeof ErrorHandler !== 'undefined' ? ErrorHandler : null);
    this.animationUtils = dependencies.animationUtils || (typeof AnimationUtils !== 'undefined' ? AnimationUtils : null);

    // 이벤트 리스너 ID 저장 (정리용)
    this.listenerIds = [];

    // CSS 스타일 주입
    this._injectStyles();
  }

  /**
   * CSS 스타일 주입
   * @private
   */
  _injectStyles() {
    try {
      if (document.getElementById("chapter-card-styles")) return;

      const style = this.domUtils?.createElement('style', { id: 'chapter-card-styles' }) || document.createElement("style");
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
    } catch (error) {
      this._handleError(error, 'ChapterCardManager._injectStyles');
    }
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
    try {
      const gaugeElement = this.domUtils?.$(".lessons-gauge") || document.querySelector(".lessons-gauge");
      if (!gaugeElement) {
        console.warn('[ChapterCardManager] .lessons-gauge 요소를 찾을 수 없습니다.');
        return;
      }

      this.cardsContainer = this.domUtils?.$(".chapter-list", gaugeElement) || gaugeElement.querySelector(".chapter-list");
      
      if (!this.cardsContainer) {
        this.cardsContainer = this.domUtils?.createElement('ul', { class: 'chapter-list' }) || document.createElement("ul");
        this.cardsContainer.className = "chapter-list";
        gaugeElement.appendChild(this.cardsContainer);
      }

      this.domUtils?.empty(this.cardsContainer) || (this.cardsContainer.innerHTML = "");

      this.chapterCards = [];

      this.config.chapters.forEach((chapter, chapterIndex) => {
        // 새 구조: 챕터 자체가 마커이므로 chapter에서 직접 정보 가져오기
        if (chapter.type === "chapter") {
          this._createCard(chapter, chapterIndex, chapter);
        }
      });

      console.log(
        `[ChapterCardManager] ${this.chapterCards.length}개의 챕터 카드 생성 완료`
      );
    } catch (error) {
      this._handleError(error, 'ChapterCardManager.createChapterCards');
    }
  }

  /**
   * 개별 챕터 카드 생성
   * @private
   */
  _createCard(chapter, chapterIndex, chapterLesson) {
    try {
      const li = this.domUtils?.createElement('li', { class: 'chapter-card' }) || document.createElement("li");
      li.classList.add("chapter-card");

      const state = this._getChapterState(chapter);
      if (state) {
        this.domUtils?.addClasses(li, state) || li.classList.add(state);
      }

      li.style.cursor = "pointer";

      // 이벤트 리스너 등록 (EventManager 사용)
      const clickHandler = () => {
        this._handleCardClick(chapter, chapterIndex);
      };

      if (this.eventManager) {
        const listenerId = this.eventManager.on(li, "click", clickHandler);
        this.listenerIds.push({ element: li, id: listenerId });
      } else {
        li.addEventListener("click", clickHandler);
      }

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
    } catch (error) {
      this._handleError(error, 'ChapterCardManager._createCard', { chapter, chapterIndex });
    }
  }

  /**
   * 카드 콘텐츠 생성
   * @private
   */
  _createCardContent(chapter, state, chapterIndex) {
    try {
      const inner = this.domUtils?.createElement('div', { class: 'chapter-card-inner' }) || document.createElement("div");
      inner.className = "chapter-card-inner";

      // 썸네일 영역
      const thumbnailContainer = this.domUtils?.createElement('div', { class: 'card-thumbnail-container' }) || document.createElement("div");
      thumbnailContainer.className = "card-thumbnail-container";

      const thumbnail = this.domUtils?.createElement('img', {
        class: 'card-thumbnail',
        src: `./assets/images/learning/img_learning_0${(chapterIndex % 6) + 1}.jpg`,
        alt: chapter.name,
        loading: 'lazy'
      }) || document.createElement("img");
      
      if (!this.domUtils) {
        thumbnail.className = "card-thumbnail";
        thumbnail.src = `./assets/images/learning/img_learning_0${(chapterIndex % 6) + 1}.jpg`;
        thumbnail.alt = chapter.name;
        thumbnail.loading = "lazy";
      }
      
      thumbnailContainer.appendChild(thumbnail);

      // 플레이 버튼
      const playButton = this.domUtils?.createElement('img', {
        class: 'card-play-button',
        src: this._getPlayButtonImagePath(state),
        alt: '재생',
        loading: 'lazy'
      }) || document.createElement("img");
      
      if (!this.domUtils) {
        playButton.className = "card-play-button";
        playButton.src = this._getPlayButtonImagePath(state);
        playButton.alt = "재생";
        playButton.loading = "lazy";
      }
      
      thumbnailContainer.appendChild(playButton);

      // 스탬프 아이콘 추가 (completed 상태일 때만 표시)
      if (state === "completed") {
        const stamp = this.domUtils?.createElement('div', { class: 'ico-stamp' }) || document.createElement("div");
        stamp.className = "ico-stamp";
        inner.appendChild(stamp);
      }

      // 게이지바 추가
      const gaugeBar = this.domUtils?.createElement('div', { class: 'card-gauge-bar' }) || document.createElement("div");
      gaugeBar.className = "card-gauge-bar";
      
      const gaugeFill = this.domUtils?.createElement('div', { class: 'card-gauge-fill' }) || document.createElement("div");
      gaugeFill.className = "card-gauge-fill";

      const progressPercent = this._calculateChapterProgress(chapter);
      gaugeFill.style.width = progressPercent + "%";

      gaugeBar.appendChild(gaugeFill);
      thumbnailContainer.appendChild(gaugeBar);
      inner.appendChild(thumbnailContainer);

      // 제목
      const title = this.domUtils?.createElement('div', { class: 'card-title' }, chapter.name) || document.createElement("div");
      if (!this.domUtils) {
        title.className = "card-title";
        title.textContent = chapter.name;
      }
      inner.appendChild(title);

      // 스탬프
      const stamp = this.domUtils?.createElement('div', { class: 'card-stamp' }) || document.createElement("div");
      stamp.className = "card-stamp";
      inner.appendChild(stamp);

      // 그림자
      const shadow = this.domUtils?.createElement('div', { class: 'shadow-effect' }) || document.createElement("div");
      shadow.className = "shadow-effect";
      inner.appendChild(shadow);
      
      return inner;
    } catch (error) {
      this._handleError(error, 'ChapterCardManager._createCardContent', { chapter, state, chapterIndex });
      // 에러 발생 시 최소한의 요소라도 반환
      const fallback = document.createElement("div");
      fallback.className = "chapter-card-inner";
      fallback.textContent = chapter.name || "Chapter";
      return fallback;
    }
  }

  /**
   * 카드 클릭 핸들러
   * @private
   */
  _handleCardClick(chapter, chapterIndex) {
    try {
      if (!this.modalInstance) {
        console.warn('[ChapterCardManager] 모달 인스턴스가 설정되지 않았습니다.');
        return;
      }

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

      // 모든 lesson이 완료된 경우 첫 번째 lesson으로
      if (targetLessonIndex >= chapter.lessons.length) {
        targetLessonIndex = 0;
      }

      const globalIndex = this.config.toGlobalIndex(
        chapterIndex,
        targetLessonIndex
      );

      const targetLesson = chapter.lessons[targetLessonIndex];
      if (!targetLesson) {
        console.error('[ChapterCardManager] 대상 lesson을 찾을 수 없습니다.');
        return;
      }

      const targetLabel = targetLesson.label;

      console.log(
        `[ChapterCardManager] 대상 학습: ${targetLabel} (글로벌 인덱스: ${globalIndex})`
      );

      this.modalInstance.loadChapter(chapter, chapterIndex, globalIndex);
    } catch (error) {
      this._handleError(error, 'ChapterCardManager._handleCardClick', { chapter, chapterIndex });
    }
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
    try {
      const gaugeSvg = document.getElementById("gauge-svg");
      if (!gaugeSvg) {
        console.warn('[ChapterCardManager] gauge-svg 요소를 찾을 수 없습니다.');
        return;
      }

      const viewBox = gaugeSvg.viewBox.baseVal;
      if (!viewBox || !viewBox.width || !viewBox.height) {
        console.warn('[ChapterCardManager] SVG viewBox가 유효하지 않습니다.');
        return;
      }

      const point = this.gaugeManager.getPointAtPercent(
        chapterLesson.pathPercent
      );

      if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
        console.warn('[ChapterCardManager] 유효하지 않은 포인트입니다.');
        return;
      }

      const percentX = (point.x / viewBox.width) * 100 + 1.3;
      const percentY = (point.y / viewBox.height) * 100 - 3;

      if (this.domUtils) {
        this.domUtils.setStyles(li, {
          position: "absolute",
          left: `${percentX}%`,
          top: `${percentY}%`,
          transform: "translate(-50%, -105%)",
          zIndex: "10"
        });
      } else {
        li.style.position = "absolute";
        li.style.left = `${percentX}%`;
        li.style.top = `${percentY}%`;
        li.style.transform = "translate(-50%, -105%)";
        li.style.zIndex = "10";
      }

      console.log(
        `[ChapterCardManager] 카드 위치: (${percentX.toFixed(2)}%, ${percentY.toFixed(2)}%)`
      );
    } catch (error) {
      this._handleError(error, 'ChapterCardManager._positionCard', { chapterLesson });
    }
  }

  /**
   * 챕터 카드 상태 업데이트
   * @param {boolean} forceUpdate - 강제 업데이트 여부
   */
  updateChapterCards(forceUpdate = false) {
    try {
      this.chapterCards.forEach((card, index) => {
        try {
          const chapter = card.chapter;
          const newState = this._getChapterState(chapter);
          const newProgress = this._calculateChapterProgress(chapter);

          const gaugeFill = this.domUtils?.$(".card-gauge-fill", card.element) || card.element.querySelector(".card-gauge-fill");
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

            // 클래스 업데이트
            card.element.className = "chapter-card";
            if (newState) {
              if (this.domUtils) {
                this.domUtils.addClasses(card.element, newState);
              } else {
                card.element.classList.add(newState);
              }
            }

            // 플레이 버튼 업데이트
            const playButton = this.domUtils?.$(".card-play-button", card.element) || card.element.querySelector(".card-play-button");
            if (playButton) {
              playButton.src = this._getPlayButtonImagePath(newState);
            }

            // 게이지바 업데이트 (애니메이션 적용 가능)
            if (gaugeFill) {
              if (this.animationUtils) {
                this.animationUtils.progressBar(gaugeFill, newProgress, 300);
              } else {
                gaugeFill.style.width = newProgress + "%";
              }
            }

            // 스탬프 업데이트
            const inner = this.domUtils?.$(".chapter-card-inner", card.element) || card.element.querySelector(".chapter-card-inner");
            if (inner) {
              const existingStamp = this.domUtils?.$(".ico-stamp", inner) || inner.querySelector(".ico-stamp");

              if (newState === "completed" && !existingStamp) {
                const stamp = this.domUtils?.createElement('div', { class: 'ico-stamp' }) || document.createElement("div");
                stamp.className = "ico-stamp";
                // 제목 앞에 삽입
                const title = this.domUtils?.$(".card-title", inner) || inner.querySelector(".card-title");
                if (title) {
                  inner.insertBefore(stamp, title);
                } else {
                  inner.appendChild(stamp);
                }
              } else if (newState !== "completed" && existingStamp) {
                this.domUtils?.remove(existingStamp) || existingStamp.remove();
              }
            }

            card.state = newState;
          }
        } catch (error) {
          this._handleError(error, 'ChapterCardManager.updateChapterCards.card', { index });
        }
      });
    } catch (error) {
      this._handleError(error, 'ChapterCardManager.updateChapterCards');
    }
  }

  /**
   * 에러 처리 헬퍼 메서드
   * @private
   */
  _handleError(error, context, additionalInfo = {}) {
    if (this.errorHandler) {
      this.errorHandler.handle(error, {
        context,
        ...additionalInfo,
        component: 'ChapterCardManager'
      }, false);
    } else {
      console.error(`[ChapterCardManager] ${context}:`, error, additionalInfo);
    }
  }

  /**
   * 리소스 정리 (이벤트 리스너 제거)
   */
  destroy() {
    try {
      // 이벤트 리스너 제거
      if (this.eventManager) {
        this.listenerIds.forEach(({ element, id }) => {
          this.eventManager.off(element, id);
        });
        this.listenerIds = [];
      }

      // 카드 배열 초기화
      this.chapterCards = [];
      this.cardsContainer = null;
      this.modalInstance = null;
    } catch (error) {
      this._handleError(error, 'ChapterCardManager.destroy');
    }
  }
}
