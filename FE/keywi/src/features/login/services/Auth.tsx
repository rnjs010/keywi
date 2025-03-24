import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const params = new URL(document.location.toString()).searchParams
    const code = params.get('code') // 인가코드 url에서 뽑아내기
    console.log(code)
    // const GRANT_TYPE = 'authorization_code'
    // const data = {
    //   grant_type: GRANT_TYPE,
    //   client_id: KAKAO_CLIENT_ID,
    //   redirect_uri: KAKAO_REDIRECT_URI,
    //   code: code,
    // }
    navigate('/login')
  }, [])
  //TODO - 백으로 axios로 인가코드 보내기
  // 처음 가입한 유저면 회원정보 입력, 아니면 로그인
}

export default Auth
