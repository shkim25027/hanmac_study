/**
 * 학습 경로 설정
 * 공통 모듈 활용 (ErrorHandler, Utils, ConfigManager)
 */
const LEARNING_CONFIG = {
  // 마커 설정 - 챕터별로 그룹화
  chapters: [
    {
      id: 1,
      name: "개인정보보호",
      type: "chapter",
      pathPercent: 0.108,
      pathPercentMo: 0.108, // PC와 동일 순서
      gaugePercent: 0.108,
      gaugePercentMo: 0.108,
      url: "OXTYn3JkkCQ",
      completed: false, // 하위 lessons가 모두 완료되면 자동으로 true
      lessons: [
        {
          pathPercent: 0.137,
          pathPercentMo: 0.137,
          gaugePercent: 0.137,
          gaugePercentMo: 0.137,
          type: "normal",
          label: "개인정보보호 1",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.159,
          pathPercentMo: 0.159,
          gaugePercent: 0.156,
          gaugePercentMo: 0.156,
          type: "normal",
          label: "개인정보보호 2",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.182,
          pathPercentMo: 0.182,
          gaugePercent: 0.178,
          gaugePercentMo: 0.178,
          type: "normal",
          label: "개인정보보호 3",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.205,
          pathPercentMo: 0.205,
          gaugePercent: 0.202,
          gaugePercentMo: 0.202,
          type: "normal",
          label: "개인정보보호 4",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.228,
          pathPercentMo: 0.228,
          gaugePercent: 0.226,
          gaugePercentMo: 0.226,
          type: "normal",
          label: "개인정보보호 5",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.25,
          pathPercentMo: 0.25,
          gaugePercent: 0.246,
          gaugePercentMo: 0.246,
          type: "normal",
          label: "개인정보보호 6",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.272,
          pathPercentMo: 0.272,
          gaugePercent: 0.268,
          gaugePercentMo: 0.268,
          type: "normal",
          label: "개인정보보호 7",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.298,
          pathPercentMo: 0.298,
          gaugePercent: 0.296,
          gaugePercentMo: 0.296,
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
      pathPercentMo: 0.325,
      gaugePercent: 0.325,
      gaugePercentMo: 0.325,
      url: "OXTYn3JkkCQ",
      completed: false,
      lessons: [
        {
          pathPercent: 0.367,
          pathPercentMo: 0.367,
          gaugePercent: 0.358,
          gaugePercentMo: 0.358,
          type: "normal",
          label: "직장내 괴롭힘 예방 1",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.41,
          pathPercentMo: 0.41,
          gaugePercent: 0.40,
          gaugePercentMo: 0.40,
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
      pathPercentMo: 0.442,
      gaugePercent: 0.442,
      gaugePercentMo: 0.442,
      url: "OXTYn3JkkCQ",
      completed: false,
      lessons: [
        {
          pathPercent: 0.486,
          pathPercentMo: 0.486,
          gaugePercent: 0.476,
          gaugePercentMo: 0.476,
          type: "normal",
          label: "장애인 인식 개선 1",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.531,
          pathPercentMo: 0.531,
          gaugePercent: 0.526,
          gaugePercentMo: 0.526,
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
      pathPercentMo: 0.555,
      gaugePercent: 0.555,
      gaugePercentMo: 0.555,
      url: "OXTYn3JkkCQ",
      completed: false,
      lessons: [
        {
          pathPercent: 0.585,
          pathPercentMo: 0.585,
          gaugePercent: 0.582,
          gaugePercentMo: 0.582,
          type: "normal",
          label: "성희롱 예방 교육 1",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.635,
          pathPercentMo: 0.635,
          gaugePercent: 0.632,
          gaugePercentMo: 0.632,
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
      pathPercentMo: 0.67,
      gaugePercent: 0.67,
      gaugePercentMo: 0.67,
      url: "OXTYn3JkkCQ",
      completed: false,
      lessons: [
        {
          pathPercent: 0.69,
          pathPercentMo: 0.69,
          gaugePercent: 0.686,
          gaugePercentMo: 0.686,
          type: "normal",
          label: "산업안전 보건 1",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.718,
          pathPercentMo: 0.718,
          gaugePercent: 0.71,
          gaugePercentMo: 0.71,
          type: "normal",
          label: "산업안전 보건 2",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.736,
          pathPercentMo: 0.736,
          gaugePercent: 0.728,
          gaugePercentMo: 0.728,
          type: "normal",
          label: "산업안전 보건 3",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.785,
          pathPercentMo: 0.785,
          gaugePercent: 0.778,
          gaugePercentMo: 0.778,
          type: "normal",
          label: "산업안전 보건 4",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.82,
          pathPercentMo: 0.82,
          gaugePercent: 0.812,
          gaugePercentMo: 0.812,
          type: "normal",
          label: "산업안전 보건 5",
          url: "OXTYn3JkkCQ",
          completed: false,
        },
        {
          pathPercent: 0.86,
          pathPercentMo: 0.86,
          gaugePercent: 0.85,
          gaugePercentMo: 0.85,
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
    threshold: 60, // 평균 학습량: 전체의 60% 
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
    allowDisabledClick: true, // true: 비활성 마커도 클릭 가능, false: 비활성 마커 클릭 불가
    disabledClickMessage: "이전 학습을 먼저 완료해주세요.", // 비활성 마커 클릭 시 메시지
    showDisabledAlert: false, // true: 알림 표시, false: 콘솔 로그만
    showStateIndicator: {
      pc: true, // PC에서 상태 인디케이터 표시
      mo: false, // 모바일에서도 상태 인디케이터 표시 (PC와 동일)
    },
  },

  /**
   * 챕터의 완료 상태 자동 업데이트
   * 하위 lessons가 모두 완료되면 챕터도 completed = true로 변경
   */
  updateChapterCompletionStatus() {
    try {
      if (!this.chapters || !Array.isArray(this.chapters)) {
        this._handleError(new Error('chapters가 배열이 아닙니다.'), 'updateChapterCompletionStatus');
        return;
      }

      this.chapters.forEach((chapter, index) => {
        try {
          if (!chapter || !chapter.lessons || !Array.isArray(chapter.lessons)) {
            console.warn(`[LEARNING_CONFIG] 챕터 ${index}의 lessons가 유효하지 않습니다.`);
            return;
          }

          const allLessonsCompleted = chapter.lessons.every(
            (lesson) => lesson && lesson.completed === true
          );
          chapter.completed = allLessonsCompleted;
        } catch (error) {
          this._handleError(error, 'updateChapterCompletionStatus.chapter', { chapterIndex: index });
        }
      });
    } catch (error) {
      this._handleError(error, 'updateChapterCompletionStatus');
    }
  },

  /**
   * 전체 마커 배열 반환 (챕터 + lessons flat)
   * @returns {Array}
   */
  getAllMarkers() {
    try {
      // 챕터 완료 상태 업데이트
      this.updateChapterCompletionStatus();

      if (!this.chapters || !Array.isArray(this.chapters)) {
        this._handleError(new Error('chapters가 배열이 아닙니다.'), 'getAllMarkers');
        return [];
      }

      const markers = [];
      this.chapters.forEach((chapter, chapterIndex) => {
        try {
          if (!chapter) {
            console.warn(`[LEARNING_CONFIG] 챕터 ${chapterIndex}가 null입니다.`);
            return;
          }

          // 챕터 자체를 마커로 추가 (시작점 표시용, 클릭 불가)
          markers.push({
            pathPercent: chapter.pathPercent || 0,
            pathPercentMo: chapter.pathPercentMo,
            gaugePercent: chapter.gaugePercent !== undefined ? chapter.gaugePercent : (chapter.pathPercent || 0),
            gaugePercentMo: chapter.gaugePercentMo,
            type: chapter.type || 'chapter',
            label: chapter.name || `챕터 ${chapterIndex + 1}`,
            url: chapter.url || '',
            completed: chapter.completed === true,
            chapterId: chapter.id || chapterIndex + 1,
            isChapterMarker: true,
            isLearningContent: false, // 강의 아님
            isClickable: false, // 클릭 불가
          });

          // 하위 lessons 추가 (실제 강의)
          if (chapter.lessons && Array.isArray(chapter.lessons)) {
            chapter.lessons.forEach((lesson, lessonIndex) => {
              try {
                if (!lesson) {
                  console.warn(`[LEARNING_CONFIG] 챕터 ${chapterIndex}의 레슨 ${lessonIndex}가 null입니다.`);
                  return;
                }

                markers.push({
                  pathPercent: lesson.pathPercent || 0,
                  pathPercentMo: lesson.pathPercentMo,
                  gaugePercent: lesson.gaugePercent !== undefined ? lesson.gaugePercent : (lesson.pathPercent || 0),
                  gaugePercentMo: lesson.gaugePercentMo,
                  type: lesson.type || 'normal',
                  label: lesson.label || `레슨 ${lessonIndex + 1}`,
                  url: lesson.url || '',
                  completed: lesson.completed === true,
                  chapterId: chapter.id || chapterIndex + 1,
                  isChapterMarker: false,
                  isLearningContent: true, // 실제 강의
                  isClickable: true, // 클릭 가능
                });
              } catch (error) {
                this._handleError(error, 'getAllMarkers.lesson', { chapterIndex, lessonIndex });
              }
            });
          }
        } catch (error) {
          this._handleError(error, 'getAllMarkers.chapter', { chapterIndex });
        }
      });

      return markers;
    } catch (error) {
      this._handleError(error, 'getAllMarkers');
      return [];
    }
  },

  /**
   * 특정 인덱스의 챕터 정보 반환
   * @param {number} globalIndex - 전체 마커 기준 인덱스
   * @returns {Object|null} { chapterIndex, chapterData, lessonIndex, lessonData, isChapterMarker }
   */
  getChapterByGlobalIndex(globalIndex) {
    try {
      if (typeof globalIndex !== 'number' || globalIndex < 0) {
        this._handleError(new Error(`유효하지 않은 globalIndex: ${globalIndex}`), 'getChapterByGlobalIndex');
        return null;
      }

      const allMarkers = this.getAllMarkers();
      
      if (!Array.isArray(allMarkers) || globalIndex >= allMarkers.length) {
        console.warn(`[LEARNING_CONFIG] globalIndex ${globalIndex}가 범위를 벗어났습니다. (총 ${allMarkers.length}개)`);
        return null;
      }

      const marker = allMarkers[globalIndex];
      if (!marker) {
        console.warn(`[LEARNING_CONFIG] globalIndex ${globalIndex}의 마커를 찾을 수 없습니다.`);
        return null;
      }

      const chapterIndex = this.chapters.findIndex(
        (ch) => ch && ch.id === marker.chapterId
      );

      if (chapterIndex === -1) {
        console.warn(`[LEARNING_CONFIG] chapterId ${marker.chapterId}에 해당하는 챕터를 찾을 수 없습니다.`);
        return null;
      }

      const chapter = this.chapters[chapterIndex];
      if (!chapter) {
        console.warn(`[LEARNING_CONFIG] 챕터 인덱스 ${chapterIndex}의 데이터가 없습니다.`);
        return null;
      }

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
        if (!chapter.lessons || !Array.isArray(chapter.lessons)) {
          console.warn(`[LEARNING_CONFIG] 챕터 ${chapterIndex}의 lessons가 유효하지 않습니다.`);
          return null;
        }

        const lessonIndex = chapter.lessons.findIndex(
          (lesson) => lesson && lesson.pathPercent === marker.pathPercent
        );

        if (lessonIndex === -1) {
          console.warn(`[LEARNING_CONFIG] pathPercent ${marker.pathPercent}에 해당하는 레슨을 찾을 수 없습니다.`);
          return null;
        }

        return {
          chapterIndex,
          chapterData: chapter,
          lessonIndex,
          lessonData: marker,
          isChapterMarker: false,
        };
      }
    } catch (error) {
      this._handleError(error, 'getChapterByGlobalIndex', { globalIndex });
      return null;
    }
  },

  /**
   * 로컬 인덱스를 글로벌 인덱스로 변환
   * @param {number} chapterIndex - 챕터 인덱스
   * @param {number} lessonIndex - 챕터 내 학습 인덱스 (-1이면 챕터 자체)
   * @returns {number|null}
   */
  toGlobalIndex(chapterIndex, lessonIndex) {
    try {
      if (typeof chapterIndex !== 'number' || chapterIndex < 0) {
        this._handleError(new Error(`유효하지 않은 chapterIndex: ${chapterIndex}`), 'toGlobalIndex');
        return null;
      }

      if (typeof lessonIndex !== 'number') {
        this._handleError(new Error(`유효하지 않은 lessonIndex: ${lessonIndex}`), 'toGlobalIndex');
        return null;
      }

      if (!this.chapters || !Array.isArray(this.chapters)) {
        this._handleError(new Error('chapters가 배열이 아닙니다.'), 'toGlobalIndex');
        return null;
      }

      if (chapterIndex >= this.chapters.length) {
        console.warn(`[LEARNING_CONFIG] chapterIndex ${chapterIndex}가 범위를 벗어났습니다. (총 ${this.chapters.length}개)`);
        return null;
      }

      let globalIndex = 0;

      for (let i = 0; i < chapterIndex; i++) {
        const chapter = this.chapters[i];
        if (!chapter) {
          console.warn(`[LEARNING_CONFIG] 챕터 인덱스 ${i}가 null입니다.`);
          continue;
        }

        globalIndex += 1; // 챕터 마커
        
        if (chapter.lessons && Array.isArray(chapter.lessons)) {
          globalIndex += chapter.lessons.length; // 하위 lessons
        }
      }

      if (lessonIndex === -1) {
        // 챕터 마커 자체
        return globalIndex;
      } else {
        // 하위 lesson
        const chapter = this.chapters[chapterIndex];
        if (!chapter || !chapter.lessons || !Array.isArray(chapter.lessons)) {
          console.warn(`[LEARNING_CONFIG] 챕터 ${chapterIndex}의 lessons가 유효하지 않습니다.`);
          return null;
        }

        if (lessonIndex >= chapter.lessons.length) {
          console.warn(`[LEARNING_CONFIG] lessonIndex ${lessonIndex}가 범위를 벗어났습니다. (총 ${chapter.lessons.length}개)`);
          return null;
        }

        return globalIndex + 1 + lessonIndex;
      }
    } catch (error) {
      this._handleError(error, 'toGlobalIndex', { chapterIndex, lessonIndex });
      return null;
    }
  },

  /**
   * 에러 처리 헬퍼
   * @private
   */
  _handleError(error, context, additionalInfo = {}) {
    if (typeof ErrorHandler !== 'undefined' && ErrorHandler) {
      ErrorHandler.handle(error, {
        context: `LEARNING_CONFIG.${context}`,
        component: 'LEARNING_CONFIG',
        ...additionalInfo
      }, false);
    } else {
      console.error(`[LEARNING_CONFIG] ${context}:`, error, additionalInfo);
    }
  },

  /**
   * 설정 유효성 검증
   * @returns {boolean}
   */
  validate() {
    try {
      if (!this.chapters || !Array.isArray(this.chapters)) {
        this._handleError(new Error('chapters가 배열이 아닙니다.'), 'validate');
        return false;
      }

      let isValid = true;
      this.chapters.forEach((chapter, index) => {
        if (!chapter) {
          console.warn(`[LEARNING_CONFIG] 챕터 ${index}가 null입니다.`);
          isValid = false;
          return;
        }

        if (!chapter.id) {
          console.warn(`[LEARNING_CONFIG] 챕터 ${index}에 id가 없습니다.`);
          isValid = false;
        }

        if (!chapter.name) {
          console.warn(`[LEARNING_CONFIG] 챕터 ${index}에 name이 없습니다.`);
          isValid = false;
        }

        if (!chapter.lessons || !Array.isArray(chapter.lessons)) {
          console.warn(`[LEARNING_CONFIG] 챕터 ${index}의 lessons가 유효하지 않습니다.`);
          isValid = false;
        } else {
          chapter.lessons.forEach((lesson, lessonIndex) => {
            if (!lesson) {
              console.warn(`[LEARNING_CONFIG] 챕터 ${index}의 레슨 ${lessonIndex}가 null입니다.`);
              isValid = false;
            } else {
              if (!lesson.label) {
                console.warn(`[LEARNING_CONFIG] 챕터 ${index}의 레슨 ${lessonIndex}에 label이 없습니다.`);
                isValid = false;
              }
              if (typeof lesson.pathPercent !== 'number') {
                console.warn(`[LEARNING_CONFIG] 챕터 ${index}의 레슨 ${lessonIndex}에 pathPercent가 없거나 숫자가 아닙니다.`);
                isValid = false;
              }
            }
          });
        }
      });

      return isValid;
    } catch (error) {
      this._handleError(error, 'validate');
      return false;
    }
  },
};

/**
 * HTML에서 설정된 learningConfigData를 LEARNING_CONFIG에 적용
 * window.learningConfigData가 있으면 completed 상태를 업데이트
 */
if (typeof window !== "undefined" && window.learningConfigData) {
  try {
    const configData = window.learningConfigData;

    if (!configData || typeof configData !== 'object') {
      console.warn('[LEARNING_CONFIG] learningConfigData가 유효하지 않습니다.');
    } else {
      LEARNING_CONFIG.chapters.forEach((chapter, chapterIndex) => {
        try {
          if (!chapter || !chapter.id) {
            console.warn(`[LEARNING_CONFIG] 챕터 ${chapterIndex}가 유효하지 않습니다.`);
            return;
          }

          const chapterData = configData[chapter.id];

          if (chapterData) {
            // 챕터 완료 상태 업데이트
            if (chapterData.completed !== undefined) {
              chapter.completed = chapterData.completed === true;
            }

            // 레슨 완료 상태 업데이트
            if (chapterData.lessons && Array.isArray(chapterData.lessons)) {
              if (!chapter.lessons || !Array.isArray(chapter.lessons)) {
                console.warn(`[LEARNING_CONFIG] 챕터 ${chapterIndex}의 lessons가 유효하지 않습니다.`);
                return;
              }

              chapterData.lessons.forEach((lessonData, index) => {
                try {
                  if (chapter.lessons[index] && lessonData && lessonData.completed !== undefined) {
                    chapter.lessons[index].completed = lessonData.completed === true;
                  }
                } catch (error) {
                  console.error(`[LEARNING_CONFIG] 레슨 ${index} 업데이트 에러:`, error);
                }
              });
            }
          }
        } catch (error) {
          if (typeof ErrorHandler !== 'undefined' && ErrorHandler) {
            ErrorHandler.handle(error, {
              context: 'LEARNING_CONFIG.loadFromHTML.chapter',
              chapterIndex
            }, false);
          } else {
            console.error(`[LEARNING_CONFIG] 챕터 ${chapterIndex} 업데이트 에러:`, error);
          }
        }
      });

      console.log(
        "[LEARNING_CONFIG] learningConfigData 적용 완료:",
        LEARNING_CONFIG
      );

      // 설정 유효성 검증
      if (LEARNING_CONFIG.validate) {
        const isValid = LEARNING_CONFIG.validate();
        if (!isValid) {
          console.warn('[LEARNING_CONFIG] 설정 유효성 검증 실패');
        }
      }
    }
  } catch (error) {
    if (typeof ErrorHandler !== 'undefined' && ErrorHandler) {
      ErrorHandler.handle(error, {
        context: 'LEARNING_CONFIG.loadFromHTML'
      }, false);
    } else {
      console.error('[LEARNING_CONFIG] learningConfigData 적용 에러:', error);
    }
  }
}
