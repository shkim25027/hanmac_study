/**
 * intro-section.js
 * 섹션 전환 및 스크롤 처리 로직
 */

/**
 * 특정 섹션으로 이동
 * @param {number} index - 이동할 섹션 인덱스 (0, 1, 2)
 */
function goToSection(index) {
  if (INTRO_STATE.isAnimating) return;
  INTRO_STATE.isAnimating = true;

  // 자동 스크롤 타이머 정지
  clearTimeout(INTRO_STATE.autoScrollTimer);

  const section1Text = document.getElementById("section1Text");
  const section2Text = document.getElementById("section2Text");
  const section3Text = document.getElementById("section3Text");
  const cardsContainer = document.getElementById("cardsContainer");
  const ctaBtn = document.getElementById("ctaBtn");
  const scrollIndicator = document.getElementById("scrollIndicator");

  // 현재 섹션 페이드 아웃
  if (INTRO_STATE.currentSection === 0) {
    section1Text.classList.add("fade-out");
  } else if (INTRO_STATE.currentSection === 1) {
    section2Text.classList.add("fade-out");
    ["card1", "card2", "card3"].forEach((id) =>
      document.getElementById(id).classList.remove("show")
    );
  } else if (INTRO_STATE.currentSection === 2) {
    section3Text.classList.add("fade-out");
    ctaBtn.classList.remove("show");
  }

  setTimeout(() => {
    // 모든 섹션 숨기기
    section1Text.classList.add("hidden");
    section2Text.classList.add("hidden");
    section3Text.classList.add("hidden");
    scrollIndicator.classList.remove("sec2");
    section1Text.classList.remove("fade-out");
    section2Text.classList.remove("fade-out");
    section3Text.classList.remove("fade-out");

    // 목표 섹션 표시
    if (index === 0) {
      section1Text.classList.remove("hidden");
      cardsContainer.style.display = "none";
      ctaBtn.style.display = "none";
      scrollIndicator.classList.remove("hidden");
    } else if (index === 1) {
      scrollIndicator.classList.add("sec2");
      section2Text.classList.remove("hidden");
      cardsContainer.style.display = "flex";
      ctaBtn.style.display = "none";
      scrollIndicator.classList.remove("hidden");
      resetSection2();
      setTimeout(animateSection2, 200);
    } else if (index === 2) {
      section3Text.classList.remove("hidden");
      cardsContainer.style.display = "none";
      ctaBtn.style.display = "block";
      scrollIndicator.classList.add("hidden");
      scrollIndicator.classList.remove("sec2");
      resetSection3();
      setTimeout(animateSection3, 200);
    }

    INTRO_STATE.currentSection = index;
    setTimeout(() => (INTRO_STATE.isAnimating = false), 500);
  }, 400);
}

/**
 * 다음 섹션으로 스크롤
 */
function handleScrollDown() {
  if (INTRO_STATE.isScrolling || INTRO_STATE.isAnimating) return;

  if (INTRO_STATE.currentSection === 0) {
    INTRO_STATE.isScrolling = true;
    setTimeout(() => (INTRO_STATE.isScrolling = false), 700);
    goToSection(1);
  } else if (INTRO_STATE.currentSection === 1 && INTRO_STATE.section2AnimDone) {
    INTRO_STATE.isScrolling = true;
    setTimeout(() => (INTRO_STATE.isScrolling = false), 700);
    goToSection(2);
  }
}

/**
 * 이전 섹션으로 스크롤
 */
function handleScrollUp() {
  if (INTRO_STATE.isScrolling || INTRO_STATE.isAnimating) return;
  INTRO_STATE.isScrolling = true;
  setTimeout(() => (INTRO_STATE.isScrolling = false), 700);

  if (INTRO_STATE.currentSection === 2) {
    goToSection(1);
  } else if (INTRO_STATE.currentSection === 1) {
    goToSection(0);
  }
}