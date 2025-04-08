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
  onBack?: () => void // 커스텀 뒤로가기 핸들러
  // ... 다른 props
}

export default function DetailHeader({ title, onBack }: DetailHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      // 커스텀 핸들러가 있으면 실행
      onBack()
    } else {
      // 기본 동작은 그냥 뒤로가기
      navigate(-1)
    }
  }

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
