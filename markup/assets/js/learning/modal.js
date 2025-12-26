/**
 * 비디오 모달 관리 클래스
 */
class VideoModal {
  constructor(config, markerManager) {
    this.config = config;
    this.markerManager = markerManager;
    this.currentModal = null;
    this.currentLearningIndex = null;
    this.currentChapterInfo = null;

    // 높이 조정 관련
    this.resizeObserver = null;
    this.mutationObserver = null;
    this.heightAdjustTimer = null;
    this._retryCount = 0;

    this._setupKeyboardEvents();
  }

  /**
   * 챕터 기반으로 비디오 모달 로드
   * @param {Object} chapter - 챕터 데이터
   * @param {number} chapterIndex - 챕터 인덱스
   * @param {number} initialLessonIndex - 초기 표시할 학습의 글로벌 인덱스
   */
  async loadChapter(chapter, chapterIndex, initialLessonIndex) {
    try {
      this.destroy();
      this.currentLearningIndex = initialLessonIndex;

      // 챕터 정보 저장 (새 구조: 챕터 마커가 첫 번째)
      this.currentChapterInfo = {
        chapterIndex: chapterIndex,
        chapterData: chapter,
        globalStartIndex: this.config.toGlobalIndex(chapterIndex, -1), // 챕터 마커 인덱스
      };

      const modalHTML = await this._fetchModal();
      const modalElement = this._parseModal(modalHTML, "learning");

      document.body.appendChild(modalElement);
      this.currentModal = modalElement;

      const initialLesson = this.markerManager.allMarkers[initialLessonIndex];
      this._setupVideo(modalElement, initialLesson.url);
      this._updateContent(modalElement, initialLesson, initialLessonIndex);
      this._show(modalElement);
    } catch (error) {
      console.error("모달 로드 오류:", error);
      alert("비디오를 로드하는 중 오류가 발생했습니다.");
    }
  }

  /**
   * 비디오 모달 로드 (기존 호환성 유지)
   * @param {Object} videoData - 비디오 데이터
   * @param {number} currentIndex - 현재 전역 인덱스
   */
  async load(videoData, currentIndex) {
    try {
      this.destroy();
      this.currentLearningIndex = currentIndex;

      // 현재 학습이 속한 챕터 정보 가져오기
      this.currentChapterInfo =
        this.config.getChapterByGlobalIndex(currentIndex);

      const modalHTML = await this._fetchModal();
      const modalElement = this._parseModal(modalHTML, videoData.type);

      document.body.appendChild(modalElement);
      this.currentModal = modalElement;

      this._setupVideo(modalElement, videoData.url);
      this._updateContent(modalElement, videoData, currentIndex);
      this._show(modalElement);
    } catch (error) {
      console.error("모달 로드 오류:", error);
      alert("비디오를 로드하는 중 오류가 발생했습니다.");
    }
  }

  /**
   * 모달 HTML 가져오기
   * @private
   */
  async _fetchModal() {
    const response = await fetch(`${this.config.modalPath}?t=${Date.now()}`);
    if (!response.ok) {
      throw new Error(`모달 로드 실패: ${this.config.modalPath}`);
    }
    return await response.text();
  }

  /**
   * 모달 HTML 파싱
   * @private
   */
  _parseModal(modalHTML, modalType = "learning") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(modalHTML, "text/html");
    const modalElement = doc.querySelector(".modal.video");

    if (!modalElement) {
      throw new Error("모달 요소를 찾을 수 없습니다");
    }

    modalElement.id = "videoModal";
    modalElement.setAttribute("data-type", modalType);

