//SECTION - 마이페이지 Header
import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { Bell, Settings, Wallet } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'

const HeaderContainer = tw.div`
  flex justify-between items-center py-4 px-4
`

const IconContainer = tw.div`
  flex gap-4
`

export default function MypageHeader() {
  const navigate = useNavigate()
  const handleClick = (name: string) => {
    navigate(`/${name}`)
  }

  return (
    <HeaderContainer>
      <Text variant="title3" weight="bold" color="black">
        나의 키위
      </Text>
      <IconContainer>
        <Wallet onClick={() => handleClick('setting/account')} />
        <Bell onClick={() => handleClick('alarm')} />
        <Settings onClick={() => handleClick('setting')} />
      </IconContainer>
    </HeaderContainer>
  )
}
