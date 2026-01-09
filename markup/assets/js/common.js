/**
 * 공통 유틸리티 함수
 * 공통 모듈(DOMUtils, AnimationUtils, EventManager, ErrorHandler) 활용
 * @module CommonUtils
 */

/**
 * 스크롤 및 레이아웃 관리 클래스
 */
class ScrollManager {
  constructor() {
    this.scrollY = 0;
    this.wrap = null;
    this.isLocked = false;
  }

  /**
   * 스크린 높이 계산 및 CSS 변수 설정
   */
  syncHeight() {
    try {
      document.documentElement.style.setProperty(
        "--window-inner-height",
        `${window.innerHeight}px`
      );
    } catch (error) {
      if (typeof ErrorHandler !== 'undefined') {
        ErrorHandler.handle(error, { context: 'ScrollManager.syncHeight' });
      } else {
        console.error('[ScrollManager] syncHeight error:', error);
      }
    }
  }

  /**
   * body 스크롤 잠금
   */
  lock() {
    if (this.isLocked) return;
    
    this.scrollY = window.scrollY;
    document.documentElement.classList.add("is-locked");
    document.documentElement.style.scrollBehavior = "auto";
    
    if (this.wrap) {
      this.wrap.style.top = `-${this.scrollY}px`;
    }
    
    this.isLocked = true;
  }

  /**
   * body 스크롤 잠금 해제
   */
  unlock() {
    if (!this.isLocked) return;
    
    document.documentElement.classList.remove("is-locked");
    window.scrollTo(0, this.scrollY);
    
    if (this.wrap) {
      this.wrap.style.top = "";
    }
    
    document.documentElement.style.scrollBehavior = "";
    this.isLocked = false;
  }

  /**
   * 초기화
   */
  init() {
    this.wrap = typeof DOMUtils !== 'undefined' ? DOMUtils.$(".wrap") : document.querySelector(".wrap");
    
    // 즉시 높이 설정
    this.syncHeight();
    
    // 리사이즈 이벤트 (쓰로틀 적용)
    const throttledSyncHeight = typeof Utils !== 'undefined' && Utils.throttle
      ? Utils.throttle(() => this.syncHeight(), 100)
      : (() => {
          let resizeTimer;
          return () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.syncHeight(), 100);
          };
        })();
    
    if (typeof eventManager !== 'undefined') {
      eventManager.on(window, "resize", throttledSyncHeight);
      eventManager.on(window, "orientationchange", () => {
        setTimeout(() => this.syncHeight(), 100);
      });
    } else {
      window.addEventListener("resize", throttledSyncHeight);
      window.addEventListener("orientationchange", () => {
        setTimeout(() => this.syncHeight(), 100);
      });
    }
  }
}

/**
 * 모바일 감지 유틸리티
 */
class DeviceUtils {
  /**
   * 모바일 기기 여부 확인
   * @param {number} breakpoint - 브레이크포인트 (기본값: 1025)
   * @returns {boolean}
   */
  static isMobile(breakpoint = 1025) {
    return window.innerWidth < breakpoint;
  }

  /**
   * 태블릿 기기 여부 확인
   * @param {number} minWidth - 최소 너비
   * @param {number} maxWidth - 최대 너비
   * @returns {boolean}
   */
  static isTablet(minWidth = 768, maxWidth = 1024) {
    const width = window.innerWidth;
    return width >= minWidth && width <= maxWidth;
  }

  /**
   * 데스크톱 기기 여부 확인
   * @param {number} breakpoint - 브레이크포인트
   * @returns {boolean}
   */
  static isDesktop(breakpoint = 1025) {
    return window.innerWidth >= breakpoint;
  }
}

/**
 * 모달/팝업 관리 클래스
 */
class ModalManager {
  constructor(scrollManager) {
    this.scrollManager = scrollManager;
    this.openModals = new Set();
  }

