/**
 * 의존성 주입 컨테이너
 * 명확한 의존성 관리 및 테스트 용이성 향상
 * @module DependencyInjector
 */
class DependencyInjector {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  /**
   * 서비스 등록
   * @param {string} name - 서비스 이름
   * @param {Function|Object} factory - 팩토리 함수 또는 인스턴스
   * @param {boolean} singleton - 싱글톤 여부
   */
  register(name, factory, singleton = true) {
    if (typeof factory === 'function') {
      this.services.set(name, { factory, singleton });
    } else {
      // 이미 인스턴스인 경우
      this.singletons.set(name, factory);
      this.services.set(name, { factory: () => factory, singleton: true });
    }
  }

  /**
   * 서비스 가져오기
   * @param {string} name - 서비스 이름
   * @returns {*}
   */
  get(name) {
    // 싱글톤 캐시 확인
    if (this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service "${name}" is not registered`);
    }

    const instance = service.factory(this);

    // 싱글톤인 경우 캐시
    if (service.singleton) {
      this.singletons.set(name, instance);
    }

    return instance;
  }

  /**
   * 서비스 존재 여부 확인
   * @param {string} name - 서비스 이름
   * @returns {boolean}
   */
  has(name) {
    return this.services.has(name);
  }

  /**
   * 서비스 제거
   * @param {string} name - 서비스 이름
   */
  remove(name) {
    this.services.delete(name);
    this.singletons.delete(name);
  }

  /**
   * 모든 서비스 초기화
   */
  clear() {
    this.services.clear();
    this.singletons.clear();
  }

  /**
   * 여러 서비스 한 번에 등록
   * @param {Object} services - 서비스 객체
   */
  registerAll(services) {
    Object.entries(services).forEach(([name, factory]) => {
      this.register(name, factory);
    });
  }
}

/**
 * 전역 의존성 주입 컨테이너
 */
const di = new DependencyInjector();

// 기본 서비스 등록 (있는 경우)
if (typeof DOMUtils !== 'undefined') {
  di.register('DOMUtils', () => DOMUtils, true);
}
if (typeof Utils !== 'undefined') {
  di.register('Utils', () => Utils, true);
}
if (typeof AnimationUtils !== 'undefined') {
  di.register('AnimationUtils', () => AnimationUtils, true);
}
if (typeof eventManager !== 'undefined') {
  di.register('eventManager', () => eventManager, true);
}
if (typeof ErrorHandler !== 'undefined') {
  di.register('ErrorHandler', () => ErrorHandler, true);
}

// ES6 모듈 내보내기
if (typeof module !== "undefined" && module.exports) {
  module.exports = { DependencyInjector, di };
}
