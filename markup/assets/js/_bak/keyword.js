// ============================================
// 키워드 관리 모듈
// ============================================

export class KeywordManager {
  constructor(config) {
    this.config = config;
    this.allowKeywords = config.initialAllowKeywords || [];
    this.denyKeywords = config.initialDenyKeywords || [];
    this.modal = null;
    this.settingsBtn = null;
    this.maxAllowKeywords = config.maxAllowKeywords || 3;
  }

  // 초기화
  init() {
    this.modal = document.getElementById("keywordModal");
    this.settingsBtn = document.getElementById("keywordSettingsBtn");

    if (!this.modal || !this.settingsBtn) {
      console.error("모달 또는 설정 버튼을 찾을 수 없습니다");
      return;
    }

    this.setupEventListeners();
    this.syncModalCheckboxes();
    this.updateCheckboxStates();
    // 초기화 시에는 updateMainKeywordDisplay() 호출 안 함 - HTML 그대로 유지
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    // 모달 열기
    this.settingsBtn.onclick = () => {
      this.syncModalCheckboxes();
      this.updateCheckboxStates();
      this.modal.style.display = "block";
    };

    // 모달 외부 클릭 시 닫기
    this.modal.onclick = async (e) => {
      if (e.target === this.modal) {
        this.modal.style.display = "none";
        this.updateMainKeywordDisplay();

        // 영상 목록 갱신 콜백 호출
        if (this.config.onKeywordChange) {
          this.config.onKeywordChange();
        }
      }
    };

    // 모달 헤더 체크 아이콘 클릭 시 닫기
    const checkIcon = this.modal.querySelector(".modal-header .ico-check");
    if (checkIcon) {
      checkIcon.onclick = () => {
        this.modal.style.display = "none";
        this.updateMainKeywordDisplay();

        // 영상 목록 갱신 콜백 호출
        if (this.config.onKeywordChange) {
          this.config.onKeywordChange();
        }
      };
    }

    // 모달 내 체크박스 이벤트
    const modalCheckboxes = this.modal.querySelectorAll(
      ".keyword-tag input[type='checkbox']"
    );
    modalCheckboxes.forEach((checkbox) => {
      checkbox.onchange = () => {
        const label = checkbox.closest("label");
        if (label) {
          const keywordText = label.textContent.trim().replace("#", "").trim();

          // 최대 개수 체크
          if (
            checkbox.checked &&
            this.allowKeywords.length >= this.maxAllowKeywords
          ) {
            checkbox.checked = false;
            this.showLimitMessage();
            return;
          }

          if (!checkbox.disabled) {
            this.toggleAllowKeyword(keywordText, checkbox.checked);
            this.updateCheckboxStates();
          }
        }
      };
    });

    // 메인 화면 allow 키워드 영역 이벤트 리스너
    const mainAllowArea = document.querySelector("#myKeyword");
    if (mainAllowArea) {
      mainAllowArea.addEventListener("change", (e) => {
        if (e.target.type === "checkbox") {
          const label = e.target.closest("label");
          if (label) {
            const keywordText = label.textContent
              .trim()
              .replace("#", "")
              .trim();

            // 최대 개수 체크
            if (
              e.target.checked &&
              this.allowKeywords.length >= this.maxAllowKeywords
            ) {
              e.target.checked = false;
              alert(`최대 ${this.maxAllowKeywords}개까지 선택 가능합니다.`);
              return;
            }

            this.toggleAllowKeyword(keywordText, e.target.checked);

            // 영상 목록 갱신
            if (this.config.onKeywordChange) {
              this.config.onKeywordChange();
            }
          }
        }
      });
    }

    // 메인 화면 deny 키워드 영역 이벤트 리스너
    const mainDenyArea = document.querySelector(
      ".keyword-list:not(#myKeyword)"
    );
    if (mainDenyArea) {
      mainDenyArea.addEventListener("change", (e) => {
        if (e.target.type === "checkbox") {
          const label = e.target.closest("label");
          if (label) {
            const keywordText = label.textContent
              .trim()
              .replace("#", "")
              .trim();
            this.toggleDenyKeyword(keywordText, e.target.checked);

            // 영상 목록 갱신
            if (this.config.onKeywordChange) {
              this.config.onKeywordChange();
            }
          }
        }
      });
    }
  }

