/**
 * 학습 경로 설정
 */
const LEARNING_CONFIG = {
  // 마커 설정 - 챕터별로 그룹화
  chapters: [
    {
      id: 1,
      name: "개인정보보호",
      lessons: [
        {
          pathPercent: 0.108,
          type: "chapter",
          label: "챕터1-1",
          url: "OXTYn3JkkCQ",
          completed: true,
        },
        {
          pathPercent: 0.137,
          type: "normal",
          label: "1-2단계",
          url: "OXTYn3JkkCQ",
          completed: true,
        },
        {
          pathPercent: 0.159,
          type: "normal",
          label: "1-3단계",
          url: "OXTYn3JkkCQ",
          completed: true,
        },
        {
          pathPercent: 0.182,
          type: "normal",
          label: "1-4단계",
          url: "OXTYn3JkkCQ",
          completed: true,
        },
        {
          pathPercent: 0.205,
          type: "normal",
          label: "1-5단계",
          url: "OXTYn3JkkCQ",
          completed: true,
        },
        {
          pathPercent: 0.228,
          type: "normal",
          label: "1-6단계",
          url: "OXTYn3JkkCQ",
          completed: true,
        },
        {
          pathPercent: 0.25,
          type: "normal",
          label: "1-7단계",
          url: "OXTYn3JkkCQ",
          completed: true,
        },
        {
          pathPercent: 0.272,
          type: "normal",
          label: "1-8단계",
          url: "OXTYn3JkkCQ",
          completed: true,
        },
        {
          pathPercent: 0.298,
          type: "normal",
          label: "1-9단계",
          url: "OXTYn3JkkCQ",
          completed: true,
        },
      ],
    },
    {
      id: 2,
      name: "직장내 괴롭힘 예방",
      lessons: [
        {
          pathPercent: 0.325,
          type: "chapter",
          label: "챕터2-1",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.367,
          type: "normal",
          label: "2-2단계",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.41,
          type: "normal",
          label: "2-3단계",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
      ],
    },
    {
      id: 3,
      name: "장애인 인식 개선",
      lessons: [
        {
          pathPercent: 0.442,
          type: "chapter",
          label: "챕터3-1",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.486,
          type: "normal",
          label: "3-2단계",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.531,
          type: "normal",
          label: "3-3단계",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
      ],
    },
    {
      id: 4,
      name: "성희롱 예방 교육",
      lessons: [
        {
          pathPercent: 0.555,
          type: "chapter",
          label: "챕터4-1",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.585,
          type: "normal",
          label: "4-2단계",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.635,
          type: "normal",
          label: "4-3단계",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
      ],
    },
    {
      id: 5,
      name: "산업안전 보건",
      lessons: [
        {
          pathPercent: 0.67,
          type: "chapter",
          label: "챕터5-1",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.69,
          type: "normal",
          label: "5-2단계",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.718,
          type: "normal",
          label: "5-3단계",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.736,
          type: "normal",
          label: "5-4단계",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.785,
          type: "normal",
          label: "5-5단계",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.82,
          type: "normal",
          label: "5-6단계",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.86,
          type: "normal",
          label: "5-7단계",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
      ],
    },
  ],

  // 마커 이미지 경로
  markerImages: {
    normal: {
      base: "./assets/images/learning/mark_base.svg",
      current: "./assets/images/learning/mark_current.svg",
      completed: "./assets/images/learning/mark_completed.svg",
    },
    chapter: {
      base: "./assets/images/learning/mark_chapter_base.svg",
      current: "./assets/images/learning/mark_chapter_current.svg",
      completed: "./assets/images/learning/mark_chapter_completed.svg",
    },
  },

  // 모달 경로
  modalPath: "./_modal/video-learning.html",

  // 비활성 마커 클릭 설정
  settings: {
    allowDisabledClick: true, // true: 비활성 마커도 클릭 가능, false: 비활성 마커 클릭 불가
    disabledClickMessage: "이전 학습을 먼저 완료해주세요.", // 비활성 마커 클릭 시 메시지
    showDisabledAlert: false, // true: 알림 표시, false: 콘솔 로그만
  },

  /**
   * 전체 마커 배열 반환 (flat)
   * @returns {Array}
   */
  getAllMarkers() {
    return this.chapters.flatMap((chapter) => chapter.lessons);
  },

  /**
   * 특정 인덱스의 챕터 정보 반환
   * @param {number} globalIndex - 전체 마커 기준 인덱스
   * @returns {Object} { chapterIndex, chapterData, lessonIndex, lessonData }
   */
  getChapterByGlobalIndex(globalIndex) {
    let currentIndex = 0;

    for (
      let chapterIndex = 0;
      chapterIndex < this.chapters.length;
      chapterIndex++
    ) {
      const chapter = this.chapters[chapterIndex];
      const chapterSize = chapter.lessons.length;

      if (globalIndex < currentIndex + chapterSize) {
        const lessonIndex = globalIndex - currentIndex;
        return {
          chapterIndex,
          chapterData: chapter,
          lessonIndex,
          lessonData: chapter.lessons[lessonIndex],
          globalStartIndex: currentIndex,
        };
      }

      currentIndex += chapterSize;
    }

    return null;
  },

  /**
   * 로컬 인덱스를 글로벌 인덱스로 변환
   * @param {number} chapterIndex - 챕터 인덱스
   * @param {number} lessonIndex - 챕터 내 학습 인덱스
   * @returns {number}
   */
  toGlobalIndex(chapterIndex, lessonIndex) {
    let globalIndex = 0;

    for (let i = 0; i < chapterIndex; i++) {
      globalIndex += this.chapters[i].lessons.length;
    }

    return globalIndex + lessonIndex;
  },
};
