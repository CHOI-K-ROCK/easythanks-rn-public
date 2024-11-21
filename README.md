## 이지땡스

개인 프로젝트로 진행한 **감사일기 작성 서비스** 입니다.

현재 앱스토어에 배포되어 있으며, 플레이스토어는 비공개 테스트 단계에 있습니다.

📎[앱스토어](https://apps.apple.com/kr/app/%EC%9D%B4%EC%A7%80%EB%95%A1%EC%8A%A4/id6714472200)

### 사용 기술

`React-Native`, `TypeScript`, `Recoil`, `Supabase`

### 주요 기능 및 구현 사항

- `Supabase` 를 이용한 RDB 구축 및 Oauth 연동, 게시글 및 사진 CRUD 구현
- 중복된 로직을 분리하여 사용하기 위한 `Custom Hooks` 사용
- `reanimated` 를 이용한 애니메이션 구현
- iOS/Android 환경에서 동일한 경험을 제공하기 위해 자체 `Toast`, `Modal`, `Switch`, `Checkbox` 컴포넌트 구현

### 스케줄 알람 시스템

- 일기를 쓰고자하는 시간에 알림을 주는 기능 구현
- FCM 과 연동하여 Foreground 및 Background 알림 구현

### 전역 오버레이 시스템

- `Modal`, `BottomSheet` 와 같이 화면 전체를 덮는 UI를 통합으로 관리하는 구조 구현
- `Recoil`을 활용하여 오버레이 컴포넌트를 전달하여 전역으로 관리
- 단일 Presenter 컴포넌트에서 오버레이 컴포넌트의 렌더링을 관리
- `Custom Hook` 을 이용하여 오버레이 컴포넌트 전달 및 Open / Close 메소드 제공
- 렌더링에 필요한 상태 및 관련 코드들을 간편하게 관리 할 수 있게 되어 개발 편의성 향상

### 자체 토스트 메시지 시스템

- `Recoil`을 활용하여 토스트 메시지 큐를 전역으로 관리
- `reanimated`를 활용한 부드러운 토스트 애니메이션 및 다중 토스트 표시 시 포지션을 이용한 스택 애니메이션 구현
- `Custom Hook`을 이용하여 Toast 표시 로직 추상화

### 기기 권한 관리 시스템

- `Context API`를 활용하여 앱 전반의 권한 관리 시스템을 설계 및 구현
- iOS/Android 플랫폼 별 권한 처리 분기처리
- `Custom Hook` 을 이용하여 권한 체크 및 요청 로직 추상화
- 권한 거부 후 관련 기능 재접근 시 모달을 이용하여 설정 스크린으로 유도하여 사용자의 편의성 향상
