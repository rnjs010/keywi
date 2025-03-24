import { KAKAO_AUTH_URL } from '@/config'

export function useKakaoLogin() {
  const link: string = KAKAO_AUTH_URL
  const handleKakaoLogin = () => {
    window.location.href = link
  }

  return { handleKakaoLogin }
}
