//kakao login
export const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_REST_API_KEY
export const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI
export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`

//base url
export const BASE_URL = import.meta.env.VITE_BASE_URL
