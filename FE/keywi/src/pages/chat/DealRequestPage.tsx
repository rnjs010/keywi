import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { Xmark } from 'iconoir-react'
import { useNavigate, useParams } from 'react-router-dom'
import MainButton from '@/components/MainButton'
import ProductForm from '@/features/chat/components/DealRequest/ProductForm'
import { useState } from 'react'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden px-4
`

const HeaderContainer = tw.div`
  relative flex justify-center items-center py-4
`

const CostInput = tw.input`
  w-full border px-4 py-3 rounded mb-2 text-base my-2
  focus:outline-none
  [caret-color: #70C400]
`

export default function DealRequestPage() {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const [assemblyCost, setAssemblyCost] = useState('')

  const handleClose = () => {
    navigate(`/chat/${roomId}`)
  }

  return (
    <Container>
      <HeaderContainer>
        <div className="absolute left-0">
          <Xmark onClick={handleClose} />
        </div>
        <Text variant="title3" weight="bold" color="black">
          거래 요청
        </Text>
      </HeaderContainer>

      {/* 상품 선택 */}
      <div className="pt-2 pb-6">
        <Text variant="body2" weight="bold" color="black">
          어떤 상품이 필요한가요?
        </Text>
        <ProductForm />
      </div>

      {/* 조립 비용 입력 */}
      <>
        <div className="flex flex-row items-center gap-2">
          <Text variant="body2" weight="bold" color="black">
            조립 비용은 얼마인가요?
          </Text>
          <Text variant="caption2" weight="bold" color="gray">
            (인건비 + 배송비)
          </Text>
        </div>
        <CostInput
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="금액 입력"
          value={assemblyCost}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAssemblyCost(e.target.value)
          }
        />
      </>

      <div className="flex flex-row gap-2 justify-end mt-8">
        <Text variant="body2" weight="bold">
          총 금액
        </Text>
        <Text variant="body2" weight="bold" color="kiwi">
          381,000원
        </Text>
      </div>

      {/* 다음 버튼 */}
      <div className="mt-auto mb-8">
        <MainButton text="다음" />
      </div>
    </Container>
  )
}
