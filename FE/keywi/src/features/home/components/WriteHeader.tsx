import { Text } from '@/styles/typography'
import { NavArrowLeft } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'
import tw from 'twin.macro'

const HeaderContainer = tw.div`
  flex
  z-10
  items-center
  relative
  h-14
`

const BackButton = tw.button`
  absolute
  left-4
  z-10
`

const TitleContainer = tw.div`
  absolute
  left-0
  right-0
  flex
  justify-center
  w-full
  z-0
`

const NextButton = tw.button`
  absolute
  right-4
  z-10
`

interface WriteHeaderProps {
  title: string
  isNextEnabled?: boolean
  onNextClick?: () => void
}

export default function WriteHeader({
  title,
  isNextEnabled = false,
  onNextClick,
}: WriteHeaderProps) {
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
      <NextButton
        onClick={isNextEnabled ? onNextClick : undefined}
        disabled={!isNextEnabled}
        className={!isNextEnabled ? 'opacity-50' : ''}
      >
        <Text
          variant="body2"
          weight="bold"
          color={isNextEnabled ? 'kiwi' : 'gray'}
        >
          다음
        </Text>
      </NextButton>
    </HeaderContainer>
  )
}
