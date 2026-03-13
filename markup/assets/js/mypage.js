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
  // ------------------------------
  // 4. 모바일: 학습 활동 모달
  // ------------------------------
  var mobileActivityBtn = document.getElementById("mobileActivityBtn");
  var mobileActivityModal = document.getElementById("mobileActivityModal");
  var mobileActivityClose = document.getElementById("mobileActivityClose");
  var mobileActivityBackdrop = document.getElementById("mobileActivityBackdrop");

  function openActivityModal() {
    if (!mobileActivityModal) return;

    // 버튼 위치 기준으로 모달 패널 위치 계산
    var panel = mobileActivityModal.querySelector(".modal-panel");
    if (panel && mobileActivityBtn) {
      var rect = mobileActivityBtn.getBoundingClientRect();
      var gap = 8;
      var panelWidth = Math.min(window.innerWidth - 32, 420);

      // 버튼 왼쪽 기준 정렬, 화면 밖으로 나가지 않도록 보정
      var left = rect.left;
      if (left + panelWidth > window.innerWidth - 16) {
        left = window.innerWidth - panelWidth - 16;
      }
      if (left < 16) left = 16;

      panel.style.top = (rect.bottom + gap) + "px";
      panel.style.left = left + "px";
      panel.style.width = panelWidth + "px";
    }

    mobileActivityModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeActivityModal() {
    if (!mobileActivityModal) return;
    mobileActivityModal.hidden = true;
    document.body.style.overflow = "";
  }

  if (mobileActivityBtn) mobileActivityBtn.addEventListener("click", openActivityModal);
  if (mobileActivityClose) mobileActivityClose.addEventListener("click", closeActivityModal);
  if (mobileActivityBackdrop) mobileActivityBackdrop.addEventListener("click", closeActivityModal);

  // ------------------------------
  // 5. 모바일: 컨텐츠 제안 바텀시트
  // ------------------------------
  var mobileSuggestBtn = document.getElementById("mobileSuggestBtn");
  var mobileSuggestSheet = document.getElementById("mobileSuggestSheet");
  var mobileSuggestBackdrop = document.getElementById("mobileSuggestBackdrop");
  var btnSheetConfirm = document.getElementById("btnSheetConfirm");
  var sheetUrl = document.getElementById("sheet-url");
  var sheetReason = document.getElementById("sheet-reason");

  function openSuggestSheet() {
    if (!mobileSuggestSheet) return;
    mobileSuggestSheet.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeSuggestSheet() {
    if (!mobileSuggestSheet) return;
    mobileSuggestSheet.hidden = true;
    document.body.style.overflow = "";
  }

  function checkSheetForm() {
    if (!btnSheetConfirm) return;
    var hasUrl = sheetUrl && sheetUrl.value.trim().length > 0;
    var hasReason = sheetReason && sheetReason.value.trim().length > 0;
    btnSheetConfirm.disabled = !(hasUrl && hasReason);
  }

  if (mobileSuggestBtn) mobileSuggestBtn.addEventListener("click", openSuggestSheet);
  if (mobileSuggestBackdrop) mobileSuggestBackdrop.addEventListener("click", closeSuggestSheet);
  if (sheetUrl) sheetUrl.addEventListener("input", checkSheetForm);
  if (sheetReason) sheetReason.addEventListener("input", checkSheetForm);

  // ------------------------------
  // 6. 모바일: 2탭 전환 (콘텐츠 ↔ 한줄 소감)
  // ------------------------------
  var mobileTabContent = document.getElementById("mobileTabContent");
  var mobileTabReview = document.getElementById("mobileTabReview");
  var contentTabWrap = document.querySelector(".mylist-area .content-tab-wrap");
  var reviewSection = document.querySelector(".mylist-area .review-section");

  // 탭별 콘텐츠 패널 이름 목록 (순환용)
  var contentPanelNames = ["watching", "completed", "saved"];
  var contentPanelLabels = ["시청중", "시청완료", "저장"];
  var currentPanelIndex = 1; // 기본: 시청완료

  function updateMobileContentLabel() {
    var label = mobileTabContent && mobileTabContent.querySelector(".mobile-tab-label");
    if (label) label.textContent = contentPanelLabels[currentPanelIndex];
    // 해당 패널 활성화
    contentPanels.forEach(function (panel) {
      var panelId = panel.getAttribute("data-panel");
      panel.classList.toggle("active", panelId === contentPanelNames[currentPanelIndex]);
    });
  }

  function switchMobileTab(target) {
    // target: "content" | "review"
    if (!mobileTabContent || !mobileTabReview) return;

    if (target === "content") {
      mobileTabContent.classList.add("active");
      mobileTabContent.setAttribute("aria-selected", "true");
      mobileTabReview.classList.remove("active");
      mobileTabReview.setAttribute("aria-selected", "false");
      if (contentTabWrap) contentTabWrap.classList.remove("is-mobile-hidden");
      if (reviewSection) reviewSection.classList.remove("is-mobile-active");
    } else {
      mobileTabReview.classList.add("active");
      mobileTabReview.setAttribute("aria-selected", "true");
      mobileTabContent.classList.remove("active");
      mobileTabContent.setAttribute("aria-selected", "false");
      if (contentTabWrap) contentTabWrap.classList.add("is-mobile-hidden");
      if (reviewSection) reviewSection.classList.add("is-mobile-active");
    }
  }

  if (mobileTabContent) {
    // 탭 본체 클릭 (화살표 제외)
    mobileTabContent.addEventListener("click", function (e) {
      var prev = e.target.closest(".mobile-tab-prev");
      var next = e.target.closest(".mobile-tab-next");

      if (prev) {
        // 이전 패널
        currentPanelIndex = (currentPanelIndex - 1 + contentPanelNames.length) % contentPanelNames.length;
        updateMobileContentLabel();
        switchMobileTab("content");
        e.stopPropagation();
      } else if (next) {
        // 다음 패널
        currentPanelIndex = (currentPanelIndex + 1) % contentPanelNames.length;
        updateMobileContentLabel();
        switchMobileTab("content");
        e.stopPropagation();
      } else {
        switchMobileTab("content");
      }
    });
  }

  if (mobileTabReview) {
    mobileTabReview.addEventListener("click", function () {
      switchMobileTab("review");
    });
  }

  // 초기 레이블 설정
  updateMobileContentLabel();
})();