  /**
   * 모달 열기
   * @param {string|Element} target - 모달 ID 또는 요소
   * @param {Object} options - 옵션
   * @returns {Promise}
   */
  async open(target, options = {}) {
    const {
      duration = 300,
      lockScroll = true,
      stopVideo = true,
    } = options;

    try {
      const element = typeof target === 'string' 
        ? (typeof DOMUtils !== 'undefined' ? DOMUtils.$(`#${target}`) : document.getElementById(target))
        : target;
      
      if (!element) {
        console.warn('[ModalManager] Element not found:', target);
        return;
      }

      if (typeof DOMUtils !== 'undefined') {
        await DOMUtils.fadeIn(element, duration);
      } else if (typeof AnimationUtils !== 'undefined') {
        await AnimationUtils.fade(element, 'in', duration);
      } else {
        element.style.display = 'block';
        element.style.opacity = '1';
      }

      if (lockScroll && this.scrollManager) {
        this.scrollManager.lock();
      }

      this.openModals.add(element);

      return element;
    } catch (error) {
      if (typeof ErrorHandler !== 'undefined') {
        ErrorHandler.handle(error, { context: 'ModalManager.open', target });
      } else {
        console.error('[ModalManager] open error:', error);
      }
    }
  }

  /**
   * 모달 닫기
   * @param {string|Element} target - 모달 ID 또는 요소
   * @param {Object} options - 옵션
   * @returns {Promise}
   */
  async close(target, options = {}) {
    const {
      duration = 300,
      unlockScroll = true,
      stopVideo = true,
    } = options;

    try {
      const element = typeof target === 'string'
        ? (typeof DOMUtils !== 'undefined' ? DOMUtils.$(`#${target}`) : document.getElementById(target))
        : target;

      if (!element) return;

      if (typeof DOMUtils !== 'undefined') {
        await DOMUtils.fadeOut(element, duration);
      } else if (typeof AnimationUtils !== 'undefined') {
        await AnimationUtils.fade(element, 'out', duration);
      } else {
        element.style.display = 'none';
        element.style.opacity = '0';
      }

      // 비디오 정지
      if (stopVideo) {
        const video = element.querySelector("video");
        if (video) video.pause();
      }

      if (unlockScroll && this.scrollManager && this.openModals.size <= 1) {
        this.scrollManager.unlock();
      }

      this.openModals.delete(element);

      return element;
    } catch (error) {
      if (typeof ErrorHandler !== 'undefined') {
        ErrorHandler.handle(error, { context: 'ModalManager.close', target });
      } else {
        console.error('[ModalManager] close error:', error);
      }
    }
  }

  /**
   * 모든 모달 닫기
   */
  async closeAll() {
    const promises = Array.from(this.openModals).map(modal => this.close(modal));
    await Promise.all(promises);
    this.openModals.clear();
  }
}

// 전역 인스턴스 생성
const scrollManager = new ScrollManager();
const modalManager = new ModalManager(scrollManager);

// 기존 함수 호환성을 위한 래퍼
let scrollY = 0;
let wrap = null;

function syncHeight() {
  scrollManager.syncHeight();
}

function isMobile() {
  return DeviceUtils.isMobile();
}

function bodyLock() {
  scrollManager.lock();
}

function bodyUnlock() {
  scrollManager.unlock();
}

async function popOpen(id) {
  return await modalManager.open(id);
}

async function popClose(obj) {
  const popup = obj.closest ? obj.closest(".popup") : null;
  if (popup) {
    return await modalManager.close(popup);
  }
}

/**
 * 이벤트 초기화
 */
