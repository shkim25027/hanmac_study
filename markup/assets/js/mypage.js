/**
 * 마이페이지 전용 스크립트
 * =====================
 * 이 파일은 mypage.html에서만 사용됩니다.
 * 초보자도 이해하기 쉽도록 주석을 많이 달았습니다.
 */

(function () {
  "use strict";

  // ------------------------------
  // 1. 컨텐츠 제안 영역
  // ------------------------------
  // URL과 추천이유가 모두 입력되면 "제안 보내기" 버튼이 활성화됩니다.
  var suggestUrl = document.querySelector(".suggest-section .suggest-url");
  var suggestReason = document.querySelector(".suggest-section .suggest-reason");
  var suggestBtn = document.querySelector(".suggest-section .btn-primary");

  function checkSuggestForm() {
    if (!suggestBtn) return;
    var hasUrl = suggestUrl && suggestUrl.value.trim().length > 0;
    var hasReason = suggestReason && suggestReason.value.trim().length > 0;
    suggestBtn.disabled = !(hasUrl && hasReason);
  }

  if (suggestUrl) suggestUrl.addEventListener("input", checkSuggestForm);
  if (suggestReason) suggestReason.addEventListener("input", checkSuggestForm);

  // ------------------------------
  // 2. 제안현황 아코디언
  // ------------------------------
  // "제안현황" 버튼을 클릭하면 목록이 펼쳐지거나 접힙니다.
  var accordion = document.querySelector(".suggest-status.accordion");

  if (accordion) {
    var accordionTrigger = accordion.querySelector(".accordion-trigger");
    var accordionContent = accordion.querySelector(".accordion-content");

    accordionTrigger.addEventListener("click", function () {
      // is-open 클래스가 있으면 열림, 없으면 닫힘
      var isOpen = accordion.classList.toggle("is-open");

      // 접근성: 스크린 리더가 열림/닫힘 상태를 인식할 수 있게 함
      accordionTrigger.setAttribute("aria-expanded", isOpen);
      accordionContent.hidden = !isOpen;
    });
  }

  // ------------------------------
  // 3. 콘텐츠 탭 전환
  // ------------------------------
  var contentTabs = document.querySelectorAll(".content-tab");
  var contentPanels = document.querySelectorAll(".content-panel");

  contentTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var targetTab = this.getAttribute("data-tab");
      if (!targetTab) return;

      // 탭 버튼 active 전환
      contentTabs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      this.classList.add("active");
      this.setAttribute("aria-selected", "true");

      // 패널 표시 전환
      contentPanels.forEach(function (panel) {
        var panelId = panel.getAttribute("data-panel");
        panel.classList.toggle("active", panelId === targetTab);
      });
    });
  });
})();
