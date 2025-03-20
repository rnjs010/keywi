/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_REST_API_KEY: string
  readonly VITE_KAKAO_REDIRECT_URI: string
  // 추가적인 환경 변수가 있다면 여기에 더 선언하기
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
