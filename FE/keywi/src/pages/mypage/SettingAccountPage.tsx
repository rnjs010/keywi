import DetailHeader from '@/components/DetailHeader'
import LoadingMessage from '@/components/message/LoadingMessage'
import { useMyAccountInfo } from '@/features/mypage/hooks/useMypageProfile'
import { colors } from '@/styles/colors'
import { Text } from '@/styles/typography'
import { getBankLogoPath, getBankName } from '@/utils/bankCodeMapper'
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
  const { data: accountInfo, isLoading, error } = useMyAccountInfo()

  return (
    <Container>
      <HeaderWrapper>
        <DetailHeader title="계좌 관리" />
      </HeaderWrapper>
      <ContentContainer>
        {isLoading ? (
          <LoadingMessage />
        ) : error || !accountInfo ? null : accountInfo?.accountNo &&
          accountInfo?.bankCode ? (
          <AccountWrapper>
            <div className="flex items-center gap-3">
              <BankLogo
                src={getBankLogoPath(accountInfo.bankCode)}
                alt={getBankName(accountInfo.bankCode)}
              />
              <Text variant="body1">
                {getBankName(accountInfo.bankCode)} {accountInfo.accountNo}
              </Text>
            </div>
            <ChangeAccountBtn>
              <Text variant="caption3" weight="bold" color="darkKiwi">
                계좌 변경
              </Text>
            </ChangeAccountBtn>
          </AccountWrapper>
        ) : null}

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
