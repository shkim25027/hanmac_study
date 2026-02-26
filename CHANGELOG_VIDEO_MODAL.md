# 비디오 모달 댓글 패널 변경 사항

## 변경된 파일 목록

| 파일 | 변경 요약 |
|------|-----------|
| `markup/html/_modal/video-comment.html` | comment-backdrop 제거 |
| `markup/assets/js/common/VideoModalBase.js` | comment-backdrop 미사용, comment-resizer 닫기 버튼화, video-list 높이 PC 전용, PC 전환 시 재측정 및 리스너 정리 |
| `markup/assets/css/scss/common.scss` | comment-backdrop 제거, 모바일 comment 패널·닫기 버튼 스타일, 모바일 video-list 스크롤 정리 |

---
## 1. markup/assets/js/common/VideoModalBase.js

### 1-1. setupCommentToggle() (1024px 이하 댓글 패널 토글)
- 패널 열기/닫기는 modal의 `is-comment-open` 클래스만 토글
- **comment-resizer 클릭 시 패널 닫기** (닫기 버튼 역할)
- 모바일에서는 comment-wrap을 modal 직계 자식으로 이동 (transform 영향 제거)
- PC 전환 시 video-side로 되돌리고 인라인 스타일 제거
- `matchMedia` 리사이즈 이벤트로 화면 전환 감지

### 2-2. adjustVideoListHeight() (video-list 높이 측정)
- **PC(1025px 이상)에서만** 높이 측정 및 적용
- 모바일에서는 `height`, `overflow-y` 제거 후 조기 종료
- **setupHeightAdjustMediaQuery()** 추가: PC 전환 시 높이 재측정
- 모달 닫을 때 media query 리스너 제거 (`_heightAdjustMediaQueryCleanup`)

### 2-3. close() 메서드
- comment-toggle 리스너 정리 (`_commentToggleCleanup`)
- height-adjust media query 리스너 정리 (`_heightAdjustMediaQueryCleanup`)

---

## 3. markup/assets/css/scss/common.scss

### 3-1. 모바일 comment-wrap 바텀 시트 스타일
- comment-wrap: 1024px 이하에서 `position: fixed`, 하단 고정, 슬라이드업 애니메이션
- `.modal.is-comment-open` 시 `transform: translateY(0)`로 패널 표시
- **comment-backdrop 스타일 제거**

### 3-2. 모바일 comment-resizer (닫기 버튼)
- 높이 44px, `padding: 0 16px`
- 왼쪽: 그랩 핸들 바 (36×4px)
- 오른쪽: `×` 닫기 아이콘 (`::after`)
- 전체 영역 클릭 시 닫기 동작

### 3-3. 모바일 video-list
- `height: auto`, `overflow-y: visible`로 설정
- video-side가 스크롤 담당, video-list는 별도 스크롤 없음

### 3-4. .video-side 모바일
- `overflow-y: auto`로 전체 스크롤 담당

---

## 기능 요약

### 모바일 (1024px 이하)
- comment-wrap: 기본 숨김, btn-comment 클릭 시 하단에서 슬라이드업
- comment-resizer: 닫기 버튼 역할 (× 아이콘)
- video-side: 전체 스크롤 담당
- video-list: 강제 높이·overflow 없음 (자연 높이)

### PC (1025px 이상)
- comment-wrap: video-side 내부에 고정 표시
- video-list: 스크립트로 높이 측정 및 적용
- 화면 전환 시 높이 재측정
