/**
 * intro-events.js
 * 이벤트 리스너 설정
 */

/**
 * 모든 이벤트 리스너 등록
 */
function initEventListeners() {
  // 마우스 휠 이벤트
  document.addEventListener("wheel", (e) => {
    resetAutoScrollTimer();
    if (e.deltaY > 0) handleScrollDown();
    else handleScrollUp();
  });

  // 터치 이벤트
  let touchStartY = 0;
  document.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
      resetAutoScrollTimer();
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    (e) => {
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 60) {
        if (diff > 0) handleScrollDown();
        else handleScrollUp();
      }
    },
    { passive: true }
  );

  // 키보드 이벤트
  document.addEventListener("keydown", (e) => {
    if (["ArrowDown", "PageDown", " "].includes(e.key)) {
      e.preventDefault();
      resetAutoScrollTimer();
      handleScrollDown();
    } else if (["ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      resetAutoScrollTimer();
      handleScrollUp();
    }
  });

  // 마우스 움직임 이벤트 (Section 3 마스크 효과)
  document.addEventListener("mousemove", (e) => {
    if (INTRO_STATE.currentSection === 2) {
      handleMouseMoveOnSection3(e);
    }
  });
}

/**
 * Section 3의 마우스 움직임 처리 (마스크 효과)
 * @param {MouseEvent} e - 마우스 이벤트
 */
function handleMouseMoveOnSection3(e) {
  const maskContainer = document.getElementById("maskContainer");
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const mainContainer = document.getElementById("mainContainer");
  const mainContainerRect = mainContainer.getBoundingClientRect();
  const h1Elements = mainContainer.querySelectorAll("p");
  const ctaBtn = document.querySelector(".cta-btn");
  let hovering = false;
  let isCtaBtnHovering = false;

  // .cta-btn 위에 마우스가 있는지 먼저 체크
  if (ctaBtn) {
    const ctaRect = ctaBtn.getBoundingClientRect();
    if (
      mouseX >= ctaRect.left &&
      mouseX <= ctaRect.right &&
      mouseY >= ctaRect.top &&
      mouseY <= ctaRect.bottom
    ) {
      hovering = true;
      isCtaBtnHovering = true;
    }
  }

  h1Elements.forEach((element) => {
    const h1Rect = element.getBoundingClientRect();
    if (
      mouseX >= h1Rect.left &&
      mouseX <= h1Rect.right &&
      mouseY >= h1Rect.top &&
      mouseY <= h1Rect.bottom
    ) {
      hovering = true;
    }
  });

  // .cta-btn 위에 있을 때만 세로 위치 고정, 그 외에는 마우스 위치 따라감
  const targetY = isCtaBtnHovering
    ? mainContainerRect.top + mainContainerRect.height / 2.3
    : mouseY;

  maskContainer.style.setProperty("--x", `${mouseX}px`);
  maskContainer.style.setProperty("--y", `${targetY}px`);

  const targetSize = hovering ? 380 : 30;
  maskContainer.style.setProperty("--size", `${targetSize}px`);
}