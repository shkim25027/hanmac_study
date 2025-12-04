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