function initCommonEvents() {
  const baseHref = window.location.href.split("#")[0];
  
  // ScrollManager 초기화
  scrollManager.init();
  wrap = scrollManager.wrap;

  // 모달 열기 이벤트 (이벤트 위임)
  const openModalHandler = function(e) {
    const modalId = this.id.replace("open-", "");
    modalManager.open(modalId);
  };

  // 모달 닫기 이벤트
  const closeModalHandler = async function(e) {
    const modal = this.closest(".modal");
    if (modal) {
      await modalManager.close(modal);
    }
  };

  // 모달 바깥 클릭 시 닫기
  const modalBackdropHandler = async function(e) {
    const modalContent = e.target.closest(".modal-content");
    if (!modalContent && e.target === this) {
      await modalManager.close(this);
    }
  };

  // EventManager 사용 (있는 경우)
  if (typeof eventManager !== 'undefined') {
    eventManager.delegate(document, "click", "[id^=open-modal]", openModalHandler);
    eventManager.delegate(document, "click", ".close", closeModalHandler);
    eventManager.delegate(document, "click", ".modal", modalBackdropHandler);
  } else if (typeof DOMUtils !== 'undefined' && DOMUtils.delegate) {
    DOMUtils.delegate(document, "click", "[id^=open-modal]", openModalHandler);
    DOMUtils.delegate(document, "click", ".close", closeModalHandler);
    DOMUtils.delegate(document, "click", ".modal", modalBackdropHandler);
  } else {
    // 폴백: 직접 이벤트 리스너 등록
    document.addEventListener("click", (e) => {
      const target = e.target.closest("[id^=open-modal]");
      if (target) {
        openModalHandler.call(target, e);
      }
      
      const closeBtn = e.target.closest(".close");
      if (closeBtn) {
        closeModalHandler.call(closeBtn, e);
      }
      
      const modal = e.target.closest(".modal");
      if (modal && e.target === modal) {
        modalBackdropHandler.call(modal, e);
      }
    });
  }
}

// DOMContentLoaded 시 초기화
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initCommonEvents);
} else {
  initCommonEvents();
}

// 리사이즈 이벤트는 ScrollManager.init()에서 처리됨

/**
 * 컨테이너 스크롤 효과 클래스
 */
class ContainerScrollEffect {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      borderRadius: 30,
      scrollThreshold: 100,
      excludeClass: 'search-result',
      ...options,
    };
    this.isActive = false;
  }

  /**
   * 효과 초기화
   */
  init() {
    if (!this.container) return;

    // 검색 결과 페이지에서는 이 효과를 적용하지 않음
    const wrap = this.container.closest(".wrap");
    if (wrap && wrap.classList.contains(this.options.excludeClass)) {
      return;
    }

    const throttledScroll = typeof Utils !== 'undefined' && Utils.throttle
      ? Utils.throttle(() => this._handleScroll(), 16)
      : (() => {
          let lastTime = 0;
          return () => {
            const now = performance.now();
            if (now - lastTime >= 16) {
              this._handleScroll();
              lastTime = now;
            }
          };
        })();

    if (typeof eventManager !== 'undefined') {
      eventManager.on(this.container, "scroll", throttledScroll);
    } else {
      this.container.addEventListener("scroll", throttledScroll);
    }

    this.isActive = true;
  }

  /**
   * 스크롤 핸들러
   * @private
   */
  _handleScroll() {
    const scrollTop = this.container.scrollTop;
    const progress = Math.min(scrollTop / this.options.scrollThreshold, 1);
    const currentRadius = this.options.borderRadius * (1 - progress);

    this.container.style.clipPath = `inset(0 0 0 0 round ${currentRadius}px ${currentRadius}px 0 0)`;
  }

  /**
   * 효과 제거
   */
  destroy() {
    if (this.container && this.isActive) {
      this.container.style.clipPath = '';
      this.isActive = false;
    }
  }
}

// 기존 함수 호환성
function initContainerScrollEffect() {
  const container = typeof DOMUtils !== 'undefined' 
    ? DOMUtils.$(".container")
    : document.querySelector(".container");
  
  if (container) {
    const effect = new ContainerScrollEffect(container);
    effect.init();
  }
}

// DOMContentLoaded 시 초기화
document.addEventListener("DOMContentLoaded", () => {
 // initContainerScrollEffect();
 
 // 현재 페이지에 따라 네비게이션 active 클래스 추가
 setActiveNavigation();
});

/**
 * 네비게이션 관리 클래스
 */
class NavigationManager {
  constructor(options = {}) {
    this.options = {
      selector: '.nav-group .depth01 > li',
      activeClass: 'active',
      ...options,
    };
  }

