/**
 * intro-init.js
 * 인트로 페이지 초기화
 */

/**
 * 페이지 초기 설정
 */
function initializeIntroPage() {
  // 초기 요소 숨김 처리
  document.getElementById("cardsContainer").style.display = "none";
  document.getElementById("ctaBtn").style.display = "none";
  document.getElementById("maskContainer").style.setProperty("--size", "30px");

  // 이벤트 리스너 등록
  initEventListeners();

  // typedIndex 초기화 및 typedName 요소 초기화
  if (typeof INTRO_STATE !== 'undefined') {
    INTRO_STATE.typedIndex = 0;
  }
  const typedNameEl = document.getElementById("typedName");
  if (typedNameEl) {
    typedNameEl.textContent = "";
  }
  const cursorEl = document.getElementById("cursor");
  if (cursorEl) {
    cursorEl.style.opacity = "1";
  }

  // 타이핑 애니메이션 시작 (INTRO_CONFIG가 준비된 후)
  setTimeout(() => {
    if (typeof INTRO_CONFIG !== 'undefined' && typeof INTRO_STATE !== 'undefined' && INTRO_CONFIG.fullName) {
      // text-ani 섹션 표시 (CSS에서 display: none이므로 animating 클래스 추가)
      const textAniSection = document.querySelector('.text-ani');
      if (textAniSection) {
        textAniSection.classList.add('animating');
      }
      
      INTRO_STATE.typedIndex = 0;
      typeName();
    }
  }, 800);
}

// DOM이 로드되면 초기화 실행
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeIntroPage);
} else {
  // DOMContentLoaded 이벤트가 이미 발생한 경우
  initializeIntroPage();
}

/**
 * 외부에서 사용자 이름을 설정하고 다시 시작하는 함수
 * @param {string} name - 사용자 이름
 */
function restartIntroWithName(name) {
  // 이름 설정
  setUserName(name);

  // 상태 초기화
  INTRO_STATE.currentSection = 0;
  INTRO_STATE.typedIndex = 0;
  INTRO_STATE.isScrolling = false;
  INTRO_STATE.isAnimating = false;
  INTRO_STATE.section2AnimDone = false;
  clearTimeout(INTRO_STATE.autoScrollTimer);
  INTRO_STATE.lastInteractionTime = Date.now();

  // 화면 리셋
  document.getElementById("typedName").textContent = "";
  document.getElementById("cursor").style.opacity = "1";
  document.getElementById("welcome").innerHTML = "";

  // text-ani 섹션 표시
  const textAniSection = document.querySelector('.text-ani');
  if (textAniSection) {
    textAniSection.classList.add('animating');
  }

  // 섹션 1로 이동
  goToSection(0);

  // 타이핑 재시작
  setTimeout(typeName, 800);
}