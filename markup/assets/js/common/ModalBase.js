/**
 * 모달 관련 기본 클래스
 * @module ModalBase
 */
class ModalBase {
  constructor(config = {}) {
    this.config = {
      closeOnEscape: true,
      closeOnBackdrop: true,
      showCloseButton: true,
      animation: "fade",
      animationDuration: 300,
      backdrop: true,
      keyboard: true,
      ...config,
    };

    this.modal = null;
    this.backdrop = null;
    this.isOpen = false;
    this.onOpen = config.onOpen || null;
    this.onClose = config.onClose || null;
  }

  /**
   * 모달 생성
   * @param {Object} options - 옵션
   * @returns {HTMLElement}
   */
  create(options = {}) {
    const {
      id = `modal-${Date.now()}`,
      className = "",
      content = "",
      header = null,
      footer = null,
    } = options;

    // 모달 컨테이너
    this.modal = document.createElement("div");
    this.modal.id = id;
    this.modal.className = `modal ${className}`;
    this.modal.setAttribute("role", "dialog");
    this.modal.setAttribute("aria-modal", "true");
    this.modal.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      overflow: auto;
    `;

    // 백드롭
    if (this.config.backdrop) {
      this.backdrop = document.createElement("div");
      this.backdrop.className = "modal-backdrop";
      this.backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: -1;
      `;
      this.modal.appendChild(this.backdrop);
    }

    // 모달 다이얼로그
    const dialog = document.createElement("div");
    dialog.className = "modal-dialog";
    dialog.style.cssText = `
      position: relative;
      margin: 50px auto;
      max-width: 600px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    // 모달 컨텐츠
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // 헤더
    if (header !== null) {
      const modalHeader = document.createElement("div");
      modalHeader.className = "modal-header";
      modalHeader.style.cssText = `
        padding: 20px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;

      if (typeof header === "string") {
        modalHeader.innerHTML = header;
      } else {
        modalHeader.appendChild(header);
      }

      // 닫기 버튼
      if (this.config.showCloseButton) {
        const closeBtn = document.createElement("button");
        closeBtn.className = "modal-close";
        closeBtn.innerHTML = "&times;";
        closeBtn.style.cssText = `
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #999;
        `;
        closeBtn.onclick = () => this.close();
        modalHeader.appendChild(closeBtn);
      }

      modalContent.appendChild(modalHeader);
    }

    // 바디
    const modalBody = document.createElement("div");
    modalBody.className = "modal-body";
    modalBody.style.cssText = `
      padding: 20px;
    `;

    if (typeof content === "string") {
      modalBody.innerHTML = content;
    } else {
      modalBody.appendChild(content);
    }

    modalContent.appendChild(modalBody);

    // 푸터
    if (footer !== null) {
      const modalFooter = document.createElement("div");
      modalFooter.className = "modal-footer";
      modalFooter.style.cssText = `
        padding: 20px;
        border-top: 1px solid #e0e0e0;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      `;

      if (typeof footer === "string") {
        modalFooter.innerHTML = footer;
      } else {
        modalFooter.appendChild(footer);
      }

      modalContent.appendChild(modalFooter);
    }

    dialog.appendChild(modalContent);
    this.modal.appendChild(dialog);

    // 이벤트 리스너 등록
    this._setupEventListeners();

    return this.modal;
  }

  /**
   * 이벤트 리스너 설정
   * @private
   */
  _setupEventListeners() {
    // 백드롭 클릭
    if (this.config.closeOnBackdrop && this.backdrop) {
      this.backdrop.onclick = () => this.close();
    }

    // ESC 키
    if (this.config.closeOnEscape) {
      this._escapeHandler = (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.close();
        }
      };
      document.addEventListener("keydown", this._escapeHandler);
    }

    // 모달 외부 클릭
    if (this.config.closeOnBackdrop) {
      this.modal.onclick = (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      };
    }
  }

  /**
   * 모달 열기
   * @param {Object} data - 전달할 데이터
   * @returns {Promise}
   */
  async open(data = null) {
    if (this.isOpen) return;

    if (!this.modal) {
      console.error("Modal not created");
      return;
    }

    // DOM에 추가
    if (!this.modal.parentElement) {
      document.body.appendChild(this.modal);
    }

    // onOpen 콜백
    if (this.onOpen) {
      await this.onOpen(data);
    }

    // 애니메이션
    this.modal.style.display = "block";
    await this._animate("in");

    this.isOpen = true;

    // body 스크롤 방지
    document.body.style.overflow = "hidden";

    return this;
  }

  /**
   * 모달 닫기
   * @returns {Promise}
   */
  async close() {
    if (!this.isOpen) return;

    // 애니메이션
    await this._animate("out");

    this.modal.style.display = "none";
    this.isOpen = false;

    // body 스크롤 복원
    document.body.style.overflow = "";

    // onClose 콜백
    if (this.onClose) {
      await this.onClose();
    }

    return this;
  }

  /**
   * 모달 토글
   * @param {Object} data - 전달할 데이터
   */
  toggle(data = null) {
    if (this.isOpen) {
      this.close();
    } else {
      this.open(data);
    }
  }

  /**
   * 애니메이션 처리
   * @private
   */
  async _animate(direction) {
    const dialog = this.modal.querySelector(".modal-dialog");
    const { animation, animationDuration } = this.config;

    if (animation === "fade") {
      if (direction === "in") {
        this.modal.style.opacity = "0";
        await this._delay(10);
        this.modal.style.transition = `opacity ${animationDuration}ms`;
        this.modal.style.opacity = "1";
        await this._delay(animationDuration);
      } else {
        this.modal.style.transition = `opacity ${animationDuration}ms`;
        this.modal.style.opacity = "0";
        await this._delay(animationDuration);
      }
    } else if (animation === "slide") {
      if (direction === "in") {
        dialog.style.transform = "translateY(-50px)";
        dialog.style.opacity = "0";
        await this._delay(10);
        dialog.style.transition = `transform ${animationDuration}ms, opacity ${animationDuration}ms`;
        dialog.style.transform = "translateY(0)";
        dialog.style.opacity = "1";
        await this._delay(animationDuration);
      } else {
        dialog.style.transition = `transform ${animationDuration}ms, opacity ${animationDuration}ms`;
        dialog.style.transform = "translateY(-50px)";
        dialog.style.opacity = "0";
        await this._delay(animationDuration);
      }
    } else if (animation === "zoom") {
      if (direction === "in") {
        dialog.style.transform = "scale(0.7)";
        dialog.style.opacity = "0";
        await this._delay(10);
        dialog.style.transition = `transform ${animationDuration}ms, opacity ${animationDuration}ms`;
        dialog.style.transform = "scale(1)";
        dialog.style.opacity = "1";
        await this._delay(animationDuration);
      } else {
        dialog.style.transition = `transform ${animationDuration}ms, opacity ${animationDuration}ms`;
        dialog.style.transform = "scale(0.7)";
        dialog.style.opacity = "0";
        await this._delay(animationDuration);
      }
    }

    // transition 초기화
    this.modal.style.transition = "";
    if (dialog) {
      dialog.style.transition = "";
    }
  }

  /**
   * 딜레이
   * @private
   */
  _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 모달 파괴
   */
  destroy() {
    if (this.isOpen) {
      this.close();
    }

    // 이벤트 리스너 제거
    if (this._escapeHandler) {
      document.removeEventListener("keydown", this._escapeHandler);
    }

    // DOM에서 제거
    if (this.modal && this.modal.parentElement) {
      this.modal.parentElement.removeChild(this.modal);
    }

    this.modal = null;
    this.backdrop = null;
  }

  /**
   * 모달 컨텐츠 업데이트
   * @param {string|Element} content - 새 컨텐츠
   */
  updateContent(content) {
    const modalBody = this.modal.querySelector(".modal-body");
    if (modalBody) {
      if (typeof content === "string") {
        modalBody.innerHTML = content;
      } else {
        modalBody.innerHTML = "";
        modalBody.appendChild(content);
      }
    }
  }

  /**
   * 모달 헤더 업데이트
   * @param {string|Element} header - 새 헤더
   */
  updateHeader(header) {
    const modalHeader = this.modal.querySelector(".modal-header");
    if (modalHeader) {
      if (typeof header === "string") {
        modalHeader.innerHTML = header;
      } else {
        modalHeader.innerHTML = "";
        modalHeader.appendChild(header);
      }

      // 닫기 버튼 재추가
      if (this.config.showCloseButton) {
        const closeBtn = document.createElement("button");
        closeBtn.className = "modal-close";
        closeBtn.innerHTML = "&times;";
        closeBtn.style.cssText = `
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #999;
        `;
        closeBtn.onclick = () => this.close();
        modalHeader.appendChild(closeBtn);
      }
    }
  }
}

