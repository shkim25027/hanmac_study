/**
 * 비디오 모달 관리 클래스 (VideoModalBase 활용)
 */
class VideoModal extends VideoModalBase {
  constructor(config, markerManager) {
    super({
      videos: [], // 학습 페이지는 videos 배열을 사용하지 않음
      modalPath: config.modalPath || "./_modal/video-learning.html",
      modalPathTemplate: config.modalPathTemplate || "./_modal/video-{type}.html",
      enableHeightAdjustment: true,
      enableCommentResizer: false,
      enableCommentBox: false,
    });

    // VideoModalBase의 config와 학습 페이지 config 병합
    this.config = { ...this.config, ...config };
    this.markerManager = markerManager;
    this.currentModal = null;
    this.currentLearningIndex = null;
    this.currentChapterInfo = null;

    // 높이 조정 관련 (VideoModalBase의 것과 별도로 관리)
    this.resizeObserver = null;
    this.mutationObserver = null;
    this.heightAdjustTimer = null;
    this._retryCount = 0;
    this._isAdjustingHeight = false; // 높이 조정 중 플래그

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
      this.currentModalElement = modalElement; // VideoModalBase 호환성

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
      console.log(
        `[VideoModal] load 호출: index=${currentIndex}, label=${videoData?.label}`
      );

      // 새로운 챕터 정보 가져오기
      const newChapterInfo = this.config.getChapterByGlobalIndex(currentIndex);

      if (!newChapterInfo) {
        throw new Error(`챕터 정보를 찾을 수 없습니다: index=${currentIndex}`);
      }

      // 같은 챕터 내에서 학습 변경인지 확인
      const isSameChapter =
        this.currentModal &&
        this.currentChapterInfo &&
        this.currentChapterInfo.chapterIndex === newChapterInfo.chapterIndex;

      if (isSameChapter) {
        // 같은 챕터: 비디오와 컨텐츠만 업데이트
        console.log(`[VideoModal] 같은 챕터 내 학습 변경: ${videoData.label}`);

        // 이전 학습 완료 처리
        if (
          this.currentLearningIndex !== null &&
          this.currentLearningIndex !== currentIndex
        ) {
          const previousLesson =
            this.markerManager.allMarkers[this.currentLearningIndex];
          if (!previousLesson.isChapterMarker && !previousLesson.completed) {
            console.log(
              `[VideoModal] 이전 학습 완료 처리: [${this.currentLearningIndex}] ${previousLesson.label}`
            );
            this.markerManager.completeLesson(this.currentLearningIndex);

            // 완료 처리 후 챕터 정보 다시 가져오기
            this.currentChapterInfo =
              this.config.getChapterByGlobalIndex(currentIndex);
          }
        }

        // 현재 학습 인덱스 업데이트
        this.currentLearningIndex = currentIndex;

        // 비디오와 컨텐츠만 업데이트 (목록은 유지)
        this._setupVideo(this.currentModal, videoData.url);
        this._updateContent(this.currentModal, videoData, currentIndex, false); // recreateList = false

        // 스크롤을 현재 학습으로 이동
        this._scrollToCurrentLesson();
      } else {
        // 다른 챕터: 모달 완전히 재생성
        console.log(
          `[VideoModal] 챕터 변경: ${newChapterInfo.chapterData.name}`
        );

        this.destroy();
        this.currentLearningIndex = currentIndex;
        this.currentChapterInfo = newChapterInfo;

        console.log(`[VideoModal] 챕터 정보:`, this.currentChapterInfo);

        const modalHTML = await this._fetchModal();
        const modalElement = this._parseModal(modalHTML, videoData.type || "learning");

        document.body.appendChild(modalElement);
        this.currentModal = modalElement;
        this.currentModalElement = modalElement; // VideoModalBase 호환성

        this._setupVideo(modalElement, videoData.url);
        this._updateContent(modalElement, videoData, currentIndex);
        this._show(modalElement);
      }
    } catch (error) {
      console.error("모달 로드 오류:", error);
      console.error("오류 상세:", {
        currentIndex,
        videoData,
        currentChapterInfo: this.currentChapterInfo,
      });
      alert(`비디오를 로드하는 중 오류가 발생했습니다.\n${error.message}`);
    }
  }

      /**
   * 모달 HTML 가져오기 (VideoModalBase 활용)
   * @private
   */
  async _fetchModal() {
    // VideoModalBase의 loadModalHTML 메서드 활용
    return await this.loadModalHTML("learning");
  }

      /**
   * 모달 HTML 파싱 (VideoModalBase 활용)
   * @private
   */
  _parseModal(modalHTML, modalType = "learning") {
    // VideoModalBase의 createModalFromHTML 메서드 활용
    return this.createModalFromHTML(modalHTML, modalType);
  }

      /**
   * 비디오 설정 (VideoModalBase 활용)
   * @private
   */
  _setupVideo(modalElement, videoUrl) {
    // VideoModalBase의 setupVideo 메서드 활용
    const videoData = { url: videoUrl, id: videoUrl };
    this.setupVideo(modalElement, videoData);
  }

      /**
   * 모달 컨텐츠 업데이트
   * @private
   */
  _updateContent(modalElement, videoData, currentIndex, recreateList = true) {
    this._updateTitle(modalElement, videoData.label);
    this._updateProgress(modalElement, currentIndex);

    if (recreateList) {
      // 새 챕터: 목록 재생성
      this._createLearningList(modalElement, currentIndex);
    } else {
      // 같은 챕터: 활성 상태만 업데이트
      this._updateLearningListState(modalElement, currentIndex);
    }
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
    if (!this.currentChapterInfo) {
      console.warn("[VideoModal] currentChapterInfo가 없습니다");
      return;
    }

    const currentChapter = this.currentChapterInfo.chapterData;
    const lessons = currentChapter.lessons;

    if (!lessons || lessons.length === 0) {
      console.warn("[VideoModal] lessons가 비어있습니다");
      return;
    }

    // 현재 챕터의 완료된 학습 개수
    const completedCount = lessons.filter((lesson) => lesson.completed).length;
    const totalCount = lessons.length;
    const progressPercent = Math.round((completedCount / totalCount) * 100);

    // 현재 학습의 챕터 내 로컬 인덱스 계산
    // globalStartIndex는 챕터 마커 인덱스이므로, +1 해서 첫 번째 lesson 인덱스 시작
    const globalStartIndex = this.currentChapterInfo.globalStartIndex;
    const localIndex = currentIndex - globalStartIndex - 1; // 챕터 마커 다음부터 시작

    console.log(`[VideoModal] 인덱스 계산:`, {
      currentIndex,
      globalStartIndex,
      localIndex,
      lessonLabel: this.currentChapterInfo.lessonData?.label,
    });

    const gaugeFill = modalElement.querySelector("#gaugeFill");
    const labelElement = modalElement.querySelector(
      ".gauge-labels .label:not(.current)"
    );
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

    if (!this.currentChapterInfo) {
      console.error("[VideoModal] currentChapterInfo가 없습니다");
      return;
    }

    // 현재 챕터 정보
    const currentChapter = this.currentChapterInfo.chapterData;
    const globalStartIndex = this.currentChapterInfo.globalStartIndex;

    console.log("[VideoModal] 목차 생성:", {
      chapterName: currentChapter.name,
      globalStartIndex,
      lessonsCount: currentChapter.lessons?.length,
    });

    if (globalStartIndex === undefined || globalStartIndex === null) {
      console.error(
        "[VideoModal] globalStartIndex가 유효하지 않습니다:",
        globalStartIndex
      );
      return;
    }

    // 챕터는 시작점 표시용이므로 목차에서 제외
    // 하위 lessons만 추가 (실제 강의)
    const currentChapterLessons = currentChapter.lessons;

    if (!currentChapterLessons || currentChapterLessons.length === 0) {
      console.warn("[VideoModal] lessons가 비어있습니다");
      return;
    }

    currentChapterLessons.forEach((lesson, localIndex) => {
      const globalIndex = globalStartIndex + 1 + localIndex; // 챕터 다음부터

      console.log(
        `[VideoModal] 목차 항목 생성: ${lesson.label}, globalIndex=${globalIndex}, localIndex=${localIndex}`
      );

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
   * 학습 목차 상태만 업데이트 (목록 재생성 없이)
   * @private
   */
  _updateLearningListState(modalElement, currentGlobalIndex) {
    const list = modalElement.querySelector(".learning-list");
    if (!list) return;

    console.log(
      `[VideoModal] 목차 상태 업데이트: currentIndex=${currentGlobalIndex}`
    );

    // 모든 항목의 상태 업데이트
    const listItems = list.querySelectorAll("li");

    listItems.forEach((li) => {
      const link = li.querySelector(".list");
      if (!link) return;

      const globalIndex = parseInt(link.dataset.globalIndex);

      // allMarkers에서 최신 completed 상태 가져오기
      const lessonMarker = this.markerManager.allMarkers[globalIndex];

      if (!lessonMarker) {
        console.warn(
          `[VideoModal] 마커를 찾을 수 없음: globalIndex=${globalIndex}`
        );
        return;
      }

      const isCurrentLesson = globalIndex === currentGlobalIndex;
      const isRelearning = isCurrentLesson && lessonMarker.completed;

      console.log(
        `[VideoModal] 항목 상태 업데이트: [${globalIndex}] ${lessonMarker.label}, completed=${lessonMarker.completed}, isCurrentLesson=${isCurrentLesson}`
      );

      // 클래스 업데이트
      li.className = ""; // 초기화
      if (isRelearning) {
        li.className = "active";
      } else if (lessonMarker.completed) {
        li.className = "complet";
      } else if (isCurrentLesson) {
        li.className = "active";
      }

      // data-current 속성 업데이트
      if (isCurrentLesson) {
        li.setAttribute("data-current", "true");
      } else {
        li.removeAttribute("data-current");
      }

      // 상태 텍스트 업데이트
      const stateElement = li.querySelector(".state");
      if (stateElement) {
        stateElement.textContent = this._getStateText(
          lessonMarker,
          isCurrentLesson,
          isRelearning
        );
      }
    });
  }

      /**
   * 목차 항목 생성
   * @private
   */
  _createListItem(lesson, globalIndex, localIndex, currentGlobalIndex) {
    const li = document.createElement("li");

    // globalIndex 유효성 검사
    if (
      globalIndex === undefined ||
      globalIndex === null ||
      isNaN(globalIndex)
    ) {
      console.error("[VideoModal] 유효하지 않은 globalIndex:", globalIndex);
      globalIndex = 0; // 폴백
    }

    const isCurrentLesson = globalIndex === currentGlobalIndex;
    const isRelearning = isCurrentLesson && lesson.completed; // 재학습 여부

    // 클래스 설정 (disabled 상태 없음)
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

    // 모든 항목 클릭 가능
    li.style.cursor = "pointer";

    // 현재 학습 중인 항목에 data 속성 추가
    if (isCurrentLesson) {
      li.setAttribute("data-current", "true");
    }

    // 이미지 번호 계산 (1-6 순환)
    const imageNum = (globalIndex % 6) + 1;

    // HTML 생성
    li.innerHTML = `
      <a href="#" class="list" data-global-index="${globalIndex}">
        <span class="seq">${localIndex + 1}차시</span>
        <div class="learning-box">
          <div class="thumb">
            <img src="./assets/images/video/img_learning_thumb_0${imageNum}.png" />
          </div>
          <div class="txt-box">
            <div class="title">${lesson.label}</div>
            <span class="state">${this._getStateText(lesson, isCurrentLesson, isRelearning)}</span>
          </div>
        </div>
      </a>
    `;

    // 이벤트 설정 (항상 클릭 가능)
    this._setupListItemEvent(li, globalIndex);

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
  _setupListItemEvent(li, globalIndex) {
    const link = li.querySelector(".list");

    link.addEventListener("click", (e) => {
      e.preventDefault();

      // 모달에서는 모든 항목 클릭 가능
      const clickedIndex = parseInt(e.currentTarget.dataset.globalIndex);
      const allMarkers = this.markerManager.allMarkers;
      this.load(allMarkers[clickedIndex], clickedIndex);
    });
  }

      /**
   * 모달 표시
   * @private
   */
  _show(modalElement) {
    // 모달을 먼저 숨긴 상태로 표시 (높이 조정이 보이지 않도록)
    modalElement.style.display = "block";
    modalElement.style.visibility = "hidden";
    modalElement.style.opacity = "0";
    
    setTimeout(() => {
      this._setupCloseEvents(modalElement);
      // 높이 조정 완료 후 모달 표시
      this._initializeHeightAdjustment(() => {
        // 높이 조정 완료 후 모달을 보이게 함
        modalElement.style.visibility = "visible";
        modalElement.style.opacity = "1";
        modalElement.style.transition = "opacity 0.3s ease";
        this._scrollToCurrentLesson(); // 현재 학습으로 스크롤
      });
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
   * @param {Function} onComplete - 높이 조정 완료 후 실행할 콜백
   */
  _initializeHeightAdjustment(onComplete) {
    // 1단계: 즉시 시도
    this._adjustModalContentHeight();
    this._adjustLearningListHeight();

    // 2단계: 다음 프레임에서 시도
    requestAnimationFrame(() => {
      this._adjustModalContentHeight();
      this._adjustLearningListHeight();
    });

    // 3단계: 50ms 후 시도
    setTimeout(() => {
      this._adjustModalContentHeight();
      this._adjustLearningListHeight();
    }, 50);

    // 4단계: 100ms 후 시도
    setTimeout(() => {
      this._adjustModalContentHeight();
      this._adjustLearningListHeight();
    }, 100);

    // 5단계: 200ms 후 시도 (높이 조정 완료로 간주)
    setTimeout(() => {
      this._adjustModalContentHeight();
      this._adjustLearningListHeight();
      
      // 높이 조정 완료 콜백 실행
      if (onComplete && typeof onComplete === 'function') {
        onComplete();
      }
    }, 200);

    // 6단계: ResizeObserver 설정
    this._setupResizeObserver();

    // 7단계: MutationObserver 설정
    this._setupMutationObserver();

    // 8단계: 이미지 로딩 대기 (이미지 로딩 후에도 높이 재조정)
    this._waitForImagesAndAdjust();
  }

      /**
   * 모달 컨텐츠 높이 조정
   * 높이가 화면 높이의 80% 이상일 때만 조절하고, 아닐 경우 80%로 유지
   * @private
   */
  _adjustModalContentHeight() {
    const modalContent = this.currentModal?.querySelector(".modal-content");
    if (!modalContent) {
      console.warn("modal-content 요소를 찾을 수 없습니다");
      return;
    }

    // 화면 높이의 80% 계산
    const viewportHeight = window.innerHeight;
    const maxHeight = viewportHeight * 0.8;

    // 현재 모달 컨텐츠의 실제 높이 (스타일이 적용되기 전의 자연스러운 높이)
    // 높이 스타일을 임시로 제거하여 실제 컨텐츠 높이 측정
    const originalHeight = modalContent.style.height;
    modalContent.style.height = "auto";
    const actualHeight = modalContent.scrollHeight;
    modalContent.style.height = originalHeight;

    // 실제 높이가 80% 이상이면 조절하지 않고 그대로 유지, 그렇지 않으면 80%로 설정
    if (actualHeight >= maxHeight) {
      // 80% 이상이면 높이를 조절하지 않음 (스타일 제거하여 자연스러운 높이 유지)
      modalContent.style.height = "auto";
      modalContent.style.overflowY = "auto";
    } else {
      // 80% 미만이면 80%로 설정
      modalContent.style.height = maxHeight + "px";
      modalContent.style.overflowY = "auto";
    }

    console.log("모달 컨텐츠 높이 조정:", {
      viewportHeight,
      maxHeight,
      actualHeight,
      finalHeight: modalContent.style.height,
    });
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
      this._isAdjustingHeight = false; // 실패 시 플래그 해제
      return;
    }

    // 높이 조정 중 플래그 설정
    this._isAdjustingHeight = true;

    // 스크롤 위치 저장
    const savedScrollTop = learningList.scrollTop;

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
        this._isAdjustingHeight = false; // 재시도 전 플래그 해제
        setTimeout(() => this._adjustLearningListHeight(), 100);
      } else {
        console.error("높이 측정 재시도 횟수 초과");
        this._retryCount = 0;
        this._isAdjustingHeight = false; // 실패 시 플래그 해제
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
      this._isAdjustingHeight = false; // 실패 시 플래그 해제
      return;
    }

    // 현재 설정된 높이 확인
    const currentHeight = learningList.style.height
      ? parseInt(learningList.style.height)
      : learningList.offsetHeight;

    // 리스트의 실제 컨텐츠 높이 (스타일 제거 후 측정)
    const originalHeight = learningList.style.height;
    learningList.style.height = "auto";
    const listContentHeight = learningList.scrollHeight;
    learningList.style.height = originalHeight;

    // 컨텐츠가 적으면 컨텐츠 높이만큼, 많으면 사용 가능한 높이만큼
    const listHeight = Math.min(listContentHeight, availableHeight);

    // 최소 높이 보장
    const finalHeight = Math.max(listHeight, 100);

    // 컨텐츠 높이를 CSS 변수로 설정 (::before 요소에서 사용)
    learningList.style.setProperty("--scroll-height", listContentHeight + "px");

    // 높이가 실제로 변경되는 경우에만 스타일 업데이트
    const heightChanged = Math.abs(currentHeight - finalHeight) > 1;

    if (heightChanged) {
      learningList.style.height = finalHeight + "px";
      learningList.style.overflowY =
        listContentHeight > availableHeight ? "auto" : "hidden";
    }

    // 스크롤 위치 복원 (높이 변경 여부와 관계없이)
    requestAnimationFrame(() => {
      learningList.scrollTop = savedScrollTop;
      // 높이 조정 완료 후 플래그 해제
      this._isAdjustingHeight = false;
    });

    console.log("높이 측정 성공:", {
      totalHeight,
      headerHeight,
      gaugeHeight,
      availableHeight,
      listContentHeight,
      listHeight,
      finalHeight,
      currentHeight,
      heightChanged,
      savedScrollTop,
    });
  }

      /**
   * ResizeObserver 설정
   * @private
   */
  _setupResizeObserver() {
    const videoSide = this.currentModal?.querySelector(".video-side");
    const gaugeWrap = this.currentModal?.querySelector(".gauge-wrap");
    const modalContent = this.currentModal?.querySelector(".modal-content");

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
        this._adjustModalContentHeight();
        this._adjustLearningListHeight();
      }, 50);
    });

    this.resizeObserver.observe(videoSide);
    if (gaugeWrap) {
      this.resizeObserver.observe(gaugeWrap);
    }
    if (modalContent) {
      this.resizeObserver.observe(modalContent);
    }

    // window resize 이벤트도 감지
    this._windowResizeHandler = () => {
      clearTimeout(this.heightAdjustTimer);
      this.heightAdjustTimer = setTimeout(() => {
        console.log("Window resize 감지: 높이 재조정");
        this._adjustModalContentHeight();
        this._adjustLearningListHeight();
      }, 50);
    };
    window.addEventListener("resize", this._windowResizeHandler);
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
      // 높이 조정 중이면 무시 (무한 루프 방지)
      if (this._isAdjustingHeight) {
        return;
      }

      // learning-list의 style 속성 변경은 무시 (우리가 조정한 것)
      const hasRelevantChange = mutations.some((mutation) => {
        // learning-list 자체의 style 변경은 무시
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style" &&
          mutation.target === learningList
        ) {
          return false;
        }
        // childList 변경이나 다른 요소의 변경만 감지
        return mutation.type === "childList" || 
               (mutation.type === "attributes" && mutation.target !== learningList);
      });

      if (!hasRelevantChange) {
        return;
      }

      // 디바운스 처리
      clearTimeout(this.heightAdjustTimer);
      this.heightAdjustTimer = setTimeout(() => {
        console.log("MutationObserver 감지: 높이 재조정");
        this._adjustModalContentHeight();
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
    this._adjustModalContentHeight();
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
      lose() {
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
   * 모달 제거 (VideoModalBase 활용)
   */
      estroy() {
    if (this.currentModal) {
      // 이전 모달 닫을 때 완료 처리 (학습 페이지 특화)
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

      // 비디오 중지 (VideoModalBase 활용)
      const iframe = this.currentModal.querySelector("#videoFrame");
      if (iframe) {
        VideoBase.stop(iframe);
      }

      // Observer들 정리 (학습 페이지 특화 Observer)
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

      // window resize 이벤트 리스너 제거
      if (this._windowResizeHandler) {
        window.removeEventListener("resize", this._windowResizeHandler);
        this._windowResizeHandler = null;
      }

      // 재시도 카운터 초기화
      this._retryCount = 0;

      // VideoModalBase의 cleanupObservers도 호출
      super.cleanupObservers();

      // 모달 제거
      this.currentModal.remove();
      this.currentModal = null;
      this.currentModalElement = null; // VideoModalBase 호환성
    }
  }
}
