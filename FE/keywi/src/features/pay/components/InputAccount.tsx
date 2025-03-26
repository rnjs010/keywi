import MainButton from '@/components/MainButton'
import { usePayStore } from '@/stores/payStore'
import { useState } from 'react'
import tw from 'twin.macro'
import { CheckCircle, CheckCircleSolid, NavArrowDown } from 'iconoir-react'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden px-4
`

const Form = tw.div`
  py-2 flex-1 
`

export default function InputAccount() {
  const setAccountInfo = usePayStore((state) => state.setAccountInfo)
  const setStep = usePayStore((state) => state.setStep)

  const [accountNumber, setAccountNumber] = useState('')
  const [bank, setBank] = useState('')

  const handleNext = () => {
    if (accountNumber && bank) {
      setAccountInfo(accountNumber, bank)
      setStep(3)
    }
  }

  return (
    <Container>
      <Form>
        <input
          type="text"
          placeholder="계좌번호 입력"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="w-full border px-4 py-3 rounded mb-2"
        />
        <div className="w-full border px-4 py-3 rounded mb-2 flex justify-between">
          은행/증권사 선택
          <NavArrowDown />
        </div>
        <div className="w-full border px-4 py-3 rounded mb-2 flex justify-between">
          (필수) 오픈뱅킹 출금이체 동의
          <CheckCircle />
        </div>
      </Form>

      <div className="mt-auto mb-12">
        <MainButton text="계좌인증 요청" onClick={handleNext}></MainButton>
      </div>
    </Container>
  )
}
