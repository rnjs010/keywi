import { Text } from '@/styles/typography'
import { NavArrowLeft } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'
import tw from 'twin.macro'

const HeaderContainer = tw.div`
  flex
  z-10
  items-center
  relative
  h-[3.5rem]
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
  startTitle: string
  isNextEnabled?: boolean
  onNextClick?: () => void
  endTitle: string
}

export default function NextHeader({
  startTitle,
  isNextEnabled = false,
  onNextClick,
  endTitle,
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
          {startTitle}
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
          {endTitle}
        </Text>
      </NextButton>
    </HeaderContainer>
  )
}
