import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import MainButton from '@/components/MainButton'
import ProductForm from '@/features/chat/components/DealRequest/ProductForm'
import { useEffect, useState } from 'react'
import { useDealRequestStore } from '@/stores/chatStore'

const CostInput = tw.input`
  w-full border px-4 py-3 rounded mb-2 text-base my-2
  focus:outline-none
  [caret-color: #70C400]
`

const TotalBox = tw.div`
  flex flex-row gap-2 justify-end mb-4
`

export default function DealReqFormScreen() {
  const setStep = useDealRequestStore((state) => state.setStep)
  const selectedProducts = useDealRequestStore(
    (state) => state.selectedProducts,
  )
  const totalPrice = useDealRequestStore((state) => state.totalPrice)
  const setTotalPrice = useDealRequestStore((state) => state.setTotalPrice)
  const [assemblyCost, setAssemblyCost] = useState('')

  // 총 금액 계산 및 저장
  useEffect(() => {
    const productsTotal = Object.values(selectedProducts).reduce(
      (sum, product) => sum + (product?.price || 0),
      0,
    )

    const assembly = Number(assemblyCost) || 0
    setTotalPrice(productsTotal + assembly)
  }, [selectedProducts, assemblyCost, setTotalPrice])

  const handleNext = () => {
    setStep(2)
  }

  return (
    <>
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

      {/* 다음 버튼 */}
      <div className="mt-auto mb-8">
        <TotalBox>
          <Text variant="body2" weight="bold">
            총 금액
          </Text>
          <Text variant="body2" weight="bold" color="kiwi">
            {totalPrice.toLocaleString()}원
          </Text>
        </TotalBox>
        <MainButton text="다음" onClick={handleNext} />
      </div>
    </>
  )
}
