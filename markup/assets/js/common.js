let scrollY;
let wrap;

// 스크린 높이 계산
function syncHeight() {
  document.documentElement.style.setProperty(
    "--window-inner-height",
    `${window.innerHeight}px`
  );
}

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
  wrap.style.top = `-${scrollY}px`;
}

// body scroll unlock
function bodyUnlock() {
  document.documentElement.classList.remove("is-locked");

  window.scrollTo(0, scrollY);
  wrap.style.top = "";
  document.documentElement.style.scrollBehavior = "";
}

// popup open
function popOpen(id) {
  $("#" + id).fadeIn("fast");
  bodyLock();
}

// popup close
function popClose(obj) {
  $(obj).parents(".popup").fadeOut("fast");
  bodyUnlock();
}

// 🔹 페이지 처음 로드될 때 처리
let baseHref = "";
document.addEventListener("DOMContentLoaded", () => {
  baseHref = window.location.href.split("#")[0];
  wrap = document.querySelector(".wrap");
  syncHeight();
  // AOS.init();
  //includehtml();
  $(document).on("click", function (event) {
    // 특정 영역 선택 (예: #targetElement)
    if (!$(event.target).closest(".tip-area").length) {
      /*
      const group = location.hash;
      const tipBtn = $(group).find(".btn-tip");
      if ($(tipBtn).hasClass("on")) {
        $(tipBtn).removeClass("on");
      }
        */
    }
  });

  $("[id^=open-modal]").click(function () {
    var modalId = this.id.replace("open-", "");
    $("#" + modalId).show();
  });

  // 닫기 버튼 또는 배경 클릭 시
  $(".close").click(function () {
    $(".modal").hide();
    var video = $(this).next().get(0);
    video.pause();
  });
  // 🔹 모달 바깥 클릭 시 닫기
  $(document).on("click", ".modal", function (e) {
    // 클릭한 영역이 .modal-content 내부가 아닐 경우만 닫기
    if (!$(e.target).closest(".modal-content").length) {
      $(this).hide();

      // 비디오 정지
      var video = $(this).find("video").get(0);
      if (video) video.pause();
    }
  });
});

window.addEventListener("resize", () => {
  syncHeight();
});

window.addEventListener("scroll", () => {});

// container 스크롤 시 border-radius 펼쳐지는 효과
function initContainerScrollEffect() {
  const container = document.querySelector(".container");
  if (!container) return;

  // 검색 결과 페이지에서는 이 효과를 적용하지 않음 (상단 라운드 유지)
  const wrap = container.closest(".wrap");
  if (wrap && wrap.classList.contains("search-result")) {
    return;
  }

  const borderRadius = 30; // border-radius 값
  const scrollThreshold = 100; // border-radius가 완전히 펼쳐지는 스크롤 거리

  container.addEventListener("scroll", () => {
    const scrollTop = container.scrollTop;
    // 스크롤 위치에 따라 border-radius를 점진적으로 제거
    const progress = Math.min(scrollTop / scrollThreshold, 1);
    const currentRadius = borderRadius * (1 - progress);

    // clip-path를 사용하여 border-radius 효과 구현
    container.style.clipPath = `inset(0 0 0 0 round ${currentRadius}px ${currentRadius}px 0 0)`;
  });
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
  const navItems = document.querySelectorAll('.nav-group .depth01 > li');
  
  navItems.forEach((li) => {
    const link = li.querySelector('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    // 현재 경로와 링크의 href를 비교
    // onboarding.html이 포함되어 있으면 active 클래스 추가
    if (currentPath.includes('onboarding.html') && href.includes('onboarding.html')) {
      li.classList.add('active');
    } else if (currentPath.includes('learning.html') && href.includes('learning.html')) {
      li.classList.add('active');
    } else {
      // 다른 페이지에서는 active 제거 (필요한 경우)
      li.classList.remove('active');
    }
  });
}

function includehtml() {
  var allElements = document.querySelectorAll("[data-include-path]");
  Array.prototype.forEach.call(allElements, function (el) {
    var includePath = el.dataset.includePath;
    var secId = el.id;
    if (includePath) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          //el.outerHTML = this.responseText;
          el.innerHTML = this.responseText;
          el.removeAttribute("data-include-path");
        }
      };
      xhttp.open("GET", includePath, false);
      xhttp.send();
    }
  });
}
