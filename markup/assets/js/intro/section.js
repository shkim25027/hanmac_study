/**
 * intro-section.js
 * 섹션 전환 및 스크롤 처리 로직
 * 공통 모듈 활용 (ErrorHandler, DOMUtils, AnimationUtils, Utils)
 */

// 전역 의존성 (폴백 포함)
const _sectionDomUtils = typeof DOMUtils !== 'undefined' ? DOMUtils : null;
const _sectionErrorHandler = typeof ErrorHandler !== 'undefined' ? ErrorHandler : null;
const _sectionUtils = typeof Utils !== 'undefined' ? Utils : null;
const _sectionAnimationUtils = typeof AnimationUtils !== 'undefined' ? AnimationUtils : null;

/**
 * 에러 처리 헬퍼
 * @private
 */
function _handleError(error, context, additionalInfo = {}) {
  if (_sectionErrorHandler) {
    _sectionErrorHandler.handle(error, {
      context: `IntroSection.${context}`,
      component: 'IntroSection',
      ...additionalInfo
    }, false);
  } else {
    console.error(`[IntroSection] ${context}:`, error, additionalInfo);
  }
}

/**
 * 특정 섹션으로 이동
 * @param {number} index - 이동할 섹션 인덱스 (0, 1, 2)
 */
function goToSection(index) {
  try {
    // 입력 검증
    if (typeof index !== 'number' || index < 0 || index > 2) {
      _handleError(new Error(`유효하지 않은 섹션 인덱스: ${index}`), 'goToSection');
      return;
    }

    if (typeof INTRO_STATE === 'undefined') {
      _handleError(new Error('INTRO_STATE가 정의되지 않았습니다'), 'goToSection');
      return;
    }

    if (INTRO_STATE.isAnimating) return;
    INTRO_STATE.isAnimating = true;

    // 자동 스크롤 타이머 정지
    clearTimeout(INTRO_STATE.autoScrollTimer);

    // DOM 요소 선택
    const section1Text = _sectionDomUtils?.$("#section1Text") || document.getElementById("section1Text");
    const section2Text = _sectionDomUtils?.$("#section2Text") || document.getElementById("section2Text");
    const section3Text = _sectionDomUtils?.$("#section3Text") || document.getElementById("section3Text");
    const cardsContainer = _sectionDomUtils?.$("#cardsContainer") || document.getElementById("cardsContainer");
    const ctaBtn = _sectionDomUtils?.$("#ctaBtn") || document.getElementById("ctaBtn");
    const scrollIndicator = _sectionDomUtils?.$("#scrollIndicator") || document.getElementById("scrollIndicator");

    // 요소 존재 확인
    if (!section1Text || !section2Text || !section3Text || !cardsContainer || !ctaBtn || !scrollIndicator) {
      _handleError(new Error('필수 DOM 요소를 찾을 수 없습니다'), 'goToSection');
      INTRO_STATE.isAnimating = false;
      return;
    }

    // 현재 섹션 페이드 아웃
    const currentSection = INTRO_STATE.currentSection;
    if (currentSection === 0) {
      if (_sectionDomUtils && _sectionDomUtils.addClasses) {
        _sectionDomUtils.addClasses(section1Text, 'fade-out');
      } else {
        section1Text.classList.add("fade-out");
      }
    } else if (currentSection === 1) {
      if (_sectionDomUtils && _sectionDomUtils.addClasses) {
        _sectionDomUtils.addClasses(section2Text, 'fade-out');
      } else {
        section2Text.classList.add("fade-out");
      }
      
      // 카드 숨기기
      ["card1", "card2", "card3"].forEach((id) => {
        const card = _sectionDomUtils?.$(`#${id}`) || document.getElementById(id);
        if (card) {
          if (_sectionDomUtils && _sectionDomUtils.removeClasses) {
            _sectionDomUtils.removeClasses(card, 'show');
          } else {
            card.classList.remove("show");
          }
        }
      });
    } else if (currentSection === 2) {
      if (_sectionDomUtils && _sectionDomUtils.addClasses) {
        _sectionDomUtils.addClasses(section3Text, 'fade-out');
      } else {
        section3Text.classList.add("fade-out");
      }
      if (_sectionDomUtils && _sectionDomUtils.removeClasses) {
        _sectionDomUtils.removeClasses(ctaBtn, 'show');
      } else {
        ctaBtn.classList.remove("show");
      }
    }

    // 전환 애니메이션 지연
    const transitionDelay = 400;
    const delayFn = _sectionUtils && _sectionUtils.delay ? _sectionUtils.delay : (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    delayFn(transitionDelay).then(() => {
      try {
        // 모든 섹션 숨기기
        if (_sectionDomUtils && _sectionDomUtils.addClasses) {
          _sectionDomUtils.addClasses(section1Text, 'hidden');
          _sectionDomUtils.addClasses(section2Text, 'hidden');
          _sectionDomUtils.addClasses(section3Text, 'hidden');
        } else {
          section1Text.classList.add("hidden");
          section2Text.classList.add("hidden");
          section3Text.classList.add("hidden");
        }

        if (_sectionDomUtils && _sectionDomUtils.removeClasses) {
          _sectionDomUtils.removeClasses(scrollIndicator, 'sec2');
          _sectionDomUtils.removeClasses(section1Text, 'fade-out');
          _sectionDomUtils.removeClasses(section2Text, 'fade-out');
          _sectionDomUtils.removeClasses(section3Text, 'fade-out');
        } else {
          scrollIndicator.classList.remove("sec2");
          section1Text.classList.remove("fade-out");
          section2Text.classList.remove("fade-out");
          section3Text.classList.remove("fade-out");
        }

        // 목표 섹션 표시
        if (index === 0) {
          if (_sectionDomUtils && _sectionDomUtils.removeClasses) {
            _sectionDomUtils.removeClasses(section1Text, 'hidden');
            _sectionDomUtils.removeClasses(scrollIndicator, 'hidden');
          } else {
            section1Text.classList.remove("hidden");
            scrollIndicator.classList.remove("hidden");
          }
          
          if (_sectionDomUtils && _sectionDomUtils.setStyles) {
            _sectionDomUtils.setStyles(cardsContainer, { display: 'none' });
            _sectionDomUtils.setStyles(ctaBtn, { display: 'none' });
          } else {
            cardsContainer.style.display = "none";
            ctaBtn.style.display = "none";
          }
        } else if (index === 1) {
          if (_sectionDomUtils && _sectionDomUtils.addClasses) {
            _sectionDomUtils.addClasses(scrollIndicator, 'sec2');
            _sectionDomUtils.removeClasses(section2Text, 'hidden');
            _sectionDomUtils.removeClasses(scrollIndicator, 'hidden');
          } else {
            scrollIndicator.classList.add("sec2");
            section2Text.classList.remove("hidden");
            scrollIndicator.classList.remove("hidden");
          }
          
          if (_sectionDomUtils && _sectionDomUtils.setStyles) {
            _sectionDomUtils.setStyles(cardsContainer, { display: 'flex' });
            _sectionDomUtils.setStyles(ctaBtn, { display: 'none' });
          } else {
            cardsContainer.style.display = "flex";
            ctaBtn.style.display = "none";
          }
          
          resetSection2();
          setTimeout(animateSection2, 200);
        } else if (index === 2) {
          if (_sectionDomUtils && _sectionDomUtils.removeClasses) {
            _sectionDomUtils.removeClasses(section3Text, 'hidden');
            _sectionDomUtils.addClasses(scrollIndicator, 'hidden');
            _sectionDomUtils.removeClasses(scrollIndicator, 'sec2');
          } else {
            section3Text.classList.remove("hidden");
            scrollIndicator.classList.add("hidden");
            scrollIndicator.classList.remove("sec2");
          }
          
          if (_sectionDomUtils && _sectionDomUtils.setStyles) {
            _sectionDomUtils.setStyles(cardsContainer, { display: 'none' });
            _sectionDomUtils.setStyles(ctaBtn, { display: 'block' });
          } else {
            cardsContainer.style.display = "none";
            ctaBtn.style.display = "block";
          }
          
          resetSection3();
          setTimeout(animateSection3, 200);
        }

        INTRO_STATE.currentSection = index;
        
        // 애니메이션 완료 플래그 리셋
        const resetDelay = 500;
        delayFn(resetDelay).then(() => {
          INTRO_STATE.isAnimating = false;
        });
      } catch (error) {
        _handleError(error, 'goToSection.transition');
        INTRO_STATE.isAnimating = false;
      }
    });
  } catch (error) {
    _handleError(error, 'goToSection');
    if (typeof INTRO_STATE !== 'undefined') {
      INTRO_STATE.isAnimating = false;
    }
  }
}

/**
 * 다음 섹션으로 스크롤
 */
function handleScrollDown() {
  try {
    if (typeof INTRO_STATE === 'undefined') {
      _handleError(new Error('INTRO_STATE가 정의되지 않았습니다'), 'handleScrollDown');
      return;
    }

    if (INTRO_STATE.isScrolling || INTRO_STATE.isAnimating) return;

    const delayFn = _sectionUtils && _sectionUtils.delay ? _sectionUtils.delay : (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const scrollCooldown = 700;

    if (INTRO_STATE.currentSection === 0) {
      INTRO_STATE.isScrolling = true;
      delayFn(scrollCooldown).then(() => {
        INTRO_STATE.isScrolling = false;
      });
      goToSection(1);
    } else if (INTRO_STATE.currentSection === 1 && INTRO_STATE.section2AnimDone) {
      INTRO_STATE.isScrolling = true;
      delayFn(scrollCooldown).then(() => {
        INTRO_STATE.isScrolling = false;
      });
      goToSection(2);
    }
  } catch (error) {
    _handleError(error, 'handleScrollDown');
  }
}

/**
 * 이전 섹션으로 스크롤
 */
function handleScrollUp() {
  try {
    if (typeof INTRO_STATE === 'undefined') {
      _handleError(new Error('INTRO_STATE가 정의되지 않았습니다'), 'handleScrollUp');
      return;
    }

    if (INTRO_STATE.isScrolling || INTRO_STATE.isAnimating) return;
    
    INTRO_STATE.isScrolling = true;
    const delayFn = _sectionUtils && _sectionUtils.delay ? _sectionUtils.delay : (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const scrollCooldown = 700;
    
    delayFn(scrollCooldown).then(() => {
      INTRO_STATE.isScrolling = false;
    });

    if (INTRO_STATE.currentSection === 2) {
      goToSection(1);
    } else if (INTRO_STATE.currentSection === 1) {
      goToSection(0);
    }
  } catch (error) {
    _handleError(error, 'handleScrollUp');
  }
}