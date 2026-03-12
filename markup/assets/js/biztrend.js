/**
 * 비즈트렌드 달력 페이지 전용 스크립트
 * ===================================
 * biztrend.html (성공예감&별책부록)에서 사용합니다.
 * - 연·월 선택 날짜피커 (휠 UI)
 * - 현재 달 기준 동적 달력 그리드 생성
 * - 스크롤 바닥 감지 시 다음 달 자동 추가 (무한 스크롤)
 */

(function () {
  "use strict";

  // ------------------------------
  // 설정 상수
  // ------------------------------
  var YEAR_START = 2023;
  var YEAR_END = 2030;
  var ITEM_HEIGHT = 36; // 휠 한 항목 높이(px)

  // ------------------------------
  // 무한 스크롤 상태
  // ------------------------------
  var loadedMonths = []; // [{year, month}]
  var scrollObserver = null;  // 하단 무한 스크롤 (IntersectionObserver)
  var topObserver = null;     // 상단 무한 스크롤 (IntersectionObserver)
  var labelObserver = null;   // 라벨 업데이트

  // ------------------------------
  // 날짜 값 읽기/쓰기
  // ------------------------------

  function getDateValue() {
    var input = document.querySelector(".biztrend .date-select-value");
    if (!input) return { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };

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
  // 달력 그리드 동적 생성
  // ------------------------------

  /**
   * 해당 월의 총 일수를 반환합니다.
   */
  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  /**
   * 월의 날짜를 월~토 6열 기준 행 배열로 반환합니다.
   * 일요일은 제외하며, 빈 셀은 null로 채웁니다.
   * @returns {Array<Array<number|null>>}
   */
  function buildMonthRows(year, month) {
    var daysInMonth = getDaysInMonth(year, month);
    var rows = [];
    var currentRow = [];

    for (var d = 1; d <= daysInMonth; d++) {
      var jsDay = new Date(year, month - 1, d).getDay(); // 0=일, 1=월, ..., 6=토

      if (jsDay === 0) continue; // 일요일 제외

      // 월요일이면 새 행 시작 (이전 행이 있으면 6칸 채우고 저장)
      if (jsDay === 1 && currentRow.length > 0) {
        while (currentRow.length < 6) currentRow.push(null);
        rows.push(currentRow);
        currentRow = [];
      }

      // 1일이 월요일이 아닐 때 앞 빈 칸 추가
      if (d === 1 && jsDay !== 1) {
        var emptyCount = jsDay - 1; // 월=0, 화=1, ..., 토=5
        for (var i = 0; i < emptyCount; i++) {
          currentRow.push(null);
        }
      }

      currentRow.push(d);

      // 토요일이면 행 완료
      if (jsDay === 6) {
        rows.push(currentRow);
        currentRow = [];
      }
    }

    // 마지막 행 처리
    if (currentRow.length > 0) {
      while (currentRow.length < 6) currentRow.push(null);
      rows.push(currentRow);
    }

    return rows;
  }

  /**
   * 날짜 카드 HTML을 반환합니다.
   */
  function createCardHTML(day, year, month) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var cardDate = new Date(year, month - 1, day);
    cardDate.setHours(0, 0, 0, 0);

    var jsDay = new Date(year, month - 1, day).getDay();
    var isWeekend = jsDay === 6; // 토요일
    var isToday = cardDate.getTime() === today.getTime();
    var isFuture = cardDate > today;

    var classes = ["article-card"];
    if (isWeekend) classes.push("weekend");
    if (isToday) classes.push("today");
    if (isFuture) classes.push("is-future");

    return (
      '<article class="' + classes.join(" ") + '">' +
      '<span class="article-card-num" aria-hidden="true">' + day + "</span>" +
      "</article>"
    );
  }

  /**
   * 빈 셀 HTML을 반환합니다.
   */
  function createEmptyCardHTML() {
    return '<article class="article-card is-empty" aria-hidden="true"></article>';
  }

  /**
   * 월 구분선 HTML을 반환합니다.
   */
  function createMonthSeparatorHTML(year, month) {
    return (
      '<div class="article-grid-month-sep" data-year="' + year + '" data-month="' + month + '">' +
      '<span class="article-grid-month-label">' + year + "년 " + month + "월</span>" +
      "</div>"
    );
  }

  /**
   * 특정 월의 모든 행 HTML을 반환합니다.
   */
  function buildMonthHTML(year, month, addSeparator) {
    var rows = buildMonthRows(year, month);
    var html = addSeparator ? createMonthSeparatorHTML(year, month) : "";

    rows.forEach(function (row) {
      html += '<div class="article-grid-row">';
      row.forEach(function (day) {
        if (day === null) {
          html += createEmptyCardHTML();
        } else {
          html += createCardHTML(day, year, month);
        }
      });
      html += "</div>";
    });

    return html;
  }

  /**
   * 다음 연·월을 반환합니다.
   */
  function getNextMonth(year, month) {
    if (month === 12) return { year: year + 1, month: 1 };
    return { year: year, month: month + 1 };
  }

  /**
   * 이전 연·월을 반환합니다.
   */
  function getPrevMonth(year, month) {
    if (month === 1) return { year: year - 1, month: 12 };
    return { year: year, month: month - 1 };
  }

  /**
   * 그리드 상단에 특정 월을 추가합니다. (스크롤 위치 유지)
   */
  function prependMonth(year, month) {
    var gridBody = document.querySelector(".biztrend .article-grid-body");
    if (!gridBody) return;

    // 이미 로드된 월 체크
    var alreadyLoaded = loadedMonths.some(function (m) {
      return m.year === year && m.month === month;
    });
    if (alreadyLoaded) return;

    // YEAR_START 이전은 추가하지 않음
    if (year < YEAR_START || (year === YEAR_START && month < 1)) return;

    // 기존 첫 달 정보 (새 달 삽입 후 구분선 필요)
    var oldFirst = loadedMonths[0];
    loadedMonths.unshift({ year: year, month: month });

    // 삽입 전 스크롤 높이 저장
    var prevScrollY = window.scrollY;
    var prevScrollHeight = document.documentElement.scrollHeight;

    // 새 달 HTML(구분선 없음) + 기존 첫 달 구분선
    var html =
      buildMonthHTML(year, month, false) +
      createMonthSeparatorHTML(oldFirst.year, oldFirst.month);

    gridBody.insertAdjacentHTML("afterbegin", html);

    // 삽입된 높이만큼 스크롤 위치 보정 (화면 안 튀게)
    var addedHeight = document.documentElement.scrollHeight - prevScrollHeight;
    window.scrollTo(0, prevScrollY + addedHeight);

    // 새 구분선 라벨 옵저버 등록
    observeMonthSeparators();

    // 상단 센티넬을 맨 앞으로 복원 후 재관찰
    gridBody.insertAdjacentHTML(
      "afterbegin",
      '<div id="article-grid-sentinel-top" class="article-grid-sentinel-top"></div>'
    );
    if (topObserver) {
      var newTop = document.getElementById("article-grid-sentinel-top");
      if (newTop) topObserver.observe(newTop);
    }
  }

  /**
   * 그리드에 특정 월을 추가합니다.
   */
  function appendMonth(year, month) {
    var gridBody = document.querySelector(".biztrend .article-grid-body");
    if (!gridBody) return;

    // 이미 로드된 월 체크
    var alreadyLoaded = loadedMonths.some(function (m) {
      return m.year === year && m.month === month;
    });
    if (alreadyLoaded) return;

    loadedMonths.push({ year: year, month: month });

    var isFirst = loadedMonths.length === 1;
    var html = buildMonthHTML(year, month, !isFirst);

    // 센티넬 제거 → 콘텐츠 추가 → 센티넬 재추가
    var sentinel = document.getElementById("article-grid-sentinel");
    if (sentinel) sentinel.remove();

    gridBody.insertAdjacentHTML("beforeend", html);
    gridBody.insertAdjacentHTML(
      "beforeend",
      '<div id="article-grid-sentinel" class="article-grid-sentinel"></div>'
    );

    // 새로 추가된 센티넬 관찰
    if (scrollObserver) {
      var newSentinel = document.getElementById("article-grid-sentinel");
      if (newSentinel) scrollObserver.observe(newSentinel);
    }

    // 새로 추가된 월 구분선을 라벨 옵저버에 등록
    observeMonthSeparators();
  }

  /**
   * 그리드를 초기화하고 지정 월부터 렌더링합니다.
   */
  function renderCalendar(year, month) {
    var gridBody = document.querySelector(".biztrend .article-grid-body");
    if (!gridBody) return;

    // 기존 옵저버 해제
    if (scrollObserver) { scrollObserver.disconnect(); scrollObserver = null; }
    if (topObserver)    { topObserver.disconnect();    topObserver = null;    }

    // 라벨 옵저버 초기화
    initLabelObserver();

    // 상태 초기화
    loadedMonths = [];
    gridBody.innerHTML = "";

    // 첫 달 렌더링
    appendMonth(year, month);

    // 하단·상단 무한 스크롤 초기화
    initInfiniteScroll();
    initTopScroll();
  }

  // ------------------------------
  // 월 구분선 진입 시 라벨 업데이트 (IntersectionObserver)
  // ------------------------------

  /**
   * article-grid-month-sep가 뷰포트 상단 영역에 진입·이탈할 때 라벨을 갱신합니다.
   * - 진입(isIntersecting): 해당 월로 라벨 변경
   * - 이탈(위쪽으로 빠져나감): 이미 지나간 상태이므로 유지
   * - 이탈(아래쪽으로 빠져나감, 스크롤 업): 이전 달로 라벨 복원
   */
  function initLabelObserver() {
    if (labelObserver) labelObserver.disconnect();

    labelObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var year = parseInt(entry.target.dataset.year, 10);
          var month = parseInt(entry.target.dataset.month, 10);

          if (entry.isIntersecting) {
            // 구분선이 뷰포트 상단 영역에 진입 → 해당 월로 업데이트
            setDateValue(year, month);
          } else if (entry.boundingClientRect.top > 0) {
            // 구분선이 아래쪽으로 빠져나감 (위로 스크롤) → 이전 달로 복원
            var idx = loadedMonths.findIndex(function (m) {
              return m.year === year && m.month === month;
            });
            if (idx > 0) {
              var prev = loadedMonths[idx - 1];
              setDateValue(prev.year, prev.month);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px 0px 0px", // 구분선이 뷰포트에 진입하는 즉시 감지
        threshold: 0,
      }
    );
  }

  /**
   * 새로 추가된 월 구분선을 라벨 옵저버에 등록합니다.
   */
  function observeMonthSeparators() {
    if (!labelObserver) return;
    document.querySelectorAll(".biztrend .article-grid-month-sep").forEach(function (sep) {
      labelObserver.observe(sep);
    });
  }

  // ------------------------------
  // 무한 스크롤 (IntersectionObserver)
  // ------------------------------

  /** 하단: 다음 달 추가 */
  function initInfiniteScroll() {
    var sentinel = document.getElementById("article-grid-sentinel");
    if (!sentinel) return;

    scrollObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && loadedMonths.length > 0) {
            var last = loadedMonths[loadedMonths.length - 1];
            var next = getNextMonth(last.year, last.month);
            appendMonth(next.year, next.month);
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    scrollObserver.observe(sentinel);
  }

  /** 상단: 이전 달 추가 (IntersectionObserver — 로드 직후 즉시 발화는 setTimeout으로 방지) */
  function initTopScroll() {
    var gridBody = document.querySelector(".biztrend .article-grid-body");
    if (!gridBody) return;

    // 상단 센티넬 생성
    gridBody.insertAdjacentHTML(
      "afterbegin",
      '<div id="article-grid-sentinel-top" class="article-grid-sentinel-top"></div>'
    );

    if (topObserver) topObserver.disconnect();

    var ready = false; // 로드 직후 즉시 발화 방지 플래그

    topObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || !ready || loadedMonths.length === 0) return;
          var first = loadedMonths[0];
          var prev = getPrevMonth(first.year, first.month);
          if (prev.year < YEAR_START) return;
          prependMonth(prev.year, prev.month);
        });
      },
      { root: null, rootMargin: "200px 0px 0px 0px", threshold: 0 }
    );

    var topSentinel = document.getElementById("article-grid-sentinel-top");
    if (topSentinel) topObserver.observe(topSentinel);

    // 페이지가 안정화된 후 활성화 (로드 시 즉시 발화 방지)
    setTimeout(function () { ready = true; }, 300);
  }

  // ------------------------------
  // 날짜피커 휠 (연·월)
  // ------------------------------

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

  function getSelectedFromWheel(trackEl) {
    var idx = Math.round(trackEl.scrollTop / ITEM_HEIGHT);
    var items = trackEl.querySelectorAll(".datepicker-wheel-item");
    idx = Math.max(0, Math.min(idx, items.length - 1));
    var item = items[idx];
    return item ? parseInt(item.dataset.value, 10) : null;
  }

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
        renderCalendar(year, month); // 선택한 달로 그리드 재생성
      }
      closeDropdown();
    }

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

    // 현재 날짜로 날짜피커 라벨 초기화
    var now = new Date();
    var initYear = now.getFullYear();
    var initMonth = now.getMonth() + 1;
    setDateValue(initYear, initMonth);

    // 현재 달 기준 동적 그리드 렌더링
    renderCalendar(initYear, initMonth);

    // 위로 스크롤 시 이전 달 추가가 가능하도록 10px 내린 상태로 시작
    window.scrollTo(0, 10);

    initDatepickerDropdown();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBiztrendCalendar);
  } else {
    initBiztrendCalendar();
  }
})();
