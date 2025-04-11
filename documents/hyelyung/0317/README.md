# 피그마 UI 작성 완료

![Image](https://github.com/user-attachments/assets/e201273e-4e79-4ca8-8bd8-02120af8916e)

# 폴더 구조 설계 완료

```
keywi
├── public
│   ├── index.html
│   ├── favicon.ico
│   └── images/
├── src
│   ├── assets          # 이미지 등 정적 자산
│   ├── components      # 공통으로 재사용 가능한 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
|   |   ├── Header.tsx
│   │   └── Navbar.tsx
│   ├── features        # 기능별로 구분된 컴포넌트 및 로직 (도메인 기반 구조)
│   │   ├── login/      # pages 명 참고
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   ├── home/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   └── mypage/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── services/ 
│   ├── pages           # 라우팅 기반 페이지 컴포넌트
|   |   ├── login
|   |   ├── home
|   |   ├── mypage
|   |   ├── board
|   |   ├── product
|   |   ├── chat
|   |   ├── search
|   |   └── pay
│   ├── layouts         # 페이지 레이아웃 컴포넌트
|   |   ├── MainLayout.tsx # 홈의 메인 레이아웃 (Header, Navbar)
│   │   ├── SubLayout.tsx  # 다른 페이지 이동시 첫 레이아웃 (소제목 and 찜,북마크,알림)
│   │   └── DetailLayout.tsx  # 꺽쇄 or 닫기 타이틀 있는 레이아웃
│   ├── hooks           # 공통으로 사용되는 커스텀 훅들 (useFetch, useAuth 등)
│   │   ├── useFetch.ts
│   │   └── useAuth.ts
│   ├── services        # API 요청 및 외부 서비스 통합 로직
│   │   └── apiService.ts
│   ├── store           # Zustand 상태 관리 스토어 정의
│   │   └── useAppStore.ts
│   ├── styles          # 전역 스타일 및 Styled Components 관련 설정 파일들
│   │   └── GlobalStyles.tsx
│   ├── types           # TypeScript 타입 선언 파일들 (interface, type 등)
│   │   └── index.d.ts
│   ├── utils           # 유틸리티 함수 및 상수 정의 (formatting, validation 등)
│   │    └── helpers.ts
│   ├── App.tsx         # 앱의 최상위 컴포넌트
│   ├── main.tsx        # React 앱 진입점(entry point)
│   └── router.tsx      # 라우팅 설정 (React Router 등)
├── .gitignore
├── package.json
├── tsconfig.json       # TypeScript 설정 파일
├── vite.config.ts      # Vite 설정 파일(또는 webpack.config.js 등)
├── tailwind.config.js  # Tailwind CSS 설정 파일
└── .eslintrc.json      # ESLint 설정 파일
```

# 프로젝트 초기 세팅 관련 스터디

![Image](https://github.com/user-attachments/assets/68b5115f-c2ab-4b45-b411-0b4f2497e483)