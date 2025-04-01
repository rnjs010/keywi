import DetailHeader from '@/components/DetailHeader'
import { colors } from '@/styles/colors'
import { Text } from '@/styles/typography'
import { PlusCircleSolid } from 'iconoir-react'
import tw from 'twin.macro'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen pb-4
`
const HeaderWrapper = tw.div`
  sticky top-0 z-10 bg-white w-full
`
const ContentContainer = tw.div`
  flex-1 overflow-auto px-4 pt-6
`
const AccountWrapper = tw.div`
  border border-littleGray rounded-lg flex items-center justify-between py-3 px-3 my-3
`
const BankLogo = tw.img`
  w-6 h-6
`
const ChangeAccountBtn = tw.button`
  bg-pay rounded-lg px-2 py-1 flex
`

export function SettingAccountPage() {
  return (
    <Container>
      <HeaderWrapper>
        <DetailHeader title="계좌 관리" />
      </HeaderWrapper>
      <ContentContainer>
        {/* TODO - 현재 계좌 연결 정보 연동 */}
        <AccountWrapper>
          <div className="flex items-center gap-3">
            <BankLogo src="/banks/우리.png"></BankLogo>
            <Text variant="body1">우리 1002039482304</Text>
          </div>
          <ChangeAccountBtn>
            <Text variant="caption3" weight="bold" color="darkKiwi">
              계좌 변경
            </Text>
          </ChangeAccountBtn>
        </AccountWrapper>
        <AccountWrapper>
          <div className="flex items-center gap-3">
            <PlusCircleSolid color={colors.kiwi} />
            <Text variant="body1" color="kiwi">
              계좌 추가하기
            </Text>
          </div>
        </AccountWrapper>
      </ContentContainer>
    </Container>
  )
}
