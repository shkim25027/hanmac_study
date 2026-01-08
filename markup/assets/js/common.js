/**
 * 공통 유틸리티 함수
 * 공통 모듈(DOMUtils, AnimationUtils) 활용
 */

let scrollY;
let wrap;

// 스크린 높이 계산
function syncHeight() {
  document.documentElement.style.setProperty(
    "--window-inner-height",
    `${window.innerHeight}px`
  );
}

// 즉시 실행 (공통 모듈 로드 전에도 작동하도록)
// 페이지 로드 시점에 바로 높이 설정
syncHeight();

// mobile check
function isMobile() {
  const width = window.innerWidth;
  if (width < 1025) {
    return true;
  }
  return false;
}

// body scroll lock
function bodyLock() {
  scrollY = window.scrollY;
  document.documentElement.classList.add("is-locked");
  document.documentElement.style.scrollBehavior = "auto";
  if (wrap) {
    wrap.style.top = `-${scrollY}px`;
  }
}

// body scroll unlock
function bodyUnlock() {
  document.documentElement.classList.remove("is-locked");

  window.scrollTo(0, scrollY);
  if (wrap) {
    wrap.style.top = "";
  }
  document.documentElement.style.scrollBehavior = "";
}

// popup open (DOMUtils 활용)
async function popOpen(id) {
  const element = DOMUtils.$(`#${id}`);
  if (element) {
    await DOMUtils.fadeIn(element, 300);
    bodyLock();
  }
}

// popup close (DOMUtils 활용)
async function popClose(obj) {
  const popup = obj.closest ? obj.closest(".popup") : null;
  if (popup) {
    await DOMUtils.fadeOut(popup, 300);
    bodyUnlock();
  }
}

// 🔹 페이지 처음 로드될 때 처리
let baseHref = "";
document.addEventListener("DOMContentLoaded", () => {
  baseHref = window.location.href.split("#")[0];
  wrap = DOMUtils.$(".wrap");
  syncHeight();
  // AOS.init();
  //includehtml();
  
  // 이벤트 위임으로 클릭 이벤트 처리
  DOMUtils.delegate(document, "click", "[id^=open-modal]", function (e) {
    const modalId = this.id.replace("open-", "");
    const modal = DOMUtils.$(`#${modalId}`);
    if (modal) {
      DOMUtils.fadeIn(modal, 300);
      bodyLock();
    }
  });

  // 닫기 버튼 클릭 시
  DOMUtils.delegate(document, "click", ".close", async function (e) {
    const modal = this.closest(".modal");
    if (modal) {
      await DOMUtils.fadeOut(modal, 300);
      bodyUnlock();
      
      // 비디오 정지
      const video = modal.querySelector("video");
      if (video) video.pause();
    }
  });
  
  // 🔹 모달 바깥 클릭 시 닫기
  DOMUtils.delegate(document, "click", ".modal", async function (e) {
    // 클릭한 영역이 .modal-content 내부가 아닐 경우만 닫기
    const modalContent = e.target.closest(".modal-content");
    if (!modalContent && e.target === this) {
      await DOMUtils.fadeOut(this, 300);
      bodyUnlock();

      // 비디오 정지
      const video = this.querySelector("video");
      if (video) video.pause();
    }
  });
});

// 리사이즈 이벤트 (쓰로틀 적용)
// 모바일 브라우저 주소창 변화에 대응하기 위해 전체 윈도우에 적용
// --window-inner-height CSS 변수는 전역적으로 사용됨 (.wrap, body, intro 등)
// Utils가 로드되지 않은 경우를 대비한 폴백
let throttledSyncHeight;
if (typeof Utils !== 'undefined' && Utils.throttle) {
  throttledSyncHeight = Utils.throttle(syncHeight, 100);
} else {
  // Utils가 없을 경우 간단한 쓰로틀 구현
  let resizeTimer;
  throttledSyncHeight = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncHeight, 100);
  };
}
window.addEventListener("resize", throttledSyncHeight);

// 모바일에서 주소창 표시/숨김 시에도 동작하도록 orientationchange 이벤트 추가
window.addEventListener("orientationchange", () => {
  // orientationchange 후 약간의 지연을 두고 실행 (브라우저가 크기 계산 완료 대기)
  setTimeout(syncHeight, 100);
});

window.addEventListener("scroll", () => {});

// container 스크롤 시 border-radius 펼쳐지는 효과
function initContainerScrollEffect() {
  const container = DOMUtils.$(".container");
  if (!container) return;

  // 검색 결과 페이지에서는 이 효과를 적용하지 않음 (상단 라운드 유지)
  const wrap = container.closest(".wrap");
  if (wrap && wrap.classList.contains("search-result")) {
    return;
  }

  const borderRadius = 30; // border-radius 값
  const scrollThreshold = 100; // border-radius가 완전히 펼쳐지는 스크롤 거리

  // 스크롤 이벤트에 쓰로틀 적용
  const throttledScroll = Utils.throttle(() => {
    const scrollTop = container.scrollTop;
    // 스크롤 위치에 따라 border-radius를 점진적으로 제거
    const progress = Math.min(scrollTop / scrollThreshold, 1);
    const currentRadius = borderRadius * (1 - progress);

    // clip-path를 사용하여 border-radius 효과 구현
    container.style.clipPath = `inset(0 0 0 0 round ${currentRadius}px ${currentRadius}px 0 0)`;
  }, 16);

  container.addEventListener("scroll", throttledScroll);
}

// DOMContentLoaded 시 초기화
document.addEventListener("DOMContentLoaded", () => {
 // initContainerScrollEffect();
 
 // 현재 페이지에 따라 네비게이션 active 클래스 추가
 setActiveNavigation();
});

// 현재 페이지에 따라 네비게이션 active 클래스 설정
function setActiveNavigation() {
  const currentPath = window.location.pathname;
  const navItems = DOMUtils.$$('.nav-group .depth01 > li');
  
  navItems.forEach((li) => {
    const link = DOMUtils.$('a', li);
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    // 현재 경로와 링크의 href를 비교
    // onboarding.html이 포함되어 있으면 active 클래스 추가
    if (currentPath.includes('onboarding') && href.includes('onboarding')) {
      DOMUtils.addClasses(li, 'active');
    } else if (currentPath.includes('learning') && href.includes('learning')) {
      DOMUtils.addClasses(li, 'active');
    } else {
      // 다른 페이지에서는 active 제거 (필요한 경우)
      DOMUtils.removeClasses(li, 'active');
    }
  });
}

// HTML include 함수 (개선 버전 - async/await 사용)
async function includehtml() {
  const allElements = DOMUtils.$$("[data-include-path]");
  
  const promises = Array.from(allElements).map(async (el) => {
    const includePath = el.dataset.includePath;
    if (!includePath) return;
    
    try {
      const response = await fetch(includePath);
      if (!response.ok) {
        console.error(`Failed to load: ${includePath}`);
        return;
      }
      
      const html = await response.text();
      el.innerHTML = html;
      el.removeAttribute("data-include-path");
    } catch (error) {
      console.error(`Error loading ${includePath}:`, error);
    }
  });
  
  await Promise.all(promises);
}