    return modalElement;
  }

  /**
   * 비디오 설정
   * @private
   */
  _setupVideo(modalElement, videoUrl) {
    const iframe = modalElement.querySelector("#videoFrame");
    if (iframe) {
      iframe.src = `https://www.youtube.com/embed/${videoUrl}?autoplay=1`;
    }
  }

  /**
   * 모달 컨텐츠 업데이트
   * @private
   */
  _updateContent(modalElement, videoData, currentIndex) {
    this._updateTitle(modalElement, videoData.label);
    this._updateProgress(modalElement, currentIndex);
    this._createLearningList(modalElement, currentIndex);
  }

  /**
   * 제목 업데이트
   * @private
   */
  _updateTitle(modalElement, label) {
    const videoTitle = modalElement.querySelector(".tit-box h3");
    const currentLesson = modalElement.querySelector(".sub-txt");

    if (videoTitle) videoTitle.textContent = label;
    if (currentLesson) currentLesson.textContent = label;
  }

  /**
   * 진행률 업데이트 (현재 챕터 기준)
   * @private
   */
  _updateProgress(modalElement, currentIndex) {
    if (!this.currentChapterInfo) return;

    const currentChapter = this.currentChapterInfo.chapterData;
    const lessons = currentChapter.lessons;

    // 현재 챕터의 완료된 학습 개수
    const completedCount = lessons.filter((lesson) => lesson.completed).length;
    const totalCount = lessons.length;
    const progressPercent = Math.round((completedCount / totalCount) * 100);

    // 현재 학습의 챕터 내 로컬 인덱스 계산
    const globalStartIndex = this.currentChapterInfo.globalStartIndex;
    const localIndex = currentIndex - globalStartIndex;

    const gaugeFill = modalElement.querySelector("#gaugeFill");
    const labelElement = modalElement.querySelector(
      ".gauge-labels .label:not(.current)"
    );
    const currentStepEm = labelElement?.querySelector("em");
    const progressText = modalElement.querySelector(
      ".gauge-labels .label.current em"
    );

    // 게이지바: 챕터 진행률
    if (gaugeFill) gaugeFill.style.width = progressPercent + "%";

    // 차시 업데이트: "현재차시 / 총차시" 형식
    if (labelElement) {
      const currentText = localIndex + 1;
      labelElement.innerHTML = `<em>${currentText}</em> / ${totalCount} 강`;
      console.log(`[VideoModal] 차시 업데이트: ${currentText} / ${totalCount}`);
    } else {
      console.warn("[VideoModal] 차시 표시 요소를 찾을 수 없습니다.");
    }

    // 진행률 퍼센트: 챕터 진행률
    if (progressText) progressText.textContent = progressPercent;

    console.log(
      `[VideoModal] 챕터 진행률: ${completedCount}/${totalCount} (${progressPercent}%), 현재 차시: ${localIndex + 1}`
    );
  }

  /**
   * 학습 목차 생성 (현재 챕터만)
   * @private
   */
  _createLearningList(modalElement, currentGlobalIndex) {
    const list = modalElement.querySelector(".learning-list");
    if (!list) return;

    list.innerHTML = "";

    // 현재 챕터 정보
    const currentChapter = this.currentChapterInfo.chapterData;
    const globalStartIndex = this.currentChapterInfo.globalStartIndex;

    // 챕터는 시작점 표시용이므로 목차에서 제외
    // 하위 lessons만 추가 (실제 강의)
    const currentChapterLessons = currentChapter.lessons;
    currentChapterLessons.forEach((lesson, localIndex) => {
      const globalIndex = globalStartIndex + 1 + localIndex; // 챕터 다음부터
      const li = this._createListItem(
        lesson,
        globalIndex,
        localIndex,
        currentGlobalIndex
      );
      list.appendChild(li);
    });
  }

  /**
   * 목차 항목 생성
   * @private
   */
  _createListItem(lesson, globalIndex, localIndex, currentGlobalIndex) {
    const li = document.createElement("li");
    const settings = this.config.settings || {};
    const allowDisabledClick = settings.allowDisabledClick || false;

    // allowDisabledClick 설정에 따라 클릭 가능 여부 결정
    const isClickable = allowDisabledClick
      ? true
      : this.markerManager.isMarkerClickable(globalIndex);
    const isCurrentLesson = globalIndex === currentGlobalIndex;
    const isRelearning = isCurrentLesson && lesson.completed; // 재학습 여부

    // 클래스 설정
    if (isRelearning) {
      // 재학습 중: active 클래스 (학습중 스타일)
      li.className = "active";
    } else if (lesson.completed) {
      // 완료된 학습
      li.className = "complet";
    } else if (isCurrentLesson) {
      // 처음 학습 중
      li.className = "active";
    }

    // allowDisabledClick가 false일 때만 disabled 스타일 적용
    if (!isClickable) {
      li.classList.add("disabled");
      li.style.opacity = "0.5";
      li.style.cursor = "not-allowed";
    } else {
      li.style.cursor = "pointer";
    }

    // 현재 학습 중인 항목에 data 속성 추가
    if (isCurrentLesson) {
      li.setAttribute("data-current", "true");
    }

    // HTML 생성
    li.innerHTML = `
      <a href="#" class="list" data-global-index="${globalIndex}">
        <span class="seq">${localIndex + 1}차시</span>
        <div class="learning-box">
          <div class="thumb">
            <img src="./assets/images/video/img_learning_thumb_0${(globalIndex % 6) + 1}.png" />
          </div>
          <div class="txt-box">
            <div class="title">${lesson.label}</div>
            <span class="state">${this._getStateText(lesson, isCurrentLesson, isRelearning)}</span>
          </div>
        </div>
      </a>
    `;

    // 이벤트 설정
    this._setupListItemEvent(li, globalIndex, isClickable);

    return li;
  }

  /**
   * 상태 텍스트 반환
   * @private
   */
  _getStateText(lesson, isCurrentLesson, isRelearning) {
    if (isRelearning) return "학습중";
    if (lesson.completed) return "학습완료";
    if (isCurrentLesson) return "학습중";
    return "미진행";
  }

  /**
   * 목차 항목 이벤트 설정
   * @private
   */
  _setupListItemEvent(li, globalIndex, isClickable) {
    const link = li.querySelector(".list");

    link.addEventListener("click", (e) => {
      e.preventDefault();

      if (isClickable) {
        const clickedIndex = parseInt(e.currentTarget.dataset.globalIndex);
        const allMarkers = this.markerManager.allMarkers;
        this.load(allMarkers[clickedIndex], clickedIndex);
      }
    });
  }

  /**
   * 모달 표시
   * @private
   */
  _show(modalElement) {
    setTimeout(() => {
      modalElement.style.display = "block";
      setTimeout(() => {
        this._setupCloseEvents(modalElement);
        this._initializeHeightAdjustment(); // 높이 조정 초기화
        this._scrollToCurrentLesson(); // 현재 학습으로 스크롤
      }, 100);
    }, 50);
  }

  // ============================================
  // 스크롤 관리
  // ============================================

  /**
   * 현재 학습 중인 항목으로 스크롤
   * @private
   */
  _scrollToCurrentLesson() {
    const learningList = this.currentModal?.querySelector(".learning-list");
    if (!learningList) {
      console.warn("학습 목록을 찾을 수 없습니다");
      return;
    }

    // 현재 학습 중인 항목 찾기
    const currentItem = learningList.querySelector('li[data-current="true"]');
    if (!currentItem) {
      console.warn("현재 학습 항목을 찾을 수 없습니다");
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

    console.log(`[VideoModal] 현재 학습으로 스크롤 이동:`, {
      currentItem: currentItem.querySelector(".title")?.textContent,
      scrollOffset,
    });

    // 시각적 강조 효과 (선택사항)
    this._highlightCurrentLesson(currentItem);
  }

  /**
   * 현재 학습 항목 시각적 강조
   * @private
   */
  _highlightCurrentLesson(currentItem) {
    // 이미 active 클래스가 있으므로 추가 효과는 선택사항
    // 예: 깜빡임 효과, 테두리 강조 등
    currentItem.style.transition = "all 0.3s ease";

    // 간단한 강조 효과 (선택사항)
    setTimeout(() => {
      currentItem.style.transition = "";
    }, 1000);
  }

  // ============================================
  // 높이 조정
  // ============================================

  /**
   * 높이 조정 초기화
   * @private
   */
  _initializeHeightAdjustment() {
    // 1단계: 즉시 시도
    this._adjustLearningListHeight();

    // 2단계: 다음 프레임에서 시도
    requestAnimationFrame(() => {
      this._adjustLearningListHeight();
    });

    // 3단계: 50ms 후 시도
    setTimeout(() => {
      this._adjustLearningListHeight();
    }, 50);

    // 4단계: 100ms 후 시도
    setTimeout(() => {
      this._adjustLearningListHeight();
    }, 100);

    // 5단계: 200ms 후 시도
    setTimeout(() => {
      this._adjustLearningListHeight();
    }, 200);

    // 6단계: ResizeObserver 설정
    this._setupResizeObserver();

    // 7단계: MutationObserver 설정
    this._setupMutationObserver();

    // 8단계: 이미지 로딩 대기
    this._waitForImagesAndAdjust();
  }

  /**
   * 학습 목록 높이 조정
   * @private
   */
  _adjustLearningListHeight() {
    const videoSide = this.currentModal?.querySelector(".video-side");
    const videoHeader = this.currentModal?.querySelector(".video-header");
    const learningList = this.currentModal?.querySelector(".learning-list");
    const gaugeWrap = this.currentModal?.querySelector(".gauge-wrap");

    if (!videoSide || !videoHeader || !learningList) {
      console.warn("필요한 요소를 찾을 수 없습니다");
      return;
    }

    // 전체 높이
    const totalHeight = videoSide.clientHeight;

    // 높이가 0이거나 비정상적으로 작으면 DOM이 아직 렌더링되지 않은 것
    if (totalHeight < 100) {
      console.warn(
        `videoSide 높이가 비정상적으로 작습니다: ${totalHeight}px. 재측정 예약...`
      );

      // 최대 3번까지만 재시도
      if (this._retryCount < 3) {
        this._retryCount++;
        setTimeout(() => this._adjustLearningListHeight(), 100);
      } else {
        console.error("높이 측정 재시도 횟수 초과");
        this._retryCount = 0;
      }
      return;
    }

    // 재시도 카운터 초기화
    this._retryCount = 0;

    // 헤더와 게이지 높이
    const headerHeight = videoHeader.offsetHeight;
    const gaugeHeight = gaugeWrap ? gaugeWrap.offsetHeight : 0;

    // 리스트에 사용 가능한 최대 높이
    const availableHeight = totalHeight - headerHeight - gaugeHeight - 80;

    // 사용 가능한 높이가 음수이거나 너무 작으면 경고
    if (availableHeight < 50) {
      console.warn(`사용 가능한 높이가 너무 작습니다: ${availableHeight}px`);
      return;
    }

    // 리스트의 실제 컨텐츠 높이
    const listContentHeight = learningList.scrollHeight;

    // 컨텐츠가 적으면 컨텐츠 높이만큼, 많으면 사용 가능한 높이만큼
    const listHeight = Math.min(listContentHeight, availableHeight);

    // 최소 높이 보장
    const finalHeight = Math.max(listHeight, 100);

    console.log("높이 측정 성공:", {
      totalHeight,
      headerHeight,
      gaugeHeight,
      availableHeight,
      listContentHeight,
      listHeight,
      finalHeight,
    });

    learningList.style.height = finalHeight + "px";
    learningList.style.overflowY =
      listContentHeight > availableHeight ? "auto" : "hidden";
  }

  /**
   * ResizeObserver 설정
   * @private
   */
  _setupResizeObserver() {
    const videoSide = this.currentModal?.querySelector(".video-side");
    const gaugeWrap = this.currentModal?.querySelector(".gauge-wrap");

    if (!videoSide) return;

    // 기존 observer 정리
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      // 디바운스 처리
      clearTimeout(this.heightAdjustTimer);
      this.heightAdjustTimer = setTimeout(() => {
        console.log("ResizeObserver 감지: 높이 재조정");
        this._adjustLearningListHeight();
      }, 50);
    });

    this.resizeObserver.observe(videoSide);
    if (gaugeWrap) {
      this.resizeObserver.observe(gaugeWrap);
    }
  }

  /**
   * MutationObserver 설정
   * @private
   */
  _setupMutationObserver() {
    const learningList = this.currentModal?.querySelector(".learning-list");

    if (!learningList) return;

    // 기존 observer 정리
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    this.mutationObserver = new MutationObserver((mutations) => {
      // 디바운스 처리
      clearTimeout(this.heightAdjustTimer);
      this.heightAdjustTimer = setTimeout(() => {
        console.log("MutationObserver 감지: 높이 재조정");
        this._adjustLearningListHeight();
      }, 50);
    });

    this.mutationObserver.observe(learningList, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
  }

  /**
   * 이미지 로딩 대기 후 높이 조정
   * @private
   */
  async _waitForImagesAndAdjust() {
    const learningList = this.currentModal?.querySelector(".learning-list");
    if (!learningList) return;

    const images = learningList.querySelectorAll("img");

    if (images.length === 0) {
      console.log("학습 목록에 이미지 없음");
      return;
    }

    console.log(`이미지 ${images.length}개 로딩 대기 중...`);

    const imagePromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();

      return new Promise((resolve) => {
        img.onload = () => {
          console.log("이미지 로드 완료:", img.src);
          resolve();
        };
        img.onerror = () => {
          console.warn("이미지 로드 실패:", img.src);
          resolve();
        };

        // 10초 타임아웃
        setTimeout(resolve, 10000);
      });
    });

    await Promise.all(imagePromises);

    console.log("모든 이미지 로딩 완료: 높이 재조정");
    this._adjustLearningListHeight();

    // 이미지 로딩 후 다시 스크롤 (높이가 변경될 수 있으므로)
    setTimeout(() => {
      this._scrollToCurrentLesson();
    }, 100);
  }

  // ============================================
  // 이벤트 핸들러
  // ============================================

  /**
   * 닫기 이벤트 설정
   * @private
   */
  _setupCloseEvents(modalElement) {
    const closeBtn = modalElement.querySelector(".close");
    if (closeBtn) {
      closeBtn.onclick = () => this.close();
    }

    modalElement.onclick = (e) => {
      if (e.target === modalElement) this.close();
    };
  }

  /**
   * 키보드 이벤트 설정
   * @private
   */
  _setupKeyboardEvents() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.currentModal && this.currentModal.style.display === "block") {
          this.close();
        }
      }
    });
  }

  /**
   * 모달 닫기
   */
  close() {
    if (!this.currentModal) return;

    const iframe = this.currentModal.querySelector("#videoFrame");
    if (iframe) iframe.src = "";

    this.currentModal.style.display = "none";

    if (this.currentLearningIndex !== null) {
      const currentLesson =
        this.markerManager.allMarkers[this.currentLearningIndex];

      // 챕터 마커는 시작점 표시용이므로 완료 처리 안 함
      if (currentLesson.isChapterMarker) {
        console.log(
          `[VideoModal] 챕터 마커는 완료 처리 안 함: ${currentLesson.label}`
        );
        this.currentLearningIndex = null;
        this.currentChapterInfo = null;
        return;
      }

      // 완료된 학습을 다시 본 경우 (재학습)
      if (currentLesson.completed) {
        console.log(
          `[VideoModal] 재학습 완료: [${this.currentLearningIndex}] ${currentLesson.label} - 게이지 유지`
        );
        // 게이지바는 이동하지 않음 (completeLesson 호출하지 않음)
      } else {
        // 새로운 학습 완료
        console.log(
          `[VideoModal] 새 학습 완료: [${this.currentLearningIndex}] ${currentLesson.label}`
        );
        this.markerManager.completeLesson(this.currentLearningIndex);
      }

      this.currentLearningIndex = null;
      this.currentChapterInfo = null;
    }
  }

  /**
   * 모달 제거
   */
  destroy() {
    if (this.currentModal) {
      // 이전 모달 닫을 때 완료 처리
      if (this.currentLearningIndex !== null) {
        const currentLesson =
          this.markerManager.allMarkers[this.currentLearningIndex];

        // 챕터 마커는 완료 처리 안 함
        if (!currentLesson.isChapterMarker) {
          // 완료된 학습을 다시 본 경우 (재학습)
          if (currentLesson.completed) {
            console.log(
              `[VideoModal] 재학습 완료 (destroy): [${this.currentLearningIndex}] ${currentLesson.label} - 게이지 유지`
            );
          } else {
            // 새로운 학습 완료
            console.log(
              `[VideoModal] 새 학습 완료 (destroy): [${this.currentLearningIndex}] ${currentLesson.label}`
            );
            this.markerManager.completeLesson(this.currentLearningIndex);
          }
        }

        this.currentLearningIndex = null;
        this.currentChapterInfo = null;
      }

      // Observer들 정리
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }

      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }

      // 타이머 정리
      if (this.heightAdjustTimer) {
        clearTimeout(this.heightAdjustTimer);
        this.heightAdjustTimer = null;
      }

      // 재시도 카운터 초기화
      this._retryCount = 0;

      this.currentModal.remove();
      this.currentModal = null;
    }
  }
}
