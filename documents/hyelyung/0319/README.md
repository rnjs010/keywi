## 🟡 카카오 소셜 로그인

- REST API 방식으로 진행할 예정

- 로그인 진행되는 과정

  - 프론트단에서 유저가 카카오 창에서 로그인을 하면 인가코드를 받고
  - 그 인가코드를 백으로 보내기 그러면
  - accessToken 이랑 refreshToken 이 응답 옴

  ![image.png](https://file.notion.so/f/f/2a4c1533-623b-4615-a3b2-350db1e0024c/882cc506-8aae-4440-9188-3d21d6c0b166/image.png?table=block&id=1bbc09e2-99c6-80c1-b9c6-cf88a67ce178&spaceId=2a4c1533-623b-4615-a3b2-350db1e0024c&expirationTimestamp=1742414400000&signature=YK1qdcgho4_UDnd0eoR361QjKiCXvblpHQ7dHW7_PuY&downloadName=image.png)

## 1. 세팅

- env 파일 생성

  ```json
  # kakao login
  VITE_KAKAO_REST_API_KEY={REST API 앱키 발급받은거 등록}
  VITE_KAKAO_REDIRECT_URI={Redirect uri 입력}
  ```

- .gitignore에 등록

  ```json
  .env
  ```

- config.js 에 환경변수들 넣기

  ```jsx
  export const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_REST_API_KEY;
  export const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}`;
  ```

- 만약 유저가 동의하고 계속하기 하고 로그인 진행하면 redirect url로 코드 확인 가능

  ```jsx
  HTTP/1.1 302
  Content-Length: 0
  Location: ${REDIRECT_URI}?code=${AUTHORIZE_CODE}
  ```

- url 에서 인가코드(AUTHORIZE_CODE) 가져오기

  ```jsx
  const params = new URL(document.location.toString()).searchParams;
  const code = params.get("code"); // 인가코드
  ```

- 백에 API 명세서 따라서 인가 코드 보내기

## ⭐ 참고 링크

- 카카오 로그인 버튼 리소스
  https://developers.kakao.com/tool/resource/login
- 카카오 디자인 가이드
  https://developers.kakao.com/docs/latest/ko/kakaologin/design-guide
- https://nxxrxx.tistory.com/entry/Vite-React-Typescript-%EC%B9%B4%EC%B9%B4%EC%98%A4%EB%A1%9C%EA%B7%B8%EC%9D%B8-REST-API-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0
- https://developer.mozilla.org/ko/docs/Web/API/URL/searchParams
