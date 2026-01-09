# 공통 모듈 사용 가이드

이 문서는 개선된 공통 모듈의 사용 방법을 설명합니다.

## 개선 사항 요약

1. **EventManager**: 이벤트 리스너 중앙 관리
2. **ErrorHandler**: 에러 처리 및 로깅 개선
3. **ScrollManager**: 스크롤 관리 클래스화
4. **ModalManager**: 모달 관리 클래스화
5. **DeviceUtils**: 기기 감지 유틸리티
6. **NavigationManager**: 네비게이션 관리
7. **HTMLIncludeManager**: HTML Include 관리
8. **ContainerScrollEffect**: 스크롤 효과 클래스
9. **DependencyInjector**: 의존성 주입 컨테이너

## 주요 사용 예제

### EventManager 사용

```javascript
// 이벤트 등록
const listenerId = eventManager.on(window, 'resize', () => {
  console.log('Window resized');
});

// 이벤트 위임
const delegateId = eventManager.delegate(document, 'click', '.button', function(e) {
  console.log('Button clicked');
});

// 이벤트 제거
eventManager.off(window, listenerId);
```

### ErrorHandler 사용

```javascript
// 안전한 함수 실행
const result = ErrorHandler.safeExecute(() => {
  return riskyOperation();
}, null, { context: 'MyComponent' });

// 에러 처리
ErrorHandler.handle(new Error('Error message'), {
  context: 'MyComponent'
}, true);
```

### ScrollManager 사용

```javascript
scrollManager.init();
scrollManager.lock();
scrollManager.unlock();
```

### ModalManager 사용

```javascript
await modalManager.open('#myModal');
await modalManager.close('#myModal');
```

## 기존 코드 호환성

기존 함수들은 모두 유지되므로 기존 코드는 그대로 작동합니다:

- `syncHeight()`
- `isMobile()`
- `bodyLock()` / `bodyUnlock()`
- `popOpen()` / `popClose()`
- `setActiveNavigation()`
- `includehtml()`
