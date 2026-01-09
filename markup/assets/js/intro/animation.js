/**
 * intro-animation.js
 * 인트로 페이지 애니메이션 함수들
 * 공통 모듈 활용 (ErrorHandler, DOMUtils, Utils, AnimationUtils)
 */

// 전역 의존성 (폴백 포함)
const _domUtils = typeof DOMUtils !== 'undefined' ? DOMUtils : null;
const _errorHandler = typeof ErrorHandler !== 'undefined' ? ErrorHandler : null;
const _utils = typeof Utils !== 'undefined' ? Utils : null;
const _animationUtils = typeof AnimationUtils !== 'undefined' ? AnimationUtils : null;

/**
 * 에러 처리 헬퍼
 * @private
 */
function _handleError(error, context, additionalInfo = {}) {
  if (_errorHandler) {
    _errorHandler.handle(error, {
      context: `IntroAnimation.${context}`,
      component: 'IntroAnimation',
      ...additionalInfo
    }, false);
  } else {
    console.error(`[IntroAnimation] ${context}:`, error, additionalInfo);
  }
}

/**
 * Section 1: 이름 타이핑 애니메이션
 */
function typeName() {
  try {
    // 안전성 검사
    if (typeof INTRO_CONFIG === 'undefined' || typeof INTRO_STATE === 'undefined') {
      _handleError(new Error('INTRO_CONFIG or INTRO_STATE is not defined'), 'typeName');
      return;
    }

    const typedNameEl = _domUtils?.$("#typedName") || document.getElementById("typedName");
    const cursorEl = _domUtils?.$("#cursor") || document.getElementById("cursor");
    
    if (!typedNameEl) {
      _handleError(new Error('typedName element not found'), 'typeName');
      return;
    }

    if (!INTRO_CONFIG.fullName || typeof INTRO_CONFIG.fullName !== 'string' || INTRO_CONFIG.fullName.length === 0) {
      _handleError(new Error('INTRO_CONFIG.fullName is empty or invalid'), 'typeName');
      return;
    }

    if (INTRO_STATE.typedIndex < INTRO_CONFIG.fullName.length) {
      const currentText = INTRO_CONFIG.fullName.slice(0, INTRO_STATE.typedIndex + 1);
      typedNameEl.textContent = currentText;
      INTRO_STATE.typedIndex++;
      
      const delay = INTRO_CONFIG.typingSpeed || 100;
      if (_utils && _utils.delay) {
        _utils.delay(delay).then(() => typeName());
      } else {
        setTimeout(typeName, delay);
      }
    } else {
      if (cursorEl) {
        if (_domUtils && _domUtils.setStyles) {
          _domUtils.setStyles(cursorEl, { opacity: '0' });
        } else {
          cursorEl.style.opacity = "0";
        }
      }
      
      const delay = 600;
      if (_utils && _utils.delay) {
        _utils.delay(delay).then(() => animateWelcome());
      } else {
        setTimeout(animateWelcome, delay);
      }
    }
  } catch (error) {
    _handleError(error, 'typeName');
  }
}

/**
 * Section 1: 환영 메시지 애니메이션
 */
function animateWelcome() {
  try {
    if (typeof INTRO_CONFIG === 'undefined' || typeof INTRO_STATE === 'undefined') {
      _handleError(new Error('INTRO_CONFIG or INTRO_STATE is not defined'), 'animateWelcome');
      return;
    }

    const container = _domUtils?.$("#welcome") || document.getElementById("welcome");
    if (!container) {
      _handleError(new Error('welcome element not found'), 'animateWelcome');
      return;
    }

    if (!INTRO_CONFIG.welcomeText || typeof INTRO_CONFIG.welcomeText !== 'string') {
      _handleError(new Error('INTRO_CONFIG.welcomeText is empty or invalid'), 'animateWelcome');
      return;
    }

    const tempDiv = _domUtils?.createElement('div') || document.createElement("div");
    tempDiv.innerHTML = INTRO_CONFIG.welcomeText;

    let html = "";
    tempDiv.childNodes.forEach((node) => {
      try {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || '';
          html += text
            .split("")
            .map((c) => {
              const escaped = c === " " ? "&nbsp;" : (c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c);
              return `<span>${escaped}</span>`;
            })
            .join("");
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const innerText = node.textContent || '';
          const tagName = node.tagName.toLowerCase();
          const escapedText = innerText
            .split("")
            .map((c) => {
              const escaped = c === " " ? "&nbsp;" : (c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c);
              return `<span>${escaped}</span>`;
            })
            .join("");
          html += `<${tagName}>${escapedText}</${tagName}>`;
        }
      } catch (error) {
        _handleError(error, 'animateWelcome.processNode', { node });
      }
    });

    container.innerHTML = html;
    const spans = container.querySelectorAll("span");
    const charSpeed = INTRO_CONFIG.welcomeCharSpeed || 50;
    
    spans.forEach((char, i) => {
      const delay = i * charSpeed;
      if (_utils && _utils.delay) {
        _utils.delay(delay).then(() => {
          if (_domUtils && _domUtils.addClasses) {
            _domUtils.addClasses(char, 'show');
          } else {
            char.classList.add("show");
          }
        });
      } else {
        setTimeout(() => {
          if (_domUtils && _domUtils.addClasses) {
            _domUtils.addClasses(char, 'show');
          } else {
            char.classList.add("show");
          }
        }, delay);
      }
    });

    // 애니메이션 완료 후 자동 스크롤 타이머 시작
    const fullNameLength = INTRO_CONFIG.fullName ? INTRO_CONFIG.fullName.length : 0;
    const totalDelay = fullNameLength * charSpeed + 1000;
    
    if (_utils && _utils.delay) {
      _utils.delay(totalDelay).then(() => startAutoScrollTimer());
    } else {
      setTimeout(() => startAutoScrollTimer(), totalDelay);
    }
  } catch (error) {
    _handleError(error, 'animateWelcome');
  }
}

