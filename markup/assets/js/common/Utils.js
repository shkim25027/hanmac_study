/**
 * 공통 유틸리티 함수 모듈
 * @module Utils
 */
class Utils {
  /**
   * 딜레이 함수
   * @param {number} ms - 지연 시간 (밀리초)
   * @returns {Promise}
   */
  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 디바운스 함수
   * @param {Function} func - 실행할 함수
   * @param {number} wait - 대기 시간
   * @returns {Function}
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * 쓰로틀 함수
   * @param {Function} func - 실행할 함수
   * @param {number} limit - 제한 시간
   * @returns {Function}
   */
  static throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * 랜덤 ID 생성
   * @param {number} length - ID 길이
   * @returns {string}
   */
  static generateId(length = 8) {
    return Math.random()
      .toString(36)
      .substring(2, length + 2);
  }

  /**
   * 깊은 복사
   * @param {*} obj - 복사할 객체
   * @returns {*}
   */
  static deepClone(obj) {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map((item) => this.deepClone(item));

    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = this.deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  /**
   * 객체 병합
   * @param {Object} target - 대상 객체
   * @param {Object} source - 소스 객체
   * @returns {Object}
   */
  static mergeDeep(target, source) {
    const output = { ...target };
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.mergeDeep(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  /**
   * 객체 확인
   * @param {*} item - 확인할 항목
   * @returns {boolean}
   */
  static isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
  }

  /**
   * URL 파라미터 파싱
   * @param {string} url - URL 문자열
   * @returns {Object}
   */
  static parseUrlParams(url = window.location.search) {
    const params = new URLSearchParams(url);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  }

  /**
   * 퍼센트 계산
   * @param {number} current - 현재 값
   * @param {number} total - 전체 값
   * @param {number} decimals - 소수점 자리수
   * @returns {number}
   */
  static calculatePercent(current, total, decimals = 0) {
    if (total === 0) return 0;
    const percent = (current / total) * 100;
    return decimals > 0 ? parseFloat(percent.toFixed(decimals)) : Math.round(percent);
  }

  /**
   * 배열 섞기 (Fisher-Yates shuffle)
   * @param {Array} array - 섞을 배열
   * @returns {Array}
   */
  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * 배열 청크 분할
   * @param {Array} array - 분할할 배열
   * @param {number} size - 청크 크기
   * @returns {Array}
   */
  static chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * 로컬 스토리지 관리
   */
  static storage = {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error("Storage set error:", e);
        return false;
      }
    },
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.error("Storage get error:", e);
        return defaultValue;
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error("Storage remove error:", e);
        return false;
      }
    },
    clear() {
      try {
        localStorage.clear();
        return true;
      } catch (e) {
        console.error("Storage clear error:", e);
        return false;
      }
    },
  };

  /**
   * 날짜 포맷팅
   * @param {Date} date - 포맷할 날짜
   * @param {string} format - 포맷 문자열 (YYYY-MM-DD, YYYY.MM.DD 등)
   * @returns {string}
   */
  static formatDate(date, format = "YYYY-MM-DD") {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");
    const second = String(d.getSeconds()).padStart(2, "0");

    return format
      .replace("YYYY", year)
      .replace("MM", month)
      .replace("DD", day)
      .replace("HH", hour)
      .replace("mm", minute)
      .replace("ss", second);
  }

  /**
   * 숫자 포맷팅 (천단위 콤마)
   * @param {number} num - 포맷할 숫자
   * @returns {string}
   */
  static formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /**
   * 파일 크기 포맷팅
   * @param {number} bytes - 바이트 크기
   * @param {number} decimals - 소수점 자리수
   * @returns {string}
   */
  static formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}

// ES6 모듈 내보내기
if (typeof module !== "undefined" && module.exports) {
  module.exports = Utils;
}

