import ProductCard from '../DealRequest/ProductCard'
import MainButton from '@/components/MainButton'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { useDealAcceptStore } from '@/stores/chatStore'

const ListContainer = tw.div`
  overflow-y-auto h-full
`

const CostBox = tw.div`
  flex flex-row gap-2 justify-end mb-4
`

export default function DealListScreen() {
  const setStep = useDealAcceptStore((state) => state.setStep)
  const receipt = useDealAcceptStore((state) => state.receipt)

  const handleNext = () => {
    setStep(2)
  }

  return (
    <>
      {/* 구매 리스트 */}
      <div className="px-4 py-2 h-4/6">
        <Text variant="body2" weight="bold" color="black">
          거래 내역
        </Text>
        <ListContainer>
          형식 오류로 출력 안됨 (없을 때 처리 필요)
          {/* {receipt.items.map((product) => (
            <div key={product.productId}>
              <ProductCard data={product} mode="view" />
            </div>
          ))} */}
        </ListContainer>
      </div>

      {/* 다음 버튼 */}
      <div className="mt-auto mb-8 px-4">
        <CostBox>
          <Text variant="body2" weight="bold">
            총 금액
          </Text>
          <Text variant="body2" weight="bold" color="kiwi">
            {receipt?.amount != null
              ? `${receipt.amount.toLocaleString()}원`
              : '금액 없음'}
          </Text>
        </CostBox>
        <MainButton text="안심결제하기" onClick={handleNext} />
      </div>
    </>
  )
}