/**
 * Section 2: 업데이트 텍스트 + 카드 애니메이션
 */
function animateSection2() {
  try {
    if (typeof INTRO_STATE === 'undefined') {
      _handleError(new Error('INTRO_STATE is not defined'), 'animateSection2');
      return;
    }

    const lines = ["line1", "line2", "line3"];
    const lineDelay = 600;
    
    lines.forEach((id, i) => {
      const delay = i * lineDelay;
      const element = _domUtils?.$(`#${id}`) || document.getElementById(id);
      
      if (!element) {
        console.warn(`[IntroAnimation] Element #${id} not found`);
        return;
      }

      if (_utils && _utils.delay) {
        _utils.delay(delay).then(() => {
          if (_domUtils && _domUtils.addClasses) {
            _domUtils.addClasses(element, 'show');
          } else {
            element.classList.add("show");
          }
        });
      } else {
        setTimeout(() => {
          if (_domUtils && _domUtils.addClasses) {
            _domUtils.addClasses(element, 'show');
          } else {
            element.classList.add("show");
          }
        }, delay);
      }
    });

    const cards = ["card1", "card2", "card3"];
    const cardDelay = 250;
    const totalLineDelay = lines.length * lineDelay + 300;

    if (_utils && _utils.delay) {
      _utils.delay(totalLineDelay).then(() => {
        cards.forEach((id, i) => {
          const cardElement = _domUtils?.$(`#${id}`) || document.getElementById(id);
          if (!cardElement) {
            console.warn(`[IntroAnimation] Element #${id} not found`);
            return;
          }

          const delay = i * cardDelay;
          if (_utils && _utils.delay) {
            _utils.delay(delay).then(() => {
              if (_domUtils && _domUtils.addClasses) {
                _domUtils.addClasses(cardElement, 'show');
              } else {
                cardElement.classList.add("show");
              }
              
              if (i === 2) {
                INTRO_STATE.section2AnimDone = true;
                // Section 2 애니메이션 완료 후 자동 스크롤 타이머 시작
                startAutoScrollTimer();
              }
            });
          } else {
            setTimeout(() => {
              if (_domUtils && _domUtils.addClasses) {
                _domUtils.addClasses(cardElement, 'show');
              } else {
                cardElement.classList.add("show");
              }
              
              if (i === 2) {
                INTRO_STATE.section2AnimDone = true;
                startAutoScrollTimer();
              }
            }, delay);
          }
        });
      });
    } else {
      setTimeout(() => {
        cards.forEach((id, i) => {
          const cardElement = _domUtils?.$(`#${id}`) || document.getElementById(id);
          if (!cardElement) {
            console.warn(`[IntroAnimation] Element #${id} not found`);
            return;
          }

          setTimeout(() => {
            if (_domUtils && _domUtils.addClasses) {
              _domUtils.addClasses(cardElement, 'show');
            } else {
              cardElement.classList.add("show");
            }
            
            if (i === 2) {
              INTRO_STATE.section2AnimDone = true;
              startAutoScrollTimer();
            }
          }, i * cardDelay);
        });
      }, totalLineDelay);
    }
  } catch (error) {
    _handleError(error, 'animateSection2');
  }
}

/**
 * Section 2: 애니메이션 리셋
 */
function resetSection2() {
  try {
    if (typeof INTRO_STATE === 'undefined') {
      _handleError(new Error('INTRO_STATE is not defined'), 'resetSection2');
      return;
    }

    const lines = ["line1", "line2", "line3"];
    const cards = ["card1", "card2", "card3"];

    lines.forEach((id) => {
      const element = _domUtils?.$(`#${id}`) || document.getElementById(id);
      if (element) {
        if (_domUtils && _domUtils.removeClasses) {
          _domUtils.removeClasses(element, 'show');
        } else {
          element.classList.remove("show");
        }
      }
    });

    cards.forEach((id) => {
      const element = _domUtils?.$(`#${id}`) || document.getElementById(id);
      if (element) {
        if (_domUtils && _domUtils.removeClasses) {
          _domUtils.removeClasses(element, 'show');
        } else {
          element.classList.remove("show");
        }
      }
    });

    INTRO_STATE.section2AnimDone = false;
  } catch (error) {
    _handleError(error, 'resetSection2');
  }
}