/**
 * 확인 모달 (Confirm Dialog)
 */
class ConfirmModal extends ModalBase {
  constructor(config = {}) {
    super(config);
    this.promise = null;
  }

  /**
   * 확인 모달 표시
   * @param {Object} options - 옵션
   * @returns {Promise<boolean>}
   */
  show(options = {}) {
    const {
      title = "확인",
      message = "계속하시겠습니까?",
      confirmText = "확인",
      cancelText = "취소",
      confirmClass = "btn-primary",
      cancelClass = "btn-secondary",
    } = options;

    return new Promise((resolve) => {
      // 헤더
      const header = document.createElement("div");
      header.innerHTML = `<h3 style="margin: 0;">${title}</h3>`;

      // 컨텐츠
      const content = document.createElement("div");
      content.innerHTML = message;

      // 푸터
      const footer = document.createElement("div");

      const cancelBtn = document.createElement("button");
      cancelBtn.className = `btn ${cancelClass}`;
      cancelBtn.textContent = cancelText;
      cancelBtn.onclick = () => {
        this.close();
        resolve(false);
      };

      const confirmBtn = document.createElement("button");
      confirmBtn.className = `btn ${confirmClass}`;
      confirmBtn.textContent = confirmText;
      confirmBtn.onclick = () => {
        this.close();
        resolve(true);
      };

      footer.appendChild(cancelBtn);
      footer.appendChild(confirmBtn);

      // 모달 생성 및 열기
      this.create({ header, content, footer });
      this.open();
    });
  }
}

/**
 * 알림 모달 (Alert Dialog)
 */
class AlertModal extends ModalBase {
  /**
   * 알림 모달 표시
   * @param {Object} options - 옵션
   * @returns {Promise}
   */
  show(options = {}) {
    const {
      title = "알림",
      message = "",
      confirmText = "확인",
      confirmClass = "btn-primary",
    } = options;

    return new Promise((resolve) => {
      // 헤더
      const header = document.createElement("div");
      header.innerHTML = `<h3 style="margin: 0;">${title}</h3>`;

      // 컨텐츠
      const content = document.createElement("div");
      content.innerHTML = message;

      // 푸터
      const footer = document.createElement("div");

      const confirmBtn = document.createElement("button");
      confirmBtn.className = `btn ${confirmClass}`;
      confirmBtn.textContent = confirmText;
      confirmBtn.onclick = () => {
        this.close();
        resolve();
      };

      footer.appendChild(confirmBtn);

      // 모달 생성 및 열기
      this.create({ header, content, footer });
      this.open();
    });
  }
}

// ES6 모듈 내보내기
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ModalBase, ConfirmModal, AlertModal };
}
