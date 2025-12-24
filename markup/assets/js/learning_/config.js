/**
 * 학습 경로 설정
 * SVG 파일의 실제 마커 위치에 기반
 */
const LEARNING_CONFIG = {
  // 마커 설정 - 챕터별로 그룹화
  // SVG 좌표: cx, cy를 참고하여 pathPercent 설정
  chapters: [
    {
      id: 1,
      name: "개인정보보호",
      lessons: [
        {
          pathPercent: 0.82,
          type: "chapter",
          label: "챕터1-1",
          url: "OXTYn3JkkCQ",
          completed: true,
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
    allowDisabledClick: false, // true: 비활성 마커도 클릭 가능, false: 비활성 마커 클릭 불가
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
