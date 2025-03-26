import { usePayStore } from '@/stores/payStore'
import { useState } from 'react'

export default function AuthAccount() {
  const bank = usePayStore((state) => state.bank)
  const setStep = usePayStore((state) => state.setStep)

  const [authCode, setAuthCode] = useState('')

  const handleNext = () => {
    if (authCode.length === 4) {
      setStep(4)
    }
  }

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-xl mb-4">계좌 인증</h2>
      <p>{bank}</p>
      <p>키워드 **** 입금 금액 확인 후 입력해주세요</p>
      <input
        type="text"
        maxLength={4}
        placeholder="인증코드 입력"
        value={authCode}
        onChange={(e) => setAuthCode(e.target.value)}
        className="border rounded p-2 mb-4"
      />
      {/* Input OTP */}
      <button
        onClick={handleNext}
        className="bg-green-500 text-white py-2 rounded"
      >
        인증하기
      </button>
    </div>
  )
}
