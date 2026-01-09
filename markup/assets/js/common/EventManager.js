/**
 * 이벤트 관리 모듈
 * 이벤트 리스너를 중앙에서 관리하고 정리할 수 있는 유틸리티
 * @module EventManager
 */
class EventManager {
  constructor() {
    this.listeners = new Map();
    this.delegatedListeners = new Map();
  }

  /**
   * 이벤트 리스너 등록
   * @param {Element|Window|Document} target - 대상 요소
   * @param {string} eventType - 이벤트 타입
   * @param {Function} handler - 핸들러 함수
   * @param {Object} options - 이벤트 옵션
   * @returns {string} 리스너 ID
   */
  on(target, eventType, handler, options = {}) {
    if (!target || typeof handler !== 'function') {
      console.warn('[EventManager] Invalid target or handler');
      return null;
    }

    const listenerId = this._generateId();
    const wrappedHandler = this._wrapHandler(handler, listenerId);

    target.addEventListener(eventType, wrappedHandler, options);

    if (!this.listeners.has(target)) {
      this.listeners.set(target, new Map());
    }
    this.listeners.get(target).set(listenerId, {
      eventType,
      handler: wrappedHandler,
      originalHandler: handler,
      options,
    });

    return listenerId;
  }

  /**
   * 이벤트 리스너 제거
   * @param {Element|Window|Document} target - 대상 요소
   * @param {string} listenerId - 리스너 ID
   */
  off(target, listenerId) {
    if (!target || !listenerId) return;

    const targetListeners = this.listeners.get(target);
    if (!targetListeners) return;

    const listener = targetListeners.get(listenerId);
    if (!listener) return;

    target.removeEventListener(listener.eventType, listener.handler, listener.options);
    targetListeners.delete(listenerId);

    if (targetListeners.size === 0) {
      this.listeners.delete(target);
    }
  }

  /**
   * 이벤트 위임 등록
   * @param {Element|Window|Document} parent - 부모 요소
   * @param {string} eventType - 이벤트 타입
   * @param {string} selector - 자식 선택자
   * @param {Function} handler - 핸들러 함수
   * @param {Object} options - 이벤트 옵션
   * @returns {string} 리스너 ID
   */
  delegate(parent, eventType, selector, handler, options = {}) {
    if (!parent || typeof handler !== 'function') {
      console.warn('[EventManager] Invalid parent or handler');
      return null;
    }

    const listenerId = this._generateId();
    const wrappedHandler = (event) => {
      const target = event.target.closest(selector);
      if (target && parent.contains(target)) {
        handler.call(target, event);
      }
    };

    parent.addEventListener(eventType, wrappedHandler, options);

    if (!this.delegatedListeners.has(parent)) {
      this.delegatedListeners.set(parent, new Map());
    }
    this.delegatedListeners.get(parent).set(listenerId, {
      eventType,
      selector,
      handler: wrappedHandler,
      originalHandler: handler,
      options,
    });

    return listenerId;
  }

  /**
   * 이벤트 위임 제거
   * @param {Element|Window|Document} parent - 부모 요소
   * @param {string} listenerId - 리스너 ID
   */
  undelegate(parent, listenerId) {
    if (!parent || !listenerId) return;

    const delegatedListeners = this.delegatedListeners.get(parent);
    if (!delegatedListeners) return;

    const listener = delegatedListeners.get(listenerId);
    if (!listener) return;

    parent.removeEventListener(listener.eventType, listener.handler, listener.options);
    delegatedListeners.delete(listenerId);

    if (delegatedListeners.size === 0) {
      this.delegatedListeners.delete(parent);
    }
  }

  /**
   * 특정 요소의 모든 리스너 제거
   * @param {Element|Window|Document} target - 대상 요소
   */
  removeAll(target) {
    // 일반 리스너 제거
    const targetListeners = this.listeners.get(target);
    if (targetListeners) {
      targetListeners.forEach((listener, listenerId) => {
        target.removeEventListener(listener.eventType, listener.handler, listener.options);
      });
      this.listeners.delete(target);
    }

    // 위임 리스너 제거
    const delegatedListeners = this.delegatedListeners.get(target);
    if (delegatedListeners) {
      delegatedListeners.forEach((listener, listenerId) => {
        target.removeEventListener(listener.eventType, listener.handler, listener.options);
      });
      this.delegatedListeners.delete(target);
    }
  }

  /**
   * 모든 리스너 제거
   */
  removeAllListeners() {
    // 일반 리스너 제거
    this.listeners.forEach((targetListeners, target) => {
      targetListeners.forEach((listener) => {
        target.removeEventListener(listener.eventType, listener.handler, listener.options);
      });
    });
    this.listeners.clear();

    // 위임 리스너 제거
    this.delegatedListeners.forEach((delegatedListeners, parent) => {
      delegatedListeners.forEach((listener) => {
        parent.removeEventListener(listener.eventType, listener.handler, listener.options);
      });
    });
    this.delegatedListeners.clear();
  }

  /**
   * 한 번만 실행되는 이벤트 리스너
   * @param {Element|Window|Document} target - 대상 요소
   * @param {string} eventType - 이벤트 타입
   * @param {Function} handler - 핸들러 함수
   * @param {Object} options - 이벤트 옵션
   * @returns {string} 리스너 ID
   */
  once(target, eventType, handler, options = {}) {
    const listenerId = this._generateId();
    const wrappedHandler = (event) => {
      handler(event);
      this.off(target, listenerId);
    };

    return this.on(target, eventType, wrappedHandler, options);
  }

  /**
   * 이벤트 발생 (커스텀 이벤트)
   * @param {Element|Window|Document} target - 대상 요소
   * @param {string} eventType - 이벤트 타입
   * @param {Object} detail - 이벤트 데이터
   */
  emit(target, eventType, detail = {}) {
    if (!target) return;

    const event = new CustomEvent(eventType, {
      detail,
      bubbles: true,
      cancelable: true,
    });

    target.dispatchEvent(event);
  }

  /**
   * 핸들러 래핑 (에러 처리 포함)
   * @private
   */
  _wrapHandler(handler, listenerId) {
    return (event) => {
      try {
        handler(event);
      } catch (error) {
        console.error(`[EventManager] Error in event handler (${listenerId}):`, error);
        if (typeof ErrorHandler !== 'undefined') {
          ErrorHandler.handle(error, { context: 'EventManager', listenerId });
        }
      }
    };
  }

  /**
   * 고유 ID 생성
   * @private
   */
  _generateId() {
    return `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 등록된 리스너 정보 가져오기
   * @returns {Object}
   */
  getListenersInfo() {
    const info = {
      regular: {},
      delegated: {},
    };

    this.listeners.forEach((targetListeners, target) => {
      const targetKey = target === window ? 'window' : 
                       target === document ? 'document' : 
                       target.id || target.className || 'unknown';
      info.regular[targetKey] = Array.from(targetListeners.keys());
    });

    this.delegatedListeners.forEach((delegatedListeners, parent) => {
      const parentKey = parent === window ? 'window' : 
                       parent === document ? 'document' : 
                       parent.id || parent.className || 'unknown';
      info.delegated[parentKey] = Array.from(delegatedListeners.keys());
    });

    return info;
  }
}

/**
 * 전역 EventManager 인스턴스 (싱글톤)
 */
const eventManager = new EventManager();

// ES6 모듈 내보내기
if (typeof module !== "undefined" && module.exports) {
  module.exports = { EventManager, eventManager };
}