  /**
   * 현재 페이지에 따라 네비게이션 active 클래스 설정
   */
  setActiveNavigation() {
    try {
      const currentPath = window.location.pathname;
      const navItems = typeof DOMUtils !== 'undefined'
        ? DOMUtils.$$(this.options.selector)
        : document.querySelectorAll(this.options.selector);

      navItems.forEach((li) => {
        const link = typeof DOMUtils !== 'undefined'
          ? DOMUtils.$('a', li)
          : li.querySelector('a');
        
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // 현재 경로와 링크의 href를 비교
        const isActive = this._isActiveLink(currentPath, href);

        if (typeof DOMUtils !== 'undefined') {
          if (isActive) {
            DOMUtils.addClasses(li, this.options.activeClass);
          } else {
            DOMUtils.removeClasses(li, this.options.activeClass);
          }
        } else {
          if (isActive) {
            li.classList.add(this.options.activeClass);
          } else {
            li.classList.remove(this.options.activeClass);
          }
        }
      });
    } catch (error) {
      if (typeof ErrorHandler !== 'undefined') {
        ErrorHandler.handle(error, { context: 'NavigationManager.setActiveNavigation' });
      } else {
        console.error('[NavigationManager] setActiveNavigation error:', error);
      }
    }
  }

  /**
   * 링크가 활성화되어야 하는지 확인
   * @private
   */
  _isActiveLink(currentPath, href) {
    // onboarding.html이 포함되어 있으면 active 클래스 추가
    if (currentPath.includes('onboarding') && href.includes('onboarding')) {
      return true;
    }
    if (currentPath.includes('learning') && href.includes('learning')) {
      return true;
    }
    // 추가적인 매칭 로직을 여기에 구현할 수 있습니다
    return false;
  }
}

// 전역 인스턴스
const navigationManager = new NavigationManager();

// 기존 함수 호환성
function setActiveNavigation() {
  navigationManager.setActiveNavigation();
}

/**
 * HTML Include 관리 클래스
 */
class HTMLIncludeManager {
  constructor(options = {}) {
    this.options = {
      selector: "[data-include-path]",
      attribute: "data-include-path",
      ...options,
    };
  }

  /**
   * HTML include 실행
   * @returns {Promise}
   */
  async include() {
    const allElements = typeof DOMUtils !== 'undefined'
      ? DOMUtils.$$(this.options.selector)
      : document.querySelectorAll(this.options.selector);

    const promises = Array.from(allElements).map(async (el) => {
      const includePath = el.dataset.includePath || el.getAttribute(this.options.attribute);
      if (!includePath) return;

      try {
        const response = await fetch(includePath);
        if (!response.ok) {
          throw new Error(`Failed to load: ${includePath} (${response.status})`);
        }

        const html = await response.text();
        el.innerHTML = html;
        el.removeAttribute(this.options.attribute);

        // 포함된 HTML에 대한 이벤트 재초기화 (필요한 경우)
        this._reinitializeEvents(el);
      } catch (error) {
        if (typeof ErrorHandler !== 'undefined') {
          ErrorHandler.handle(error, {
            context: 'HTMLIncludeManager.include',
            includePath,
          });
        } else {
          console.error(`[HTMLIncludeManager] Error loading ${includePath}:`, error);
        }
      }
    });

    await Promise.all(promises);
  }

  /**
   * 포함된 HTML의 이벤트 재초기화
   * @private
   */
  _reinitializeEvents(element) {
    // 포함된 스크립트 실행 (보안 주의)
    const scripts = element.querySelectorAll('script');
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.textContent = script.textContent;
      }
      script.parentNode.replaceChild(newScript, script);
    });
  }
}

// 전역 인스턴스
const htmlIncludeManager = new HTMLIncludeManager();

// 기존 함수 호환성
async function includehtml() {
  return await htmlIncludeManager.include();
}

// 전역으로 내보내기 (선택사항)
if (typeof window !== 'undefined') {
  window.CommonUtils = {
    ScrollManager,
    DeviceUtils,
    ModalManager,
    ContainerScrollEffect,
    NavigationManager,
    HTMLIncludeManager,
    scrollManager,
    modalManager,
    navigationManager,
    htmlIncludeManager,
    // 기존 함수들
    syncHeight,
    isMobile,
    bodyLock,
    bodyUnlock,
    popOpen,
    popClose,
    initContainerScrollEffect,
    setActiveNavigation,
    includehtml,
  };
}
