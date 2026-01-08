# 공통 모듈 사용 가이드

이 디렉토리에는 프로젝트 전반에서 사용할 수 있는 공통 JavaScript 모듈들이 포함되어 있습니다.

## 📦 모듈 목록

1. **Utils.js** - 공통 유틸리티 함수 (딜레이, 디바운스, 쓰로틀, 스토리지 등)
2. **DOMUtils.js** - DOM 조작 유틸리티 (요소 선택, 생성, 애니메이션 등)
3. **AnimationUtils.js** - 애니메이션 효과 (페이드, 슬라이드, 카운팅 등)
4. **VideoBase.js** - 비디오 관련 기능 (YouTube URL 생성, iframe 생성 등)
5. **ModalBase.js** - 모달 관리 (기본 모달, 확인 모달, 알림 모달)
6. **ConfigManager.js** - 설정 관리 (중첩 설정, 로컬 스토리지 저장/로드)
7. **GaugeBase.js** - 게이지/진행률 표시 (원형, 선형 게이지)

## 🚀 사용 방법

### HTML에 스크립트 추가

```html
<!-- 공통 모듈 로드 (순서 중요) -->
<script src="./assets/js/common/Utils.js"></script>
<script src="./assets/js/common/DOMUtils.js"></script>
<script src="./assets/js/common/AnimationUtils.js"></script>
<script src="./assets/js/common/VideoBase.js"></script>
<script src="./assets/js/common/ModalBase.js"></script>
<script src="./assets/js/common/ConfigManager.js"></script>
<script src="./assets/js/common/GaugeBase.js"></script>

<!-- 프로젝트 스크립트 -->
<script src="./assets/js/common.js"></script>
<script src="./assets/js/main/VideoSlider.js"></script>
<script src="./assets/js/main/VideoCardRenderer.js"></script>
<script src="./assets/js/main/Videomodalmanager.js"></script>
```

## 📝 주요 개선 사항

### 1. common.js
- ✅ jQuery 의존성 제거
- ✅ DOMUtils, AnimationUtils 활용
- ✅ 이벤트 위임 패턴 적용
- ✅ async/await 사용

### 2. VideoSlider.js
- ✅ DOMUtils로 요소 선택
- ✅ AnimationUtils로 페이드 효과
- ✅ Utils.delay 제거 (직접 구현 대신)

### 3. VideoCardRenderer.js
- ✅ DOMUtils.createElement 사용
- ✅ AnimationUtils.sequentialAnimate 사용
- ✅ VideoBase로 썸네일 URL 생성

### 4. VideoModalManager.js
- ✅ VideoBase로 YouTube URL 생성
- ✅ DOMUtils로 DOM 조작
- ✅ AnimationUtils로 페이드 효과

## 💡 사용 예제

### DOM 조작
```javascript
// 요소 선택
const container = DOMUtils.$(".container");
const cards = DOMUtils.$$(".card");

// 요소 생성
const button = DOMUtils.createElement("button", {
  class: "btn",
  "data-id": "123"
}, "클릭");

// 페이드 효과
await DOMUtils.fadeIn(element, 300);
await DOMUtils.fadeOut(element, 300);
```

### 애니메이션
```javascript
// 순차적 애니메이션
const cards = DOMUtils.$$(".card");
await AnimationUtils.sequentialAnimate(cards, "show", 50);

// 페이드 애니메이션
await AnimationUtils.fade(element, "in", 300);
```

### 비디오
```javascript
// YouTube URL 생성
const url = VideoBase.getYouTubeUrl("VIDEO_ID", { autoplay: 1 });

// iframe 생성
const iframe = VideoBase.createIframe("VIDEO_ID", {
  width: "100%",
  height: "400px"
});

// VideoModel 사용
const video = new VideoModel({
  id: 1,
  url: "VIDEO_ID",
  title: "제목"
});
const thumbnail = video.getThumbnailUrl();
```

### 모달
```javascript
// 기본 모달
const modal = new ModalBase({
  closeOnEscape: true,
  closeOnBackdrop: true
});

modal.create({
  header: "<h2>제목</h2>",
  content: "<p>내용</p>"
});

await modal.open();
```

## 🔧 추가 개선 가능 영역

1. **GaugeChart.js** - GaugeBase 활용 (현재는 이미지 아이콘 버전이라 완전 교체는 어려울 수 있음)
2. **다른 모달 관련 파일들** - ModalBase 활용
3. **애니메이션 효과** - AnimationUtils 활용 확대

## 📚 참고

자세한 API 문서는 각 모듈 파일의 JSDoc 주석을 참고하세요.

