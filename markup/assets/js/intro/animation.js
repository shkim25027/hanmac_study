/**
 * intro-animation.js
 * 인트로 페이지 애니메이션 함수들
 */

/**
 * Section 1: 이름 타이핑 애니메이션
 */
function typeName() {
  // 안전성 검사
  if (typeof INTRO_CONFIG === 'undefined' || typeof INTRO_STATE === 'undefined') {
    console.error('INTRO_CONFIG or INTRO_STATE is not defined');
    return;
  }

  const typedNameEl = document.getElementById("typedName");
  const cursorEl = document.getElementById("cursor");
  
  if (!typedNameEl) {
    console.error('typedName element not found');
    return;
  }

  if (!INTRO_CONFIG.fullName || INTRO_CONFIG.fullName.length === 0) {
    console.error('INTRO_CONFIG.fullName is empty');
    return;
  }

  if (INTRO_STATE.typedIndex < INTRO_CONFIG.fullName.length) {
    const currentText = INTRO_CONFIG.fullName.slice(0, INTRO_STATE.typedIndex + 1);
    typedNameEl.textContent = currentText;
    INTRO_STATE.typedIndex++;
    setTimeout(typeName, INTRO_CONFIG.typingSpeed);
  } else {
    if (cursorEl) {
      cursorEl.style.opacity = "0";
    }
    setTimeout(animateWelcome, 600);
  }
}

/**
 * Section 1: 환영 메시지 애니메이션
 */
function animateWelcome() {
  const container = document.getElementById("welcome");
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = INTRO_CONFIG.welcomeText;

  let html = "";
  tempDiv.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      html += node.textContent
        .split("")
        .map((c) => `<span>${c === " " ? "&nbsp;" : c}</span>`)
        .join("");
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const innerText = node.textContent
        .split("")
        .map((c) => `<span>${c === " " ? "&nbsp;" : c}</span>`)
        .join("");
      html += `<${node.tagName.toLowerCase()}>${innerText}</${node.tagName.toLowerCase()}>`;
    }
  });

  container.innerHTML = html;
  container.querySelectorAll("span").forEach((char, i) => {
    setTimeout(
      () => char.classList.add("show"),
      i * INTRO_CONFIG.welcomeCharSpeed
    );
  });

  // 애니메이션 완료 후 자동 스크롤 타이머 시작
  setTimeout(
    () => {
      startAutoScrollTimer();
    },
    INTRO_CONFIG.fullName.length * INTRO_CONFIG.welcomeCharSpeed + 1000
  );
}

/**
 * Section 2: 업데이트 텍스트 + 카드 애니메이션
 */
function animateSection2() {
  const lines = ["line1", "line2", "line3"];
  lines.forEach((id, i) => {
    setTimeout(
      () => document.getElementById(id).classList.add("show"),
      i * 600
    );
  });

  setTimeout(
    () => {
      ["card1", "card2", "card3"].forEach((id, i) => {
        setTimeout(() => {
          document.getElementById(id).classList.add("show");
          if (i === 2) {
            INTRO_STATE.section2AnimDone = true;
            // Section 2 애니메이션 완료 후 자동 스크롤 타이머 시작
            startAutoScrollTimer();
          }
        }, i * 250);
      });
    },
    lines.length * 600 + 300
  );
}

/**
 * Section 2: 애니메이션 리셋
 */
function resetSection2() {
  ["line1", "line2", "line3"].forEach((id) =>
    document.getElementById(id).classList.remove("show")
  );
  ["card1", "card2", "card3"].forEach((id) =>
    document.getElementById(id).classList.remove("show")
  );
  INTRO_STATE.section2AnimDone = false;
}

/**
 * Section 3: CTA 애니메이션
 */
function animateSection3() {
  setTimeout(() => {
    document.getElementById("ctaBtn").classList.add("show");
  }, 100);
  setTimeout(() => {
    document.getElementById("ctaLine1").classList.add("show");
  }, 300);
  setTimeout(() => {
    document.getElementById("ctaLine2").classList.add("show");
  }, 500);
}

/**
 * Section 3: 애니메이션 리셋
 */
function resetSection3() {
  document.getElementById("ctaLine1").classList.remove("show");
  document.getElementById("ctaLine2").classList.remove("show");
  document.getElementById("ctaBtn").classList.remove("show");
}

/**
 * 자동 스크롤 타이머 시작
 */
function startAutoScrollTimer() {
  clearTimeout(INTRO_STATE.autoScrollTimer);
  // 첫 번째 세션(섹션 0)일 때만 1500ms, 이후는 3000ms
  const delay = INTRO_STATE.currentSection === 0 ? 1500 : 3000;
  INTRO_STATE.autoScrollTimer = setTimeout(() => {
    // 마지막 상호작용 후 설정된 시간이 지났는지 확인
    if (
      Date.now() - INTRO_STATE.lastInteractionTime >=
      delay
    ) {
      handleScrollDown();
    }
  }, delay);
}

/**
 * 사용자 상호작용 감지 - 자동 스크롤 타이머 리셋
 */
function resetAutoScrollTimer() {
  INTRO_STATE.lastInteractionTime = Date.now();
  startAutoScrollTimer();
}