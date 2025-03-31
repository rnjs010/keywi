import { Cookies } from 'react-cookie'

const cookies = new Cookies()

// 쿠키 설정
export const setCookie = (name: string, value: string, options?: any) => {
  return cookies.set(name, value, { ...options })
}

// 쿠키 가져오기
export const getCookie = (name: string) => {
  return cookies.get(name)
}

// 쿠키 삭제
export const removeCookie = (name: string) => {
  return cookies.remove(name, { path: '/' })
}
