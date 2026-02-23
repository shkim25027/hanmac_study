/**
 * 비즈트렌드 달력 페이지 전용 스크립트
 * ===================================
 * biztrend.html (성공예감&별책부록)에서 사용합니다.
 * - 연·월 선택 날짜피커 (휠 UI)
 * - 미래 날짜 카드 투명도 처리
 */

(function () {
  "use strict";

  // ------------------------------
  // 설정 상수
  // ------------------------------
  var YEAR_START = 2020;
  var YEAR_END = 2030;
  var ITEM_HEIGHT = 36; // 휠 한 항목 높이(px)

  // ------------------------------
  // 날짜 값 읽기/쓰기
  // ------------------------------

  /**
   * hidden input에서 현재 선택된 연·월 값을 읽습니다.
   * @returns {{ year: number, month: number }}
   */
  function getDateValue() {
    var input = document.querySelector(".biztrend .date-select-value");
    if (!input) return { year: 2026, month: 2 };

    var match = (input.value || "").match(/^(\d{4})-(\d{2})$/);
    if (match) {
      return {
        year: parseInt(match[1], 10),
        month: parseInt(match[2], 10),
      };
    }

    var now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    };
  }

  /**
   * hidden input과 화면 라벨에 연·월 값을 반영합니다.
   */
  function setDateValue(year, month) {
    var input = document.querySelector(".biztrend .date-select-value");
    var label = document.querySelector(".biztrend .date-select-label");

    if (input) {
      input.value = year + "-" + String(month).padStart(2, "0");
    }
    if (label) {
      var yearEl = label.querySelector(".date-select-year");
      var monthEl = label.querySelector(".date-select-month");
      if (yearEl) yearEl.textContent = year;
      if (monthEl) monthEl.textContent = month;
    }
  }

  // ------------------------------
  // 미래 날짜 카드 스타일 처리
  // ------------------------------

  /**
   * 선택한 달 기준으로 아직 오지 않은 날짜의 카드에 is-future 클래스를 적용합니다.
   */
  function applyFutureDateOpacity() {
    var cards = document.querySelectorAll(".biztrend .article-card");
    if (!cards.length) return;

    var selected = getDateValue();
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    cards.forEach(function (card) {
      card.classList.remove("is-future");

      var numEl = card.querySelector(".article-card-num");
      if (!numEl) return;

      var day = parseInt(numEl.textContent.trim(), 10);
      if (isNaN(day) || day < 1 || day > 31) return;

      var cardDate = new Date(selected.year, selected.month - 1, day);
      cardDate.setHours(0, 0, 0, 0);

      if (cardDate > today) {
        card.classList.add("is-future");
      }
    });
  }

  /**
   * 선택한 달이 현재 달과 같을 때, 오늘 날짜 카드에 today 클래스를 적용합니다.
   */
  function applyTodayClass() {
    var cards = document.querySelectorAll(".biztrend .article-card");
    if (!cards.length) return;

    var selected = getDateValue();
    var now = new Date();
    var currentYear = now.getFullYear();
    var currentMonth = now.getMonth() + 1;
    var currentDay = now.getDate();

    cards.forEach(function (card) {
      card.classList.remove("today");

      if (selected.year !== currentYear || selected.month !== currentMonth) return;

      var numEl = card.querySelector(".article-card-num");
      if (!numEl) return;

      var day = parseInt(numEl.textContent.trim(), 10);
      if (isNaN(day) || day < 1 || day > 31) return;

      if (day === currentDay) {
        card.classList.add("today");
      }
    });
  }

  // ------------------------------
  // 날짜피커 휠 (연·월)
  // ------------------------------

  /**
   * 연도·월 선택용 휠 항목 데이터를 생성합니다.
   */
  function buildWheelItems() {
    var years = [];
    for (var y = YEAR_START; y <= YEAR_END; y++) {
      years.push({ value: y, label: y + "년" });
    }
    var months = [];
    for (var m = 1; m <= 12; m++) {
      months.push({ value: m, label: m + "월" });
    }
    return { years: years, months: months };
  }

  /**
   * 휠에 항목을 렌더링하고 선택값 위치로 스크롤합니다.
   */
  function renderWheel(trackEl, items, selectedValue) {
    var idx = items.findIndex(function (i) {
      return i.value === selectedValue;
    });
    if (idx < 0) idx = 0;

    var html = items
      .map(function (item, i) {
        var isSelected = i === idx ? " is-selected" : "";
        return (
          '<div class="datepicker-wheel-item' +
          isSelected +
          '" data-value="' +
          item.value +
          '">' +
          item.label +
          "</div>"
        );
      })
      .join("");

    trackEl.innerHTML = html;
    trackEl.scrollTop = idx * ITEM_HEIGHT;
  }

  /**
   * 휠 스크롤 위치에서 현재 선택된 값을 반환합니다.
   */
  function getSelectedFromWheel(trackEl) {
    var idx = Math.round(trackEl.scrollTop / ITEM_HEIGHT);
    var items = trackEl.querySelectorAll(".datepicker-wheel-item");
    idx = Math.max(0, Math.min(idx, items.length - 1));
    var item = items[idx];
    return item ? parseInt(item.dataset.value, 10) : null;
  }

  /**
   * 특정 값으로 휠을 스크롤하고 is-selected 클래스를 갱신합니다.
   */
  function scrollToSelected(trackEl, value) {
    var item = trackEl.querySelector(
      '.datepicker-wheel-item[data-value="' + value + '"]'
    );
    if (!item) return;

    var allItems = trackEl.querySelectorAll(".datepicker-wheel-item");
    var idx = Array.from(allItems).indexOf(item);
    if (idx < 0) return;

    trackEl.scrollTop = idx * ITEM_HEIGHT;
    allItems.forEach(function (el) {
      el.classList.toggle(
        "is-selected",
        parseInt(el.dataset.value, 10) === value
      );
    });
  }

  // ------------------------------
  // 날짜피커 드롭다운 초기화
  // ------------------------------

  /**
   * 연·월 선택 버튼과 드롭다운을 연결하고 이벤트를 등록합니다.
   */
  function initDatepickerDropdown() {
    var trigger = document.getElementById("datepicker-trigger");
    var dropdown = document.getElementById("datepicker-dropdown");
    if (!trigger || !dropdown) return;

    var yearTrack = dropdown.querySelector('[data-wheel="year"]');
    var monthTrack = dropdown.querySelector('[data-wheel="month"]');
    var items = buildWheelItems();

    function openDropdown() {
      var v = getDateValue();
      renderWheel(yearTrack, items.years, v.year);
      renderWheel(monthTrack, items.months, v.month);

      dropdown.classList.add("is-open");
      dropdown.setAttribute("aria-hidden", "false");
      trigger.setAttribute("aria-expanded", "true");

      document.addEventListener("keydown", onEscape);
      setTimeout(function () {
        document.addEventListener("click", onDocumentClick);
      }, 0);
    }

    function closeDropdown() {
      dropdown.classList.remove("is-open");
      dropdown.setAttribute("aria-hidden", "true");
      trigger.setAttribute("aria-expanded", "false");

      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("click", onDocumentClick);
    }

    function onEscape(e) {
      if (e.key === "Escape") closeDropdown();
    }

    function onDocumentClick(e) {
      if (!dropdown.contains(e.target) && e.target !== trigger) {
        closeDropdown();
      }
    }

    function onConfirm() {
      var year = getSelectedFromWheel(yearTrack);
      var month = getSelectedFromWheel(monthTrack);
      if (year != null && month != null) {
        setDateValue(year, month);
        applyFutureDateOpacity();
        applyTodayClass();
      }
      closeDropdown();
    }

    // 버튼 클릭: 열기/닫기 토글
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      if (dropdown.classList.contains("is-open")) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    dropdown
      .querySelector(".btn-datepicker-cancel")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        closeDropdown();
      });

    dropdown
      .querySelector(".btn-datepicker-confirm")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        onConfirm();
      });

    // 휠 스크롤 시 선택 항목 표시 갱신
    function updateSelectedClass(trackEl) {
      var val = getSelectedFromWheel(trackEl);
      if (val != null) {
        trackEl.querySelectorAll(".datepicker-wheel-item").forEach(function (el) {
          el.classList.toggle(
            "is-selected",
            parseInt(el.dataset.value, 10) === val
          );
        });
      }
    }
    yearTrack.addEventListener("scroll", function () {
      updateSelectedClass(yearTrack);
    });
    monthTrack.addEventListener("scroll", function () {
      updateSelectedClass(monthTrack);
    });

    // 휠 항목 클릭 시 해당 위치로 스크롤
    yearTrack.addEventListener("click", function (e) {
      var item = e.target.closest(".datepicker-wheel-item");
      if (item) {
        scrollToSelected(yearTrack, parseInt(item.dataset.value, 10));
      }
    });
    monthTrack.addEventListener("click", function (e) {
      var item = e.target.closest(".datepicker-wheel-item");
      if (item) {
        scrollToSelected(monthTrack, parseInt(item.dataset.value, 10));
      }
    });
  }

  // ------------------------------
  // 페이지 초기화
  // ------------------------------

  function initBiztrendCalendar() {
    if (!document.querySelector(".wrap.biztrend")) return;

    applyFutureDateOpacity();
    applyTodayClass();
    initDatepickerDropdown();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBiztrendCalendar);
  } else {
    initBiztrendCalendar();
  }
})();
