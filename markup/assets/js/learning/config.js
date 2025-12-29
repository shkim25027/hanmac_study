/**
 * 학습 경로 설정
 */
const LEARNING_CONFIG = {
  // 마커 설정 - 챕터별로 그룹화
  chapters: [
    {
      id: 1,
      name: "개인정보보호",
      type: "chapter",
      pathPercent: 0.108,
      url: "OXTYn3JkkCQ",
      completed: false, // 하위 lessons가 모두 완료되면 자동으로 true
      lessons: [
        {
          pathPercent: 0.137,
          type: "normal",
          label: "개인정보보호 1",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.159,
          type: "normal",
          label: "개인정보보호 2",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.182,
          type: "normal",
          label: "개인정보보호 3",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.205,
          type: "normal",
          label: "개인정보보호 4",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.228,
          type: "normal",
          label: "개인정보보호 5",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.25,
          type: "normal",
          label: "개인정보보호 6",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.272,
          type: "normal",
          label: "개인정보보호 7",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.298,
          type: "normal",
          label: "개인정보보호 8",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
      ],
    },
    {
      id: 2,
      name: "직장내 괴롭힘 예방",
      type: "chapter",
      pathPercent: 0.325,
      url: "OXTYn3JkkCQ",
      completed: false,
      lessons: [
        {
          pathPercent: 0.367,
          type: "normal",
          label: "직장내 괴롭힘 예방 1",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.41,
          type: "normal",
          label: "직장내 괴롭힘 예방 2",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
      ],
    },
    {
      id: 3,
      name: "장애인 인식 개선",
      type: "chapter",
      pathPercent: 0.442,
      url: "OXTYn3JkkCQ",
      completed: false,
      lessons: [
        {
          pathPercent: 0.486,
          type: "normal",
          label: "장애인 인식 개선 1",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.531,
          type: "normal",
          label: "장애인 인식 개선 2",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
      ],
    },
    {
      id: 4,
      name: "성희롱 예방 교육",
      type: "chapter",
      pathPercent: 0.555,
      url: "OXTYn3JkkCQ",
      completed: false,
      lessons: [
        {
          pathPercent: 0.585,
          type: "normal",
          label: "성희롱 예방 교육 1",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.635,
          type: "normal",
          label: "성희롱 예방 교육 2",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
      ],
    },
    {
      id: 5,
      name: "산업안전 보건",
      type: "chapter",
      pathPercent: 0.67,
      url: "OXTYn3JkkCQ",
      completed: false,
      lessons: [
        {
          pathPercent: 0.69,
          type: "normal",
          label: "산업안전 보건 1",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.718,
          type: "normal",
          label: "산업안전 보건 2",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.736,
          type: "normal",
          label: "산업안전 보건 3",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.785,
          type: "normal",
          label: "산업안전 보건 4",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.82,
          type: "normal",
          label: "산업안전 보건 5",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.86,
          type: "normal",
          label: "산업안전 보건 6",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
      ],
    },
  ],

  // 평균 학습량 설정 (전체 학습 항목 대비 %)
  averageProgress: {
    threshold: 80, // 평균 학습량: 전체의 70%
  },

  // 마커 이미지 경로
  markerImages: {
    normal: {
      base: "./assets/images/learning/mark_base.png",
      current: "./assets/images/learning/mark_current.png",
      completed: "./assets/images/learning/mark_completed.png",
    },
    chapter: {
      base: "./assets/images/learning/mark_chapter_base.png",
      current: "./assets/images/learning/mark_chapter_current.png",
      completed: "./assets/images/learning/mark_chapter_completed.png",
    },
  },

  // 상태 이미지 경로
  stateImages: {
    below: "./assets/images/learning/img_state_01.svg", // 평균 이하
    average: "./assets/images/learning/img_state_02.svg", // 평균
    above: "./assets/images/learning/img_state_03.svg", // 평균 이상
  },

  // 모달 경로
  modalPath: "./_modal/video-learning.html",

  // 비활성 마커 클릭 설정
  settings: {
    allowDisabledClick: false, // true: 비활성 마커도 클릭 가능, false: 비활성 마커 클릭 불가
    disabledClickMessage: "이전 학습을 먼저 완료해주세요.", // 비활성 마커 클릭 시 메시지
    showDisabledAlert: false, // true: 알림 표시, false: 콘솔 로그만
  },

  /**
   * 챕터의 완료 상태 자동 업데이트
   * 하위 lessons가 모두 완료되면 챕터도 completed = true로 변경
   */
  updateChapterCompletionStatus() {
    this.chapters.forEach((chapter) => {
      const allLessonsCompleted = chapter.lessons.every(
        (lesson) => lesson.completed
      );
      chapter.completed = allLessonsCompleted;
    });
  },

  /**
   * 전체 마커 배열 반환 (챕터 + lessons flat)
   * @returns {Array}
   */
  getAllMarkers() {
    // 챕터 완료 상태 업데이트
    this.updateChapterCompletionStatus();

    const markers = [];
    this.chapters.forEach((chapter) => {
      // 챕터 자체를 마커로 추가 (시작점 표시용, 클릭 불가)
      markers.push({
        pathPercent: chapter.pathPercent,
        type: chapter.type,
        label: chapter.name,
        url: chapter.url,
        completed: chapter.completed,
        chapterId: chapter.id,
        isChapterMarker: true,
        isLearningContent: false, // 강의 아님
        isClickable: false, // 클릭 불가
      });

      // 하위 lessons 추가 (실제 강의)
      chapter.lessons.forEach((lesson) => {
        markers.push({
          ...lesson,
          chapterId: chapter.id,
          isChapterMarker: false,
          isLearningContent: true, // 실제 강의
          isClickable: true, // 클릭 가능
        });
      });
    });

    return markers;
  },

  /**
   * 특정 인덱스의 챕터 정보 반환
   * @param {number} globalIndex - 전체 마커 기준 인덱스
   * @returns {Object} { chapterIndex, chapterData, lessonIndex, lessonData, isChapterMarker }
   */
  getChapterByGlobalIndex(globalIndex) {
    const allMarkers = this.getAllMarkers();
    const marker = allMarkers[globalIndex];

    if (!marker) return null;

    const chapterIndex = this.chapters.findIndex(
      (ch) => ch.id === marker.chapterId
    );
    const chapter = this.chapters[chapterIndex];

    if (marker.isChapterMarker) {
      // 챕터 마커인 경우
      return {
        chapterIndex,
        chapterData: chapter,
        lessonIndex: -1, // 챕터 자체이므로 -1
        lessonData: marker,
        isChapterMarker: true,
      };
    } else {
      // 일반 레슨인 경우
      const lessonIndex = chapter.lessons.findIndex(
        (lesson) => lesson.pathPercent === marker.pathPercent
      );

      return {
        chapterIndex,
        chapterData: chapter,
        lessonIndex,
        lessonData: marker,
        isChapterMarker: false,
      };
    }
  },

  /**
   * 로컬 인덱스를 글로벌 인덱스로 변환
   * @param {number} chapterIndex - 챕터 인덱스
   * @param {number} lessonIndex - 챕터 내 학습 인덱스 (-1이면 챕터 자체)
   * @returns {number}
   */
  toGlobalIndex(chapterIndex, lessonIndex) {
    let globalIndex = 0;

    for (let i = 0; i < chapterIndex; i++) {
      globalIndex += 1; // 챕터 마커
      globalIndex += this.chapters[i].lessons.length; // 하위 lessons
    }

    if (lessonIndex === -1) {
      // 챕터 마커 자체
      return globalIndex;
    } else {
      // 하위 lesson
      return globalIndex + 1 + lessonIndex;
    }
  },
};

/**
 * HTML에서 설정된 learningConfigData를 LEARNING_CONFIG에 적용
 * window.learningConfigData가 있으면 completed 상태를 업데이트
 */
if (typeof window !== 'undefined' && window.learningConfigData) {
  const configData = window.learningConfigData;
  
  LEARNING_CONFIG.chapters.forEach((chapter) => {
    const chapterData = configData[chapter.id];
    
    if (chapterData) {
      // 챕터 완료 상태 업데이트
      if (chapterData.completed !== undefined) {
        chapter.completed = chapterData.completed;
      }
      
      // 레슨 완료 상태 업데이트
      if (chapterData.lessons && Array.isArray(chapterData.lessons)) {
        chapterData.lessons.forEach((lessonData, index) => {
          if (chapter.lessons[index] && lessonData.completed !== undefined) {
            chapter.lessons[index].completed = lessonData.completed;
          }
        });
      }
    }
  });
  
  console.log('[LEARNING_CONFIG] learningConfigData 적용 완료:', LEARNING_CONFIG);
}