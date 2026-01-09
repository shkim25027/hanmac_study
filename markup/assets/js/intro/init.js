/**
 * intro-init.js
 * 인트로 페이지 초기화
 * 공통 모듈 활용 (ErrorHandler, DOMUtils, Utils, EventManager)
 */

// 전역 의존성 (폴백 포함)
const _initDomUtils = typeof DOMUtils !== 'undefined' ? DOMUtils : null;
const _initErrorHandler = typeof ErrorHandler !== 'undefined' ? ErrorHandler : null;
const _initUtils = typeof Utils !== 'undefined' ? Utils : null;
const _initEventManager = typeof eventManager !== 'undefined' ? eventManager : null;

/**
 * 에러 처리 헬퍼
 * @private
 */
function _handleError(error, context, additionalInfo = {}) {
  if (_initErrorHandler) {
    _initErrorHandler.handle(error, {
      context: `IntroInit.${context}`,
      component: 'IntroInit',
      ...additionalInfo
    }, false);
  } else {
    console.error(`[IntroInit] ${context}:`, error, additionalInfo);
  }
}

/**
 * 페이지 초기 설정
 */
function initializeIntroPage() {
  try {
    // DOM 요소 선택
    const cardsContainer = _initDomUtils?.$("#cardsContainer") || document.getElementById("cardsContainer");
    const ctaBtn = _initDomUtils?.$("#ctaBtn") || document.getElementById("ctaBtn");
    const maskContainer = _initDomUtils?.$("#maskContainer") || document.getElementById("maskContainer");
    const typedNameEl = _initDomUtils?.$("#typedName") || document.getElementById("typedName");
    const cursorEl = _initDomUtils?.$("#cursor") || document.getElementById("cursor");

    // 초기 요소 숨김 처리
    if (cardsContainer) {
      if (_initDomUtils && _initDomUtils.setStyles) {
        _initDomUtils.setStyles(cardsContainer, { display: 'none' });
      } else {
        cardsContainer.style.display = "none";
      }
    } else {
      console.warn('[IntroInit] cardsContainer 요소를 찾을 수 없습니다.');
    }

    if (ctaBtn) {
      if (_initDomUtils && _initDomUtils.setStyles) {
        _initDomUtils.setStyles(ctaBtn, { display: 'none' });
      } else {
        ctaBtn.style.display = "none";
      }
    } else {
      console.warn('[IntroInit] ctaBtn 요소를 찾을 수 없습니다.');
    }

    if (maskContainer) {
      maskContainer.style.setProperty("--size", "30px");
    } else {
      console.warn('[IntroInit] maskContainer 요소를 찾을 수 없습니다.');
    }

    // 이벤트 리스너 등록
    if (typeof initEventListeners === 'function') {
      try {
        initEventListeners();
      } catch (error) {
        _handleError(error, 'initializeIntroPage.initEventListeners');
      }
    } else {
      console.warn('[IntroInit] initEventListeners 함수를 찾을 수 없습니다.');
    }

    // typedIndex 초기화 및 typedName 요소 초기화
    if (typeof INTRO_STATE !== 'undefined') {
      INTRO_STATE.typedIndex = 0;
    } else {
      console.warn('[IntroInit] INTRO_STATE가 정의되지 않았습니다.');
    }

    if (typedNameEl) {
      typedNameEl.textContent = "";
    } else {
      console.warn('[IntroInit] typedName 요소를 찾을 수 없습니다.');
    }

    if (cursorEl) {
      if (_initDomUtils && _initDomUtils.setStyles) {
        _initDomUtils.setStyles(cursorEl, { opacity: '1' });
      } else {
        cursorEl.style.opacity = "1";
      }
    } else {
      console.warn('[IntroInit] cursor 요소를 찾을 수 없습니다.');
    }

    // 타이핑 애니메이션 시작 (INTRO_CONFIG가 준비된 후)
    const animationDelay = 800;
    const delayFn = _initUtils && _initUtils.delay ? _initUtils.delay : (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    delayFn(animationDelay).then(() => {
      try {
        if (typeof INTRO_CONFIG !== 'undefined' && typeof INTRO_STATE !== 'undefined' && INTRO_CONFIG.fullName) {
          // text-ani 섹션 표시 (CSS에서 display: none이므로 animating 클래스 추가)
          const textAniSection = _initDomUtils?.$('.text-ani') || document.querySelector('.text-ani');
          if (textAniSection) {
            if (_initDomUtils && _initDomUtils.addClasses) {
              _initDomUtils.addClasses(textAniSection, 'animating');
            } else {
              textAniSection.classList.add('animating');
            }
          }
          
          INTRO_STATE.typedIndex = 0;
          
          if (typeof typeName === 'function') {
            typeName();
          } else {
            console.warn('[IntroInit] typeName 함수를 찾을 수 없습니다.');
          }
        } else {
          console.warn('[IntroInit] INTRO_CONFIG 또는 INTRO_STATE가 준비되지 않았거나 fullName이 없습니다.');
        }
      } catch (error) {
        _handleError(error, 'initializeIntroPage.animationStart');
      }
    });
  } catch (error) {
    _handleError(error, 'initializeIntroPage');
  }
}

// DOM이 로드되면 초기화 실행
function setupInitialization() {
  try {
    if (document.readyState === "loading") {
      // EventManager를 사용하여 이벤트 등록 (폴백 포함)
      if (_initEventManager) {
        _initEventManager.once(document, "DOMContentLoaded", initializeIntroPage);
      } else {
        document.addEventListener("DOMContentLoaded", initializeIntroPage, { once: true });
      }
    } else {
      // DOMContentLoaded 이벤트가 이미 발생한 경우
      initializeIntroPage();
    }
  } catch (error) {
    _handleError(error, 'setupInitialization');
    // 폴백: 에러가 발생해도 초기화 시도
    if (document.readyState !== "loading") {
      initializeIntroPage();
    }
  }
}

setupInitialization();

/**
 * 외부에서 사용자 이름을 설정하고 다시 시작하는 함수
 * @param {string} name - 사용자 이름
 */
function restartIntroWithName(name) {
  try {
    // 입력 검증
    if (typeof name !== 'string' || name.trim() === '') {
      _handleError(new Error('유효하지 않은 사용자 이름'), 'restartIntroWithName', { name });
      return;
    }

    if (typeof INTRO_STATE === 'undefined') {
      _handleError(new Error('INTRO_STATE가 정의되지 않았습니다'), 'restartIntroWithName');
      return;
    }

    // 이름 설정
    if (typeof setUserName === 'function') {
      try {
        setUserName(name);
      } catch (error) {
        _handleError(error, 'restartIntroWithName.setUserName');
      }
    } else {
      console.warn('[IntroInit] setUserName 함수를 찾을 수 없습니다.');
    }

    // 상태 초기화
    INTRO_STATE.currentSection = 0;
    INTRO_STATE.typedIndex = 0;
    INTRO_STATE.isScrolling = false;
    INTRO_STATE.isAnimating = false;
    INTRO_STATE.section2AnimDone = false;
    clearTimeout(INTRO_STATE.autoScrollTimer);
    INTRO_STATE.lastInteractionTime = Date.now();

    // DOM 요소 선택
    const typedNameEl = _initDomUtils?.$("#typedName") || document.getElementById("typedName");
    const cursorEl = _initDomUtils?.$("#cursor") || document.getElementById("cursor");
    const welcomeEl = _initDomUtils?.$("#welcome") || document.getElementById("welcome");
    const textAniSection = _initDomUtils?.$('.text-ani') || document.querySelector('.text-ani');

    // 화면 리셋
    if (typedNameEl) {
      typedNameEl.textContent = "";
    } else {
      console.warn('[IntroInit] typedName 요소를 찾을 수 없습니다.');
    }

    if (cursorEl) {
      if (_initDomUtils && _initDomUtils.setStyles) {
        _initDomUtils.setStyles(cursorEl, { opacity: '1' });
      } else {
        cursorEl.style.opacity = "1";
      }
    } else {
      console.warn('[IntroInit] cursor 요소를 찾을 수 없습니다.');
    }

    if (welcomeEl) {
      welcomeEl.innerHTML = "";
    } else {
      console.warn('[IntroInit] welcome 요소를 찾을 수 없습니다.');
    }

    // text-ani 섹션 표시
    if (textAniSection) {
      if (_initDomUtils && _initDomUtils.addClasses) {
        _initDomUtils.addClasses(textAniSection, 'animating');
      } else {
        textAniSection.classList.add('animating');
      }
    }

    // 섹션 1로 이동
    if (typeof goToSection === 'function') {
      try {
        goToSection(0);
      } catch (error) {
        _handleError(error, 'restartIntroWithName.goToSection');
      }
    } else {
      console.warn('[IntroInit] goToSection 함수를 찾을 수 없습니다.');
    }

    // 타이핑 재시작
    const animationDelay = 800;
    const delayFn = _initUtils && _initUtils.delay ? _initUtils.delay : (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    delayFn(animationDelay).then(() => {
      try {
        if (typeof typeName === 'function') {
          typeName();
        } else {
          console.warn('[IntroInit] typeName 함수를 찾을 수 없습니다.');
        }
      } catch (error) {
        _handleError(error, 'restartIntroWithName.typeName');
      }
    });
  } catch (error) {
    _handleError(error, 'restartIntroWithName');
  }
}