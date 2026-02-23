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
  // 사용자가 텍스트를 입력하면 "제안 보내기" 버튼이 활성화됩니다.
  var suggestInput = document.querySelector(".suggest-section .suggest-input");
  var suggestBtn = document.querySelector(".suggest-section .btn-primary");

  if (suggestInput && suggestBtn) {
    suggestInput.addEventListener("input", function () {
      // trim(): 앞뒤 공백 제거. 빈 칸만 입력한 경우도 비활성화
      var hasText = suggestInput.value.trim().length > 0;
      suggestBtn.disabled = !hasText;
    });
  }

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
})();