/**
 * Section 3: CTA 애니메이션
 */
function animateSection3() {
  try {
    const ctaBtn = _domUtils?.$("#ctaBtn") || document.getElementById("ctaBtn");
    const ctaLine1 = _domUtils?.$("#ctaLine1") || document.getElementById("ctaLine1");
    const ctaLine2 = _domUtils?.$("#ctaLine2") || document.getElementById("ctaLine2");

    const addShowClass = (element, delay) => {
      if (!element) {
        console.warn(`[IntroAnimation] Element not found`);
        return;
      }

      if (_utils && _utils.delay) {
        _utils.delay(delay).then(() => {
          if (_domUtils && _domUtils.addClasses) {
            _domUtils.addClasses(element, 'show');
          } else {
            element.classList.add("show");
          }
        });
      } else {
        setTimeout(() => {
          if (_domUtils && _domUtils.addClasses) {
            _domUtils.addClasses(element, 'show');
          } else {
            element.classList.add("show");
          }
        }, delay);
      }
    };

    addShowClass(ctaBtn, 100);
    addShowClass(ctaLine1, 300);
    addShowClass(ctaLine2, 500);
  } catch (error) {
    _handleError(error, 'animateSection3');
  }
}

/**
 * Section 3: 애니메이션 리셋
 */
function resetSection3() {
  try {
    const ctaLine1 = _domUtils?.$("#ctaLine1") || document.getElementById("ctaLine1");
    const ctaLine2 = _domUtils?.$("#ctaLine2") || document.getElementById("ctaLine2");
    const ctaBtn = _domUtils?.$("#ctaBtn") || document.getElementById("ctaBtn");

    const removeShowClass = (element) => {
      if (element) {
        if (_domUtils && _domUtils.removeClasses) {
          _domUtils.removeClasses(element, 'show');
        } else {
          element.classList.remove("show");
        }
      }
    };

    removeShowClass(ctaLine1);
    removeShowClass(ctaLine2);
    removeShowClass(ctaBtn);
  } catch (error) {
    _handleError(error, 'resetSection3');
  }
}

/**
 * 자동 스크롤 타이머 시작
 */
function startAutoScrollTimer() {
  try {
    if (typeof INTRO_STATE === 'undefined') {
      _handleError(new Error('INTRO_STATE is not defined'), 'startAutoScrollTimer');
      return;
    }

    if (typeof handleScrollDown !== 'function') {
      _handleError(new Error('handleScrollDown function is not defined'), 'startAutoScrollTimer');
      return;
    }

    // 기존 타이머 정리
    if (INTRO_STATE.autoScrollTimer) {
      clearTimeout(INTRO_STATE.autoScrollTimer);
      INTRO_STATE.autoScrollTimer = null;
    }

    // 첫 번째 세션(섹션 0)일 때만 1500ms, 이후는 3000ms
    const delay = INTRO_STATE.currentSection === 0 ? 1500 : 3000;
    
    if (_utils && _utils.delay) {
      _utils.delay(delay).then(() => {
        // 마지막 상호작용 후 설정된 시간이 지났는지 확인
        const now = Date.now();
        const lastInteraction = INTRO_STATE.lastInteractionTime || 0;
        
        if (now - lastInteraction >= delay) {
          try {
            handleScrollDown();
          } catch (error) {
            _handleError(error, 'startAutoScrollTimer.handleScrollDown');
          }
        }
      });
    } else {
      INTRO_STATE.autoScrollTimer = setTimeout(() => {
        try {
          // 마지막 상호작용 후 설정된 시간이 지났는지 확인
          const now = Date.now();
          const lastInteraction = INTRO_STATE.lastInteractionTime || 0;
          
          if (now - lastInteraction >= delay) {
            handleScrollDown();
          }
        } catch (error) {
          _handleError(error, 'startAutoScrollTimer.handleScrollDown');
        }
      }, delay);
    }
  } catch (error) {
    _handleError(error, 'startAutoScrollTimer');
  }
}

/**
 * 사용자 상호작용 감지 - 자동 스크롤 타이머 리셋
 */
function resetAutoScrollTimer() {
  try {
    if (typeof INTRO_STATE === 'undefined') {
      _handleError(new Error('INTRO_STATE is not defined'), 'resetAutoScrollTimer');
      return;
    }

    INTRO_STATE.lastInteractionTime = Date.now();
    startAutoScrollTimer();
  } catch (error) {
    _handleError(error, 'resetAutoScrollTimer');
  }
}