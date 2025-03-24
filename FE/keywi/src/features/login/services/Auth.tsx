import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const params = new URL(document.location.toString()).searchParams
    const code = params.get('code') // 인가코드 url에서 뽑아내기
  }, [])

  // 뒤에 axios로 인가코드 보내기
  // 처리되면 /로 네비게이트
}

export default Auth
