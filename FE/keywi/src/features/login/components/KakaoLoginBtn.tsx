import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Text } from '@/styles/typography'
import kakaoLogo from '@/assets/logo_kakao.svg'

const Button = styled.button`
  ${tw`
    w-full 
    py-3
    rounded-md 
    mb-1
    relative
    flex
    items-center
    justify-center
    `}
  margin-top: 10rem;
  background-color: #fee500;
`
const Img = styled.img`
  ${tw`  
    w-5
    h-5 
    absolute
    left-4
  `}
`

export default function KakaoLoginBtn() {
  return (
    <Button>
      <Img src={kakaoLogo} alt="kakao-logo" />
      <Text variant="body1" weight="bold" color="black">
        카카오로 시작하기
      </Text>
    </Button>
  )
}
