# SCSS 스타일 가이드

> 초보자도 쉽게 이해하고 수정할 수 있도록 정리한 SCSS 구조 안내 문서입니다.

---

## 📁 폴더 구조

```
scss/
├── style.scss              ← 메인 진입점 (컴파일 대상)
├── _base.scss              ← 공통 모듈 로드 (mixin, 변수, 공통 컴포넌트 등)
├── _layout.scss            ← 공통 레이아웃
├── _card.scss              ← 카드 컴포넌트
├── _learning.scss          ← 학습 페이지
├── _search.scss            ← 검색결과 페이지
├── _insight.scss           ← 인사이트 페이지
├── _biztrend.scss          ← biztrend 페이지
├── import/                 ← 공통으로 쓰이는 하위 모듈
│   ├── _mixin.scss         ← flex, grid, ellipsis 등 유틸 mixin
│   ├── _common-components.scss  ← 페이지 공통 UI mixin (page-header, breadcrumb 등)
│   ├── _variables.scss     ← 색상, 브레이크포인트 변수
│   ├── _reset-css.scss     ← CSS 리셋
│   └── ...
└── SCSS_GUIDE.md           ← 이 문서
```

---

## 🔄 스타일 로드 흐름

```
style.scss
  └── @use "base"
        ├── mixin (flex, ellipsis, mq 등)
        ├── common-components (page-header, breadcrumb, select-sort, video-card-grid)
        ├── 변수, 리셋, 애니메이션
  └── @forward "_layout", "_card", "_learning", "_search", "_insight", "_biztrend"
```

모든 페이지용 SCSS 파일(`_search.scss`, `_insight.scss` 등)은 맨 위에 `@use "base" as *;`를 사용합니다.  
이렇게 하면 **mixin**, **변수**, **공통 컴포넌트**를 바로 사용할 수 있습니다.

---

## 🧩 공통 컴포넌트 Mixin 사용법

여러 페이지에서 반복되는 UI는 `import/_common-components.scss`에 mixin으로 정의되어 있습니다.

### 1. page-header (페이지 상단 헤더)

```scss
.page-header {
  @include page-header;
}
```

- **용도**: 페이지 상단 공통 헤더 (max-width, padding, 제목 스타일 등)
- **사용 페이지**: insight, biztrend, search

---

### 2. breadcrumb (브레드크럼)

```scss
.breadcrumb {
  @include breadcrumb;
}
```

- **용도**: `홈 > 상위메뉴 > 현재페이지` 형식 경로 표시
- **사용 페이지**: insight, biztrend

---

### 3. select-sort (정렬 셀렉트 박스)

```scss
.section-header {
  @include select-sort(20px);  // 폰트 크기 (기본 14px)
}
```

- **용도**: 드롭다운 정렬 UI
- **필수 HTML 구조**: `.list-options` > `.select-wrap` > `.select-sort`
- **사용 페이지**: insight, search

---

### 4. gauge-bar (진행률 게이지)

```scss
.부모영역 {
  @include gauge-bar;
}
```

- **용도**: 진행률 표시 바 (비디오 썸네일, 기사 카드 등)
- **필수 HTML**  
  - 라운드형(기본): `<div class="gauge-bar"><div class="gauge-fill" style="width: 60%"></div></div>`  
  - rect형: `<div class="gauge-bar gauge-bar--rect"><div class="gauge-fill" style="width: 60%"></div></div>`
- **주의**: 부모 요소에 `position: relative` 필요
- **사용 페이지**: _card (비디오 카드), biztrend (기사 카드)

---

### 5. video-card-grid (비디오 카드 그리드)

```scss
.content-section {
  @include video-card-grid(
    4,      // 열 개수
    24px,   // 열 간격
    56px,   // 행 간격
    20px    // 제목 폰트 크기
  );
}
```

- **용도**: 비디오/콘텐츠 카드 목록 (썸네일, 제목, 좋아요 버튼 등)
- **필수 HTML 구조**: `.video-grid` > `.video-item` (안에 `.card-link`, `.item-thumb`, `.item-info` 등)
- **사용 페이지**: insight, search

페이지별로 열 개수·간격·제목 크기를 다르게 쓰고 싶으면 위 인자를 조정하면 됩니다.

---

## 🛠 자주 쓰는 Mixin (`import/_mixin.scss`)

| Mixin | 사용 예 | 설명 |
|-------|---------|------|
| `flex` | `@include flex(row, center, center);` | Flexbox 레이아웃 |
| `grid` | `@include grid(4, 24px);` | Grid 레이아웃 |
| `ellipsis` | `@include ellipsis(2);` | 텍스트 2줄 말줄임 |
| `bgImg` | `@include bgImg("../images/ico.svg", contain, center);` | 배경 이미지 |
| `mq` | `@include mq("tablet", max) { ... }` | 반응형 미디어 쿼리 |

---

## ✏️ 새 페이지 스타일 추가하기

1. **새 파일 생성**: `_새페이지.scss` 생성
2. **기본 설정**:
   ```scss
   @charset "UTF-8";
   @use "base" as *;

   // =======================================
   // 새페이지
   // =======================================
   .새페이지클래스 {
     // 필요한 공통 컴포넌트 사용
     .page-header { @include page-header; }
   }
   ```
3. **style.scss에 등록**:
   ```scss
   @forward "_새페이지";
   ```

---

## 📌 페이지별 공통 컴포넌트 사용 현황

| 페이지 | page-header | breadcrumb | select-sort | video-card-grid | gauge-bar |
|--------|:-----------:|:----------:|:-----------:|:----------------:|:---------:|
| insight | ✓ | ✓ | ✓ | ✓ | - |
| biztrend | ✓ | ✓ | - | - | ✓ |
| search | ✓ | - | ✓ | ✓ | - |
| _card | - | - | - | - | ✓ |

각 페이지 파일 상단에 `// 공통 컴포넌트: ...` 주석으로 사용 중인 mixin을 적어 두었습니다.

---

## ⚠️ 주의사항

- **공통 스타일 수정**: `import/_common-components.scss`를 수정하면 해당 mixin을 쓰는 모든 페이지에 반영됩니다.
- **페이지 전용 수정**: 해당 페이지 SCSS 파일(예: `_insight.scss`)에서 공통 mixin 호출 아래에 추가 스타일을 작성합니다.
- **변수 사용**: 색상·브레이크포인트 등은 `_variables.scss`, `_root.scss`에 정의되어 있습니다.