  // allow 키워드 토글
  toggleAllowKeyword(keyword, isChecked) {
    if (isChecked) {
      if (!this.allowKeywords.includes(keyword)) {
        this.allowKeywords.push(keyword);
      }
    } else {
      this.allowKeywords = this.allowKeywords.filter((k) => k !== keyword);
    }
  }

  // deny 키워드 토글
  toggleDenyKeyword(keyword, isChecked) {
    if (isChecked) {
      if (!this.denyKeywords.includes(keyword)) {
        this.denyKeywords.push(keyword);
      }
    } else {
      this.denyKeywords = this.denyKeywords.filter((k) => k !== keyword);
    }
  }

  // 모달 체크박스 상태 동기화
  syncModalCheckboxes() {
    const modalCheckboxes = this.modal.querySelectorAll(
      ".keyword-tag input[type='checkbox']"
    );
    modalCheckboxes.forEach((checkbox) => {
      const label = checkbox.closest("label");
      if (label) {
        const keywordText = label.textContent.trim().replace("#", "").trim();
        checkbox.checked = this.allowKeywords.includes(keywordText);
      }
    });
  }

  // 체크박스 활성화/비활성화 상태 업데이트
  updateCheckboxStates() {
    const modalCheckboxes = this.modal.querySelectorAll(
      ".keyword-tag input[type='checkbox']"
    );
    const isMaxReached = this.allowKeywords.length >= this.maxAllowKeywords;

    modalCheckboxes.forEach((checkbox) => {
      const label = checkbox.closest("label");
      if (label) {
        const keywordText = label.textContent.trim().replace("#", "").trim();
        const isSelected = this.allowKeywords.includes(keywordText);

        if (!isSelected && isMaxReached) {
          checkbox.disabled = true;
          label.style.opacity = "0.5";
          label.style.cursor = "not-allowed";
        } else {
          checkbox.disabled = false;
          label.style.opacity = "1";
          label.style.cursor = "pointer";
        }
      }
    });
  }

  // 최대 개수 초과 메시지
  showLimitMessage() {
    const modalHeader = this.modal.querySelector(".modal-header");
    if (modalHeader) {
      const existingMsg = modalHeader.querySelector(".limit-message");
      if (existingMsg) return;

      const message = document.createElement("span");
      message.className = "limit-message";
      message.textContent = ` (최대 ${this.maxAllowKeywords}개까지 선택 가능)`;
      message.style.color = "#ff4444";
      message.style.fontSize = "14px";
      message.style.marginLeft = "10px";
      modalHeader.appendChild(message);

      setTimeout(() => {
        message.remove();
      }, 2000);
    }
  }

  // 메인 화면 키워드 표시 업데이트
  updateMainKeywordDisplay() {
    // kw-allow 영역 - 선택된 키워드만 동적으로 생성
    const allowArea = document.querySelector("#myKeyword");
    if (allowArea) {
      allowArea.innerHTML = "";

      this.allowKeywords.forEach((keyword, index) => {
        const label = document.createElement("label");
        label.className = "kw-allow";
        label.setAttribute("for", `chk_allow_${index}`);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `chk_allow_${index}`;
        checkbox.checked = true;

        const text = document.createTextNode(`#${keyword}`);

        label.appendChild(checkbox);
        label.appendChild(text);
        allowArea.appendChild(label);
      });
    }

    // kw-deny 영역은 건드리지 않음 - 관리자가 설정한 값 유지
  }

  // 선택된 키워드 가져오기
  getSelectedKeywords() {
    return {
      allow: [...this.allowKeywords],
      deny: [...this.denyKeywords],
    };
  }

  // 딜레이 유틸리티
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
