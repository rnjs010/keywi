import MainButton from '@/components/MainButton'
import { usePayStore } from '@/stores/payStore'
import { useState } from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Text } from '@/styles/typography'
import { CheckCircle, CheckCircleSolid, NavArrowDown } from 'iconoir-react'
import BankModal from './BankModal'
import { colors } from '@/styles/colors'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden px-4
`

const Form = tw.div`
  py-2 flex-1 
`

const SearchInput = tw.input`
  w-full border px-4 py-3 rounded mb-2 text-base
  focus:outline-none
  [caret-color: #70C400]
  [border-color:var(--border-color)]
`

const InputBox = styled.div<{ isSelected: boolean }>`
  ${tw`w-full border px-4 py-3 rounded mb-2 flex items-center justify-between`}
  ${({ isSelected }) =>
    isSelected ? tw`border-black text-black` : tw`border-gray text-gray`}
`

const BankInfo = tw.div`
  flex items-center gap-2
`

export default function InputAccount() {
  const setAccountInfo = usePayStore((state) => state.setAccountInfo)
  const setStep = usePayStore((state) => state.setStep)
  const [accountNumber, setAccountNumber] = useState('')
  const [bank, setBank] = useState('')
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [isAgreed, setIsAgreed] = useState(false)

  const handleNext = () => {
    if (accountNumber && bank) {
      setAccountInfo(accountNumber, bank)
      setStep(3)
    }
  }

  const handleOpenModal = () => {
    setOpenDrawer(true)
  }

  const handleSelectBank = (bank: string) => {
    setBank(bank)
    setOpenDrawer(false)
  }

  return (
    <Container>
      <Form>
        {/* SECTION - 계좌번호 입력 */}
        <SearchInput
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="계좌번호 입력"
          value={accountNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAccountNumber(e.target.value)
          }
        />
        {/* SECTION - 은행/증권사 선택 */}
        <BankModal
          isOpen={openDrawer}
          onOpenChange={(open) => {
            if (open) setOpenDrawer(true)
            else setOpenDrawer(false)
          }}
          trigger={
            <InputBox onClick={handleOpenModal} isSelected={!!bank}>
              {bank ? (
                <BankInfo>
                  <img
                    src={`/banks/${bank}.png`}
                    alt={bank}
                    className="w-6 h-6"
                  />
                  <Text variant="body1" weight="bold">
                    {bank}
                  </Text>
                </BankInfo>
              ) : (
                <Text variant="body1" weight="regular">
                  은행/증권사 선택
                </Text>
              )}
              <NavArrowDown />
            </InputBox>
          }
          onSelectBank={handleSelectBank}
        />

        {/* SECTION - 동의 */}
        <InputBox onClick={() => setIsAgreed(!isAgreed)} isSelected={isAgreed}>
          <Text variant="body1" weight="regular">
            (필수) 오픈뱅킹 출금이체 동의
          </Text>
          {isAgreed ? (
            <CheckCircleSolid color={colors.kiwi} />
          ) : (
            <CheckCircle />
          )}
        </InputBox>
      </Form>

      <div className="mt-auto mb-12">
        <MainButton
          text="계좌인증 요청"
          onClick={handleNext}
          disabled={!isAgreed || !accountNumber || !bank}
        ></MainButton>
      </div>
    </Container>
  )
}
