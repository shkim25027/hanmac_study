/**
 * 설정 관리 모듈
 * @module ConfigManager
 */
class ConfigManager {
  constructor(defaults = {}) {
    this.defaults = defaults;
    this.config = { ...defaults };
  }

  /**
   * 설정 값 가져오기
   * @param {string} key - 키 (점 표기법 지원)
   * @param {*} defaultValue - 기본값
   * @returns {*}
   */
  get(key, defaultValue = null) {
    return this._getNestedValue(this.config, key, defaultValue);
  }

  /**
   * 설정 값 설정
   * @param {string} key - 키 (점 표기법 지원)
   * @param {*} value - 값
   */
  set(key, value) {
    this._setNestedValue(this.config, key, value);
  }

  /**
   * 여러 설정 값 설정
   * @param {Object} config - 설정 객체
   */
  setMultiple(config) {
    this.config = this._deepMerge(this.config, config);
  }

  /**
   * 설정 값 삭제
   * @param {string} key - 키
   */
  remove(key) {
    this._deleteNestedValue(this.config, key);
  }

  /**
   * 설정 값 존재 확인
   * @param {string} key - 키
   * @returns {boolean}
   */
  has(key) {
    return this._getNestedValue(this.config, key) !== undefined;
  }

  /**
   * 모든 설정 가져오기
   * @returns {Object}
   */
  getAll() {
    return { ...this.config };
  }

  /**
   * 설정 초기화
   */
  reset() {
    this.config = { ...this.defaults };
  }

  /**
   * 기본값으로 병합
   * @param {Object} config - 설정 객체
   * @returns {Object}
   */
  mergeWithDefaults(config) {
    return this._deepMerge({ ...this.defaults }, config);
  }

  /**
   * JSON 문자열로 변환
   * @returns {string}
   */
  toJSON() {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * JSON 문자열에서 로드
   * @param {string} json - JSON 문자열
   */
  fromJSON(json) {
    try {
      const parsed = JSON.parse(json);
      this.config = this._deepMerge({ ...this.defaults }, parsed);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
    }
  }

  /**
   * 로컬 스토리지에 저장
   * @param {string} key - 저장 키
   */
  saveToStorage(key = "app_config") {
    try {
      localStorage.setItem(key, JSON.stringify(this.config));
      return true;
    } catch (error) {
      console.error("Failed to save to storage:", error);
      return false;
    }
  }

  /**
   * 로컬 스토리지에서 로드
   * @param {string} key - 저장 키
   */
  loadFromStorage(key = "app_config") {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.config = this._deepMerge({ ...this.defaults }, parsed);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to load from storage:", error);
      return false;
    }
  }

  /**
   * 중첩된 객체 값 가져오기
   * @private
   */
  _getNestedValue(obj, key, defaultValue = null) {
    const keys = key.split(".");
    let value = obj;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    return value !== undefined ? value : defaultValue;
  }

  /**
   * 중첩된 객체 값 설정
   * @private
   */
  _setNestedValue(obj, key, value) {
    const keys = key.split(".");
    const lastKey = keys.pop();
    let target = obj;

    for (const k of keys) {
      if (!(k in target) || typeof target[k] !== "object") {
        target[k] = {};
      }
      target = target[k];
    }

    target[lastKey] = value;
  }

  /**
   * 중첩된 객체 값 삭제
   * @private
   */
  _deleteNestedValue(obj, key) {
    const keys = key.split(".");
    const lastKey = keys.pop();
    let target = obj;

    for (const k of keys) {
      if (!(k in target) || typeof target[k] !== "object") {
        return;
      }
      target = target[k];
    }

    delete target[lastKey];
  }

  /**
   * 깊은 병합
   * @private
   */
  _deepMerge(target, source) {
    const output = { ...target };

    if (this._isObject(target) && this._isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (this._isObject(source[key])) {
          if (!(key in target)) {
            output[key] = source[key];
          } else {
            output[key] = this._deepMerge(target[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }

    return output;
  }

  /**
   * 객체 확인
   * @private
   */
  _isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
  }
}

/**
 * 앱 설정 관리 (싱글톤)
 */
class AppConfig extends ConfigManager {
  static instance = null;

  constructor(defaults = {}) {
    if (AppConfig.instance) {
      return AppConfig.instance;
    }

    super({
      app: {
        name: "My App",
        version: "1.0.0",
        debug: false,
      },
      ui: {
        theme: "light",
        language: "ko",
        animations: true,
      },
      features: {
        search: true,
        notifications: true,
        autoSave: true,
      },
      ...defaults,
    });

    AppConfig.instance = this;
  }

  /**
   * 싱글톤 인스턴스 가져오기
   * @returns {AppConfig}
   */
  static getInstance() {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  /**
   * 앱 이름 가져오기
   * @returns {string}
   */
  getAppName() {
    return this.get("app.name");
  }

  /**
   * 앱 버전 가져오기
   * @returns {string}
   */
  getAppVersion() {
    return this.get("app.version");
  }

  /**
   * 디버그 모드 확인
   * @returns {boolean}
   */
  isDebugMode() {
    return this.get("app.debug", false);
  }

  /**
   * 테마 가져오기
   * @returns {string}
   */
  getTheme() {
    return this.get("ui.theme", "light");
  }

  /**
   * 테마 설정
   * @param {string} theme - 테마
   */
  setTheme(theme) {
    this.set("ui.theme", theme);
    this.saveToStorage();
  }

  /**
   * 언어 가져오기
   * @returns {string}
   */
  getLanguage() {
    return this.get("ui.language", "ko");
  }

  /**
   * 언어 설정
   * @param {string} language - 언어
   */
  setLanguage(language) {
    this.set("ui.language", language);
    this.saveToStorage();
  }

  /**
   * 애니메이션 사용 여부
   * @returns {boolean}
   */
  useAnimations() {
    return this.get("ui.animations", true);
  }

  /**
   * 기능 활성화 여부
   * @param {string} feature - 기능 이름
   * @returns {boolean}
   */
  isFeatureEnabled(feature) {
    return this.get(`features.${feature}`, false);
  }

  /**
   * 기능 토글
   * @param {string} feature - 기능 이름
   */
  toggleFeature(feature) {
    const current = this.isFeatureEnabled(feature);
    this.set(`features.${feature}`, !current);
    this.saveToStorage();
  }
}

/**
 * HTML data 속성에서 설정 로드
 */
class DataAttributeConfig {
  /**
   * 요소에서 설정 로드
   * @param {Element} element - 대상 요소
   * @param {string} prefix - 속성 접두사
   * @returns {Object}
   */
  static loadFromElement(element, prefix = "data-") {
    if (!element) return {};

    const config = {};
    const attributes = element.attributes;

    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      if (attr.name.startsWith(prefix)) {
        const key = attr.name
          .substring(prefix.length)
          .replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        config[key] = this._parseValue(attr.value);
      }
    }

    return config;
  }

  /**
   * 값 파싱
   * @private
   */
  static _parseValue(value) {
    // boolean
    if (value === "true") return true;
    if (value === "false") return false;

    // number
    if (!isNaN(value) && value !== "") {
      return parseFloat(value);
    }

    // JSON
    if ((value.startsWith("{") || value.startsWith("[")) && 
        (value.endsWith("}") || value.endsWith("]"))) {
      try {
        return JSON.parse(value);
      } catch (e) {
        // JSON 파싱 실패 시 문자열 반환
      }
    }

    // string
    return value;
  }
}

// ES6 모듈 내보내기
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ConfigManager, AppConfig, DataAttributeConfig };
}
