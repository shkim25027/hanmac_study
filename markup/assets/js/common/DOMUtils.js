/**
 * DOM 조작 유틸리티 모듈
 * @module DOMUtils
 */
class DOMUtils {
  /**
   * 요소 선택 (단일)
   * @param {string} selector - CSS 선택자
   * @param {Element} parent - 부모 요소
   * @returns {Element|null}
   */
  static $(selector, parent = document) {
    return parent.querySelector(selector);
  }

  /**
   * 요소 선택 (다중)
   * @param {string} selector - CSS 선택자
   * @param {Element} parent - 부모 요소
   * @returns {NodeList}
   */
  static $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
  }

  /**
   * 요소 생성
   * @param {string} tag - 태그명
   * @param {Object} attrs - 속성 객체
   * @param {string} content - 내용
   * @returns {Element}
   */
  static createElement(tag, attrs = {}, content = "") {
    const element = document.createElement(tag);

    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "class" || key === "className") {
        element.className = value;
      } else if (key === "style" && typeof value === "object") {
        Object.assign(element.style, value);
      } else if (key.startsWith("data-")) {
        element.setAttribute(key, value);
      } else {
        element[key] = value;
      }
    });

    if (content) {
      if (typeof content === "string") {
        element.innerHTML = content;
      } else if (content instanceof Node) {
        element.appendChild(content);
      }
    }

    return element;
  }

  /**
   * 클래스 토글
   * @param {Element} element - 대상 요소
   * @param {string} className - 클래스명
   * @param {boolean} force - 강제 적용 여부
   */
  static toggleClass(element, className, force) {
    if (!element) return;
    if (force !== undefined) {
      element.classList.toggle(className, force);
    } else {
      element.classList.toggle(className);
    }
  }

  /**
   * 여러 클래스 추가
   * @param {Element} element - 대상 요소
   * @param {...string} classNames - 클래스명들
   */
  static addClasses(element, ...classNames) {
    if (!element) return;
    element.classList.add(...classNames);
  }

  /**
   * 여러 클래스 제거
   * @param {Element} element - 대상 요소
   * @param {...string} classNames - 클래스명들
   */
  static removeClasses(element, ...classNames) {
    if (!element) return;
    element.classList.remove(...classNames);
  }

  /**
   * 요소의 위치 정보 가져오기
   * @param {Element} element - 대상 요소
   * @returns {Object}
   */
  static getPosition(element) {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
      x: rect.x,
      y: rect.y,
    };
  }

  /**
   * 요소를 퍼센트 위치로 설정
   * @param {Element} element - 대상 요소
   * @param {number} x - X 위치 (%)
   * @param {number} y - Y 위치 (%)
   * @param {string} transform - 추가 transform
   */
  static setPercentPosition(element, x, y, transform = "translate(-50%, -50%)") {
    if (!element) return;
    element.style.position = "absolute";
    element.style.left = `${x}%`;
    element.style.top = `${y}%`;
    if (transform) {
      element.style.transform = transform;
    }
  }

  /**
   * 요소 페이드 인
   * @param {Element} element - 대상 요소
   * @param {number} duration - 지속 시간 (ms)
   * @returns {Promise}
   */
  static fadeIn(element, duration = 300) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
      // 기존 display 값 저장 (grid, flex 등 유지)
      const originalDisplay = element.style.display || window.getComputedStyle(element).display;
      const isGridOrFlex = originalDisplay === "grid" || originalDisplay === "flex" || 
                          originalDisplay.includes("grid") || originalDisplay.includes("flex");

      element.style.opacity = "0";
      // grid/flex인 경우 display를 설정하지 않음
      if (!isGridOrFlex) {
        element.style.display = "block";
      }
      element.style.transition = `opacity ${duration}ms ease-in-out`;

      setTimeout(() => {
        element.style.opacity = "1";
      }, 10);

      setTimeout(() => {
        element.style.transition = "";
        // grid/flex인 경우 display 스타일 제거
        if (isGridOrFlex) {
          element.style.display = "";
        }
        resolve();
      }, duration);
    });
  }

  /**
   * 요소 페이드 아웃
   * @param {Element} element - 대상 요소
   * @param {number} duration - 지속 시간 (ms)
   * @returns {Promise}
   */
  static fadeOut(element, duration = 300) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
      element.style.opacity = "1";
      element.style.transition = `opacity ${duration}ms ease-in-out`;

      setTimeout(() => {
        element.style.opacity = "0";
      }, 10);

      setTimeout(() => {
        element.style.display = "none";
        element.style.transition = "";
        resolve();
      }, duration);
    });
  }

  /**
   * 요소 슬라이드 다운
   * @param {Element} element - 대상 요소
   * @param {number} duration - 지속 시간 (ms)
   * @returns {Promise}
   */
  static slideDown(element, duration = 300) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
      element.style.display = "block";
      const height = element.scrollHeight;
      element.style.height = "0";
      element.style.overflow = "hidden";
      element.style.transition = `height ${duration}ms ease-in-out`;

      setTimeout(() => {
        element.style.height = `${height}px`;
      }, 10);

      setTimeout(() => {
        element.style.height = "";
        element.style.overflow = "";
        element.style.transition = "";
        resolve();
      }, duration);
    });
  }

  /**
   * 요소 슬라이드 업
   * @param {Element} element - 대상 요소
   * @param {number} duration - 지속 시간 (ms)
   * @returns {Promise}
   */
  static slideUp(element, duration = 300) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
      const height = element.scrollHeight;
      element.style.height = `${height}px`;
      element.style.overflow = "hidden";
      element.style.transition = `height ${duration}ms ease-in-out`;

      setTimeout(() => {
        element.style.height = "0";
      }, 10);

      setTimeout(() => {
        element.style.display = "none";
        element.style.height = "";
        element.style.overflow = "";
        element.style.transition = "";
        resolve();
      }, duration);
    });
  }

  /**
   * 이벤트 위임
   * @param {Element} parent - 부모 요소
   * @param {string} eventType - 이벤트 타입
   * @param {string} selector - 자식 선택자
   * @param {Function} handler - 핸들러 함수
   */
  static delegate(parent, eventType, selector, handler) {
    if (!parent) return;

    parent.addEventListener(eventType, (event) => {
      const target = event.target.closest(selector);
      if (target && parent.contains(target)) {
        handler.call(target, event);
      }
    });
  }

  /**
   * HTML 문자열을 요소로 변환
   * @param {string} html - HTML 문자열
   * @returns {Element}
   */
  static htmlToElement(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  }

  /**
   * HTML 문자열을 요소 배열로 변환
   * @param {string} html - HTML 문자열
   * @returns {Array}
   */
  static htmlToElements(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return Array.from(template.content.children);
  }

  /**
   * 요소가 뷰포트에 있는지 확인
   * @param {Element} element - 대상 요소
   * @returns {boolean}
   */
  static isInViewport(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * 부드러운 스크롤
   * @param {Element|string} target - 대상 요소 또는 선택자
   * @param {Object} options - 옵션
   */
  static smoothScroll(target, options = {}) {
    const element = typeof target === "string" ? this.$(target) : target;
    if (!element) return;

    const defaultOptions = {
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    };

    element.scrollIntoView({ ...defaultOptions, ...options });
  }

  /**
   * 전체 화면 토글
   * @param {Element} element - 대상 요소
   */
  static toggleFullscreen(element = document.documentElement) {
    if (!document.fullscreenElement) {
      element.requestFullscreen?.() ||
        element.webkitRequestFullscreen?.() ||
        element.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.() ||
        document.msExitFullscreen?.();
    }
  }

  /**
   * 클립보드에 복사
   * @param {string} text - 복사할 텍스트
   * @returns {Promise}
   */
  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Failed to copy:", err);
      return false;
    }
  }

  /**
   * 요소의 스타일 가져오기
   * @param {Element} element - 대상 요소
   * @param {string} property - CSS 속성
   * @returns {string}
   */
  static getStyle(element, property) {
    if (!element) return null;
    return window.getComputedStyle(element).getPropertyValue(property);
  }

  /**
   * 여러 스타일 설정
   * @param {Element} element - 대상 요소
   * @param {Object} styles - 스타일 객체
   */
  static setStyles(element, styles) {
    if (!element || !styles) return;
    Object.assign(element.style, styles);
  }

  /**
   * 요소 제거
   * @param {Element} element - 대상 요소
   */
  static remove(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  /**
   * 요소 내용 비우기
   * @param {Element} element - 대상 요소
   */
  static empty(element) {
    if (!element) return;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}

// ES6 모듈 내보내기
if (typeof module !== "undefined" && module.exports) {
  module.exports = DOMUtils;
}
