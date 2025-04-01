//SECTION - 뒤로가기 있는 소제목 헤더
import { Text } from '@/styles/typography'
import { NavArrowLeft } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'
import tw from 'twin.macro'

const HeaderContainer = tw.div`
  flex
  px-6
  py-4
  z-10
  items-center
  relative
`

const BackButton = tw.button`
  absolute
  left-4
`

const TitleContainer = tw.div`
  flex-1
  flex
  justify-center
`

interface DetailHeaderProps {
  title: string
}

export default function DetailHeader({ title }: DetailHeaderProps) {
  const navigate = useNavigate()

  // 뒤로가기
  const handleBack = () => navigate(-1)

  return (
    <HeaderContainer>
      <BackButton onClick={handleBack}>
        <NavArrowLeft height={24} width={24} strokeWidth={2} />
      </BackButton>
      <TitleContainer>
        <Text variant="body2" weight="bold">
          {title}
        </Text>
      </TitleContainer>
    </HeaderContainer>
  )
}
