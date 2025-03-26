import { usePayStore } from '@/stores/payStore'
import { useState } from 'react'

export default function RegistPassword() {
  const setPassword = usePayStore((state) => state.setPassword)
  const setStep = usePayStore((state) => state.setStep)
  const [password, setPasswordInput] = useState('')

  const handleKeyPress = (key: string) => {
    if (password.length < 6) {
      setPasswordInput(password + key)
    }
    if (password.length + 1 === 6) {
      setPassword(password + key)
      setStep(5)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2>간편 비밀번호를 입력해주세요</h2>
      <div className="flex space-x-2 my-4">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className={`w-4 h-4 rounded-full ${i < password.length ? 'bg-gray-800' : 'bg-gray-300'}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[...Array(10)].map((_, i) => (
          <button
            key={i}
            onClick={() => handleKeyPress(i.toString())}
            className="bg-green-500 text-white py-4 rounded"
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  )
}
