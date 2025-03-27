import { usePayStore } from '@/stores/payStore'
import { SetStateAction, useState } from 'react'
import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { BsAsterisk } from 'react-icons/bs'
import MainButton from '@/components/MainButton'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden px-4
`

const InfoBox = tw.div`
  w-full p-6 rounded-md mb-2 bg-[#CCE6C9] bg-opacity-30
`

const BankInfo = tw.div`
  flex items-center gap-2 mb-4
`

const ExBox = tw.div`
  w-10 h-10 flex items-center justify-center  rounded-lg  bg-white
`

const OtpContainer = tw.div`
  w-full flex justify-center my-6
`

export default function AuthAccount() {
  const bank = usePayStore((state) => state.bank)
  const setStep = usePayStore((state) => state.setStep)

  const [authCode, setAuthCode] = useState('')

  const handleNext = () => {
    if (authCode.length === 4) {
      setStep(4)
    }
  }

  const handleOtpChange = (value: string) => {
    setAuthCode(value)
  }

  return (
    <Container>
      {/* SECTION - 1원 인증 설명 */}
      <div className="text-center leading-5 mb-2">
        <Text variant="caption1" weight="regular" color="gray">
          계좌 거래내역에서 입금된 1원의 입금자명을 확인 후<br />
          키위 뒤 4자리 숫자를 입력해 주세요
        </Text>
      </div>

      {/* SECTION - 상세 예시 */}
      <InfoBox>
        <BankInfo>
          <img src={`/banks/${bank}.png`} alt={bank} className="w-6 h-6" />
          <Text variant="body1" weight="bold">
            {bank}
          </Text>
        </BankInfo>
        <div className="flex items-center gap-2">
          <Text variant="body1" weight="bold" color="black">
            키위
          </Text>
          <div className="flex flex-row gap-1 grow">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <ExBox key={index}>
                  <BsAsterisk size={`1rem`} />
                </ExBox>
              ))}
          </div>
          <Text variant="body1" weight="regular" color="darkGray">
            입금 1원
          </Text>
        </div>
      </InfoBox>

      {/* SECTION - 인증코드 입력 */}
      <OtpContainer>
        <InputOTP
          maxLength={4}
          value={authCode}
          onChange={handleOtpChange}
          containerClassName="gap-4"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </OtpContainer>

      {/* SECTION - 버튼 */}
      <div className="mt-auto mb-12">
        <MainButton
          text="인증하기"
          onClick={handleNext}
          disabled={authCode.length !== 4}
        ></MainButton>
      </div>
    </Container>
  )
}
