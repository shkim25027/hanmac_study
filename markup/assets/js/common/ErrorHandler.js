/**
 * 에러 처리 모듈
 * 에러 처리, 로깅, 사용자 알림을 중앙에서 관리
 * @module ErrorHandler
 */
class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
    this.onErrorCallbacks = [];
  }

  /**
   * 에러 처리
   * @param {Error|string} error - 에러 객체 또는 메시지
   * @param {Object} context - 컨텍스트 정보
   * @param {boolean} showToUser - 사용자에게 표시할지 여부
   */
  static handle(error, context = {}, showToUser = false) {
    const errorInfo = this._normalizeError(error, context);
    
    // 콘솔에 로그
    console.error('[ErrorHandler]', errorInfo);

    // 에러 로그에 추가
    if (this.instance) {
      this.instance._addToLog(errorInfo);
    }

    // 콜백 실행
    if (this.instance) {
      this.instance.onErrorCallbacks.forEach(callback => {
        try {
          callback(errorInfo);
        } catch (e) {
          console.error('[ErrorHandler] Error in callback:', e);
        }
      });
    }

    // 사용자에게 표시
    if (showToUser) {
      this._showToUser(errorInfo);
    }

    return errorInfo;
  }

  /**
   * 에러를 정규화
   * @private
   */
  static _normalizeError(error, context) {
    const errorInfo = {
      message: '',
      stack: '',
      timestamp: new Date().toISOString(),
      context: {},
      ...context,
    };

    if (error instanceof Error) {
      errorInfo.message = error.message;
      errorInfo.stack = error.stack;
      errorInfo.name = error.name;
    } else if (typeof error === 'string') {
      errorInfo.message = error;
    } else {
      errorInfo.message = 'Unknown error';
      errorInfo.originalError = error;
    }

    return errorInfo;
  }

  /**
   * 사용자에게 에러 표시
   * @private
   */
  static _showToUser(errorInfo) {
    // ModalBase가 있으면 사용, 없으면 alert
    if (typeof AlertModal !== 'undefined') {
      const alert = new AlertModal({
        title: '오류 발생',
        message: errorInfo.message || '알 수 없는 오류가 발생했습니다.',
      });
      alert.show();
    } else if (typeof ModalBase !== 'undefined') {
      // 간단한 알림 모달 생성
      const modal = new ModalBase();
      modal.create({
        content: `<div style="padding: 20px;">${errorInfo.message || '오류가 발생했습니다.'}</div>`,
      });
      modal.open();
    } else {
      // 최후의 수단: alert
      alert(errorInfo.message || '오류가 발생했습니다.');
    }
  }

  /**
   * 에러 로그에 추가
   * @private
   */
  _addToLog(errorInfo) {
    this.errorLog.push(errorInfo);
    
    // 최대 크기 초과 시 오래된 항목 제거
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }
  }

  /**
   * 에러 콜백 등록
   * @param {Function} callback - 콜백 함수
   */
  onError(callback) {
    if (typeof callback === 'function') {
      this.onErrorCallbacks.push(callback);
    }
  }

  /**
   * 에러 콜백 제거
   * @param {Function} callback - 콜백 함수
   */
  offError(callback) {
    const index = this.onErrorCallbacks.indexOf(callback);
    if (index > -1) {
      this.onErrorCallbacks.splice(index, 1);
    }
  }

  /**
   * 에러 로그 가져오기
   * @param {number} limit - 최대 개수
   * @returns {Array}
   */
  getErrorLog(limit = null) {
    if (limit) {
      return this.errorLog.slice(-limit);
    }
    return [...this.errorLog];
  }

  /**
   * 에러 로그 초기화
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * 안전한 함수 실행 (에러 처리 포함)
   * @param {Function} fn - 실행할 함수
   * @param {*} defaultValue - 에러 발생 시 반환할 기본값
   * @param {Object} context - 컨텍스트 정보
   * @returns {*}
   */
  static safeExecute(fn, defaultValue = null, context = {}) {
    try {
      return fn();
    } catch (error) {
      this.handle(error, context, false);
      return defaultValue;
    }
  }

  /**
   * 안전한 비동기 함수 실행 (에러 처리 포함)
   * @param {Function} fn - 실행할 함수
   * @param {*} defaultValue - 에러 발생 시 반환할 기본값
   * @param {Object} context - 컨텍스트 정보
   * @returns {Promise}
   */
  static async safeExecuteAsync(fn, defaultValue = null, context = {}) {
    try {
      return await fn();
    } catch (error) {
      this.handle(error, context, false);
      return defaultValue;
    }
  }

  /**
   * 전역 에러 핸들러 설정
   */
  static setupGlobalHandlers() {
    // 전역 에러 핸들러
    window.addEventListener('error', (event) => {
      this.handle(event.error || event.message, {
        type: 'global',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }, false);
    });

    // Promise rejection 핸들러
    window.addEventListener('unhandledrejection', (event) => {
      this.handle(event.reason, {
        type: 'unhandledRejection',
      }, false);
    });
  }
}

// 싱글톤 인스턴스
ErrorHandler.instance = new ErrorHandler();

// ES6 모듈 내보내기
if (typeof module !== "undefined" && module.exports) {
  module.exports = ErrorHandler;
}
