/**
 * 애니메이션 유틸리티 모듈
 * @module AnimationUtils
 */
class AnimationUtils {
  /**
   * 순차적 요소 애니메이션
   * @param {Array|NodeList} elements - 요소 배열
   * @param {string} className - 추가할 클래스
   * @param {number} delay - 각 요소 간 지연 시간 (ms)
   * @param {Function} callback - 각 요소 애니메이션 후 콜백
   */
  static async sequentialAnimate(elements, className = "show", delay = 50, callback = null) {
    const items = Array.isArray(elements) ? elements : Array.from(elements);

    for (let i = 0; i < items.length; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          items[i].classList.add(className);
          if (callback) callback(items[i], i);
          resolve();
        }, delay * i);
      });
    }
  }

  /**
   * 요소 페이드 인/아웃
   * @param {Element} element - 대상 요소
   * @param {string} type - "in" 또는 "out"
   * @param {number} duration - 지속 시간 (ms)
   * @returns {Promise}
   */
  static async fade(element, type = "in", duration = 300) {
    if (!element) return;

    return new Promise((resolve) => {
      // 기존 display 값 저장 (grid, flex 등 유지)
      const originalDisplay = element.style.display || window.getComputedStyle(element).display;
      const isGridOrFlex = originalDisplay === "grid" || originalDisplay === "flex" || 
                          originalDisplay.includes("grid") || originalDisplay.includes("flex");

      if (type === "in") {
        // grid/flex인 경우 display를 설정하지 않음
        if (!isGridOrFlex) {
          element.style.display = "block";
        }
        element.style.opacity = "0";
        element.style.transition = `opacity ${duration}ms ease`;

        requestAnimationFrame(() => {
          element.style.opacity = "1";
          setTimeout(() => {
            element.style.transition = "";
            // grid/flex인 경우 display 스타일 제거
            if (isGridOrFlex) {
              element.style.display = "";
            }
            resolve();
          }, duration);
        });
      } else {
        element.style.opacity = "1";
        element.style.transition = `opacity ${duration}ms ease`;

        requestAnimationFrame(() => {
          element.style.opacity = "0";
          setTimeout(() => {
            // grid/flex인 경우 display를 none으로 설정하지 않음
            if (!isGridOrFlex) {
              element.style.display = "none";
            }
            element.style.transition = "";
            resolve();
          }, duration);
        });
      }
    });
  }

  /**
   * 요소 슬라이드
   * @param {Element} element - 대상 요소
   * @param {string} type - "up", "down", "left", "right"
   * @param {number} duration - 지속 시간 (ms)
   * @returns {Promise}
   */
  static async slide(element, type = "down", duration = 300) {
    if (!element) return;

    return new Promise((resolve) => {
      const isShow = type === "down" || type === "right";
      const property = type === "up" || type === "down" ? "height" : "width";
      const overflow = element.style.overflow;

      element.style.overflow = "hidden";

      if (isShow) {
        element.style.display = "block";
        const size = element[property === "height" ? "scrollHeight" : "scrollWidth"];
        element.style[property] = "0";
        element.style.transition = `${property} ${duration}ms ease`;

        requestAnimationFrame(() => {
          element.style[property] = `${size}px`;
          setTimeout(() => {
            element.style[property] = "";
            element.style.overflow = overflow;
            element.style.transition = "";
            resolve();
          }, duration);
        });
      } else {
        const size = element[property === "height" ? "offsetHeight" : "offsetWidth"];
        element.style[property] = `${size}px`;
        element.style.transition = `${property} ${duration}ms ease`;

        requestAnimationFrame(() => {
          element.style[property] = "0";
          setTimeout(() => {
            element.style.display = "none";
            element.style[property] = "";
            element.style.overflow = overflow;
            element.style.transition = "";
            resolve();
          }, duration);
        });
      }
    });
  }

  /**
   * 숫자 카운팅 애니메이션
   * @param {Element} element - 대상 요소
   * @param {number} start - 시작 값
   * @param {number} end - 종료 값
   * @param {number} duration - 지속 시간 (ms)
   * @param {Function} format - 포맷 함수
   * @returns {Promise}
   */
  static async countUp(element, start, end, duration = 1000, format = null) {
    if (!element) return;

    return new Promise((resolve) => {
      const startTime = performance.now();
      const range = end - start;

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out 효과
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = start + range * easeProgress;

        element.textContent = format ? format(current) : Math.round(current);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.textContent = format ? format(end) : end;
          resolve();
        }
      };

      requestAnimationFrame(update);
    });
  }

  /**
   * 스크롤 애니메이션
   * @param {Element|string} target - 대상 요소 또는 선택자
   * @param {Object} options - 옵션
   * @returns {Promise}
   */
  static async scrollTo(target, options = {}) {
    const {
      duration = 500,
      offset = 0,
      easing = "ease-in-out",
      container = window,
    } = options;

    const element = typeof target === "string" ? document.querySelector(target) : target;

    if (!element) return;

    return new Promise((resolve) => {
      const targetPosition =
        element.getBoundingClientRect().top +
        (container === window ? window.pageYOffset : container.scrollTop) +
        offset;

      const startPosition = container === window ? window.pageYOffset : container.scrollTop;
      const distance = targetPosition - startPosition;
      const startTime = performance.now();

      const easingFunctions = {
        linear: (t) => t,
        "ease-in": (t) => t * t,
        "ease-out": (t) => t * (2 - t),
        "ease-in-out": (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
      };

      const easingFunc = easingFunctions[easing] || easingFunctions["ease-in-out"];

      const animation = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFunc(progress);

        const position = startPosition + distance * easedProgress;

        if (container === window) {
          window.scrollTo(0, position);
        } else {
          container.scrollTop = position;
        }

        if (progress < 1) {
          requestAnimationFrame(animation);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animation);
    });
  }

  /**
   * 흔들기 애니메이션
   * @param {Element} element - 대상 요소
   * @param {number} intensity - 강도
   * @param {number} duration - 지속 시간 (ms)
   * @returns {Promise}
   */
  static async shake(element, intensity = 5, duration = 500) {
    if (!element) return;

    return new Promise((resolve) => {
      const startTime = performance.now();
      const originalTransform = element.style.transform;

      const animation = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
          const x = Math.sin(progress * Math.PI * 4) * intensity * (1 - progress);
          element.style.transform = `translateX(${x}px)`;
          requestAnimationFrame(animation);
        } else {
          element.style.transform = originalTransform;
          resolve();
        }
      };

      requestAnimationFrame(animation);
    });
  }

  /**
   * 펄스 애니메이션
   * @param {Element} element - 대상 요소
   * @param {number} scale - 스케일
   * @param {number} duration - 지속 시간 (ms)
   * @returns {Promise}
   */
  static async pulse(element, scale = 1.1, duration = 500) {
    if (!element) return;

    return new Promise((resolve) => {
      const originalTransform = element.style.transform;
      element.style.transition = `transform ${duration / 2}ms ease-in-out`;

      element.style.transform = `scale(${scale})`;

      setTimeout(() => {
        element.style.transform = originalTransform;
        setTimeout(() => {
          element.style.transition = "";
          resolve();
        }, duration / 2);
      }, duration / 2);
    });
  }

  /**
   * 바운스 애니메이션
   * @param {Element} element - 대상 요소
   * @param {number} height - 바운스 높이
   * @param {number} duration - 지속 시간 (ms)
   * @returns {Promise}
   */
  static async bounce(element, height = 20, duration = 600) {
    if (!element) return;

    return new Promise((resolve) => {
      const startTime = performance.now();
      const originalTransform = element.style.transform;

      const animation = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
          const bounceProgress = Math.sin(progress * Math.PI);
          const y = -height * bounceProgress;
          element.style.transform = `translateY(${y}px)`;
          requestAnimationFrame(animation);
        } else {
          element.style.transform = originalTransform;
          resolve();
        }
      };

      requestAnimationFrame(animation);
    });
  }

  /**
   * 회전 애니메이션
   * @param {Element} element - 대상 요소
   * @param {number} degrees - 회전 각도
   * @param {number} duration - 지속 시간 (ms)
   * @returns {Promise}
   */
  static async rotate(element, degrees = 360, duration = 500) {
    if (!element) return;

    return new Promise((resolve) => {
      element.style.transition = `transform ${duration}ms ease`;
      element.style.transform = `rotate(${degrees}deg)`;

      setTimeout(() => {
        element.style.transition = "";
        resolve();
      }, duration);
    });
  }

  /**
   * 타이핑 효과
   * @param {Element} element - 대상 요소
   * @param {string} text - 타이핑할 텍스트
   * @param {number} speed - 타이핑 속도 (ms)
   * @returns {Promise}
   */
  static async typing(element, text, speed = 50) {
    if (!element) return;

    return new Promise((resolve) => {
      let index = 0;
      element.textContent = "";

      const type = () => {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      };

      type();
    });
  }

  /**
   * 프로그레스 바 애니메이션
   * @param {Element} element - 대상 요소
   * @param {number} percent - 진행률 (0-100)
   * @param {number} duration - 지속 시간 (ms)
   * @returns {Promise}
   */
  static async progressBar(element, percent, duration = 500) {
    if (!element) return;

    return new Promise((resolve) => {
      element.style.transition = `width ${duration}ms ease-out`;
      element.style.width = `${percent}%`;

      setTimeout(() => {
        element.style.transition = "";
        resolve();
      }, duration);
    });
  }

  /**
   * 파티클 효과
   * @param {Element} container - 컨테이너 요소
   * @param {Object} options - 옵션
   */
  static particles(container, options = {}) {
    const {
      count = 30,
      color = "#4CAF50",
      size = 5,
      duration = 2000,
      spread = 100,
    } = options;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${centerX}px;
        top: ${centerY}px;
        pointer-events: none;
      `;

      container.appendChild(particle);

      const angle = (Math.PI * 2 * i) / count;
      const velocity = spread * (0.5 + Math.random() * 0.5);
      const x = Math.cos(angle) * velocity;
      const y = Math.sin(angle) * velocity;

      particle.animate(
        [
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
          { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 },
        ],
        {
          duration: duration,
          easing: "cubic-bezier(0, 0.5, 0.5, 1)",
        }
      ).onfinish = () => {
        particle.remove();
      };
    }
  }

  /**
   * 리플 효과
   * @param {Element} element - 대상 요소
   * @param {Event} event - 클릭 이벤트
   * @param {Object} options - 옵션
   */
  static ripple(element, event, options = {}) {
    const { color = "rgba(255, 255, 255, 0.6)", duration = 600 } = options;

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      left: ${x}px;
      top: ${y}px;
      transform: scale(0);
      pointer-events: none;
    `;

    // 상대 위치 설정
    const position = window.getComputedStyle(element).position;
    if (position !== "relative" && position !== "absolute") {
      element.style.position = "relative";
    }

    element.style.overflow = "hidden";
    element.appendChild(ripple);

    ripple.animate(
      [
        { transform: "scale(0)", opacity: 1 },
        { transform: "scale(2)", opacity: 0 },
      ],
      {
        duration: duration,
        easing: "ease-out",
      }
    ).onfinish = () => {
      ripple.remove();
    };
  }
}

// ES6 모듈 내보내기
if (typeof module !== "undefined" && module.exports) {
  module.exports = AnimationUtils;
}
