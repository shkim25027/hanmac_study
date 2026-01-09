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
  // requestAnimationFrame을 사용하여 부드러운 업데이트 보장
  let rafId = null;
  let lastMouseEvent = null;
  
  document.addEventListener("mousemove", (e) => {
    if (typeof INTRO_STATE !== 'undefined' && INTRO_STATE.currentSection === 2) {
      // 마지막 마우스 이벤트 저장
      lastMouseEvent = e;
      
      // 이미 요청된 애니메이션 프레임이 없으면 새로 요청
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          if (lastMouseEvent) {
            handleMouseMoveOnSection3(lastMouseEvent);
          }
          rafId = null;
          lastMouseEvent = null;
        });
      }
    }
  });
}

/**
 * Section 3의 마우스 움직임 처리 (마스크 효과)
 * @param {MouseEvent} e - 마우스 이벤트
 */
function handleMouseMoveOnSection3(e) {
  try {
    // 입력 검증
    if (!e || typeof e.clientX !== 'number' || typeof e.clientY !== 'number') {
      return;
    }

    const maskContainer = document.getElementById("maskContainer");
    if (!maskContainer) {
      return; // 요소가 없으면 조용히 종료
    }

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const mainContainer = document.getElementById("mainContainer");
    if (!mainContainer) {
      return;
    }

    const mainContainerRect = mainContainer.getBoundingClientRect();
    const h1Elements = mainContainer.querySelectorAll("p");
    const ctaBtn = document.querySelector(".cta-btn");
    let hovering = false;
    let isCtaBtnHovering = false;

    // .cta-btn 위에 마우스가 있는지 먼저 체크
    if (ctaBtn) {
      try {
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
      } catch (error) {
        console.warn('[IntroEvents] CTA 버튼 체크 중 오류:', error);
      }
    }

    // p 요소들 체크
    try {
      h1Elements.forEach((element) => {
        try {
          const h1Rect = element.getBoundingClientRect();
          if (
            mouseX >= h1Rect.left &&
            mouseX <= h1Rect.right &&
            mouseY >= h1Rect.top &&
            mouseY <= h1Rect.bottom
          ) {
            hovering = true;
          }
        } catch (error) {
          // 개별 요소 체크 실패는 무시
        }
      });
    } catch (error) {
      console.warn('[IntroEvents] 요소 체크 중 오류:', error);
    }

    // .cta-btn 위에 있을 때만 세로 위치 고정, 그 외에는 마우스 위치 따라감
    const targetY = isCtaBtnHovering
      ? mainContainerRect.top + mainContainerRect.height / 2.3
      : mouseY;

    // CSS 변수 설정 (안전하게)
    const x = Math.max(0, Math.min(mouseX, window.innerWidth));
    const y = Math.max(0, Math.min(targetY, window.innerHeight));
    const targetSize = hovering ? 380 : 30;

    maskContainer.style.setProperty("--x", `${x}px`);
    maskContainer.style.setProperty("--y", `${y}px`);
    maskContainer.style.setProperty("--size", `${targetSize}px`);
  } catch (error) {
    console.error('[IntroEvents] handleMouseMoveOnSection3 오류:', error);
  }
}