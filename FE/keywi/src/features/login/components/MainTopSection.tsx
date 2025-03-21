import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Text } from '@/styles/typography'
import keywiLogo from '@/assets/logo_keywi.svg'

const TopSection = styled.div`
  ${tw`
    flex
    flex-col
    items-center
    justify-center
    mt-10
  `}
  margin-top: min(25vh, 10rem);
`

const LogoImage = styled.img`
  ${tw`
  w-48
  mr-2
  mb-10
`}
`

const Description = styled.div`
  ${tw`
    text-center
    mt-6
    mb-10
  `}
`

export default function LoginTopSection() {
  return (
    <TopSection>
      <LogoImage src={keywiLogo} alt="kiwi-logo" />
      <Description>
        <Text variant="body1" weight="bold" color="darkKiwi">
          키보드 조립부터 자랑까지,
        </Text>
        <br />
        <Text variant="body1" weight="bold" color="darkKiwi">
          지금 커스텀 키보드를 만들어보세요!
        </Text>
      </Description>
    </TopSection>
  )
}
