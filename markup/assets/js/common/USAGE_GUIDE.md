# 공통 모듈 사용 가이드

> 초보자도 쉽게 사용할 수 있도록 정리한 가이드입니다.

## 📋 목차

1. [모듈 로딩 순서](#모듈-로딩-순서)
2. [초보자 권장 학습 순서](#초보자-권장-학습-순서)
3. [주요 모듈 사용법](#주요-모듈-사용법)
4. [기존 코드 호환성](#기존-코드-호환성)

---

## 모듈 로딩 순서

`_include/_head.html` 에서 아래 순서로 로드됩니다. **순서를 바꾸면 오류가 날 수 있습니다.**

| 순서 | 파일 | 의존성 | 설명 |
|:---:|------|--------|------|
| 1 | Utils.js | 없음 | 딜레이, 디바운스, 날짜/숫자 포맷 등 |
| 2 | DOMUtils.js | 없음 | DOM 선택, 페이드, 이벤트 위임 |
| 3 | ErrorHandler.js | 없음 | 에러 처리, 로깅 |
| 4 | EventManager.js | ErrorHandler | 이벤트 리스너 중앙 관리 |
| 5 | AnimationUtils.js | 없음 | 애니메이션 |
| 6 | VideoBase.js | 없음 | YouTube URL, 썸네일 |
| 7 | ModalBase.js | 없음 | 모달 생성/열기/닫기 |
| 8 | ModalUtils.js | 없음 | 모달 유틸 |
| 9 | VideoModalBase.js | 여러 | 비디오 모달 기본 |
| 10 | ConfigManager.js | 없음 | 설정 관리 |
| 11 | GaugeBase.js | 없음 | 게이지 차트 |
| 12 | **common.js** | **위 모든 모듈** | 공통 진입점, 전역 초기화 |

---

## 초보자 권장 학습 순서

1. **Utils.js** → 가장 단순, 복사·붙여넣기용 함수
2. **DOMUtils.js** → `$`, `$$`, `fadeIn`, `delegate` 위주로 익히기
3. **ModalBase.js** → 모달이 어떻게 동작하는지 이해
4. **common.js** → 전체 흐름 파악
5. **EventManager.js** → 이벤트 정리·메모리 관리
6. **VideoModalBase.js** → 고급 (나중에 학습)

---

## 주요 모듈 사용법

### Utils

```javascript
// 1초 대기 후 실행
await Utils.delay(1000);

// 검색창: 입력 멈춘 뒤 300ms 후 검색
const debouncedSearch = Utils.debounce(() => doSearch(), 300);

// 리사이즈: 100ms마다 1번만 실행
const throttledResize = Utils.throttle(() => onResize(), 100);

// 날짜 포맷
Utils.formatDate(new Date(), "YYYY.MM.DD");  // "2026.02.23"

// 로컬 스토리지
Utils.storage.set("key", { data: 1 });
Utils.storage.get("key");
```

### DOMUtils

```javascript
// 요소 선택 (jQuery처럼)
const el = DOMUtils.$(".my-class");
const all = DOMUtils.$$(".my-class");

// 페이드 인/아웃
await DOMUtils.fadeIn(document.getElementById("modal"), 300);
await DOMUtils.fadeOut(document.getElementById("modal"), 300);

// 이벤트 위임 (동적으로 추가된 버튼에도 동작)
DOMUtils.delegate(document, "click", ".btn-delete", function (e) {
  console.log("클릭된 버튼:", this);
});
```

### EventManager (eventManager)

```javascript
// 이벤트 등록 (리스너 ID 저장해두면 나중에 제거 가능)
const id = eventManager.on(window, "resize", () => console.log("리사이즈"));

// 이벤트 위임
const delegateId = eventManager.delegate(document, "click", ".button", handler);

// 제거
eventManager.off(window, id);
eventManager.undelegate(document, delegateId);
```

### ErrorHandler

```javascript
// 안전한 실행 (에러 나도 기본값 반환)
const result = ErrorHandler.safeExecute(() => riskyOp(), null, { context: "MyModule" });

// 에러 처리
ErrorHandler.handle(new Error("메시지"), { context: "MyModule" });
```

### common.js (전역)

```javascript
// 모달 열기/닫기
await popOpen("modal-video");   // id="modal-video" 열기
await popClose(closeButton);    // 닫기 버튼 클릭 시

// 스크롤 잠금 (모달 열 때)
bodyLock();
bodyUnlock();

// 뷰포트 높이 동기화
syncHeight();

// 모바일 여부
if (isMobile()) { ... }
```

---

## 기존 코드 호환성

아래 함수들은 **기존 코드를 위해 그대로 유지**됩니다.

| 함수 | 설명 |
|------|------|
| `syncHeight()` | 뷰포트 높이 동기화 |
| `isMobile()` | 모바일 여부 |
| `bodyLock()` / `bodyUnlock()` | 스크롤 잠금/해제 |
| `popOpen(id)` | 모달 열기 |
| `popClose(element)` | 모달 닫기 |
| `setActiveNavigation()` | 네비게이션 active 클래스 |
| `includehtml()` | HTML 동적 로드 |

---

## 파일명 참고

- `Videomodalmanager.js` : 파일명은 소문자 혼용이지만, 클래스명은 `VideoModalManager`입니다.
