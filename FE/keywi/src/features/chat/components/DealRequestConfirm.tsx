import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import MainButton from '@/components/MainButton'
import { useDealProductStore } from '@/stores/ChatStore'
import { useNavigate, useParams } from 'react-router-dom'

export default function DealRequestConfirm() {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const setStep = useDealProductStore((state) => state.setStep)

  const handleNext = () => {
    navigate(`/chat/${roomId}`)
  }

  return (
    <>
      <div className="flex flex-row gap-2 justify-end mt-8">
        <Text variant="body2" weight="bold">
          총 금액
        </Text>
        <Text variant="body2" weight="bold" color="kiwi">
          381,000원
        </Text>
      </div>

      {/* 확인 버튼 */}
      <div className="mt-auto mb-8">
        <MainButton text="확인" onClick={handleNext} />
      </div>
    </>
  )
}
