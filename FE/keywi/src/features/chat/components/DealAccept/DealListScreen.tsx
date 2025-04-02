import ProductCard from '../DealRequest/ProductCard'
import MainButton from '@/components/MainButton'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { BoardItem } from '@/interfaces/BoardInterface'
import { useDealAcceptStore } from '@/stores/ChatStore'
import { useMemo } from 'react'

const ListContainer = tw.div`
  overflow-y-auto h-full
`

const CostBox = tw.div`
  flex flex-row gap-2 justify-end mb-4
`

export default function DealListScreen() {
  const setStep = useDealAcceptStore((state) => state.setStep)
  const totalPrice = useDealAcceptStore((state) => state.totalPrice)
  const setTotalPrice = useDealAcceptStore((state) => state.setTotalPrice)

  useMemo(() => {
    setTotalPrice(
      Object.values(getProducts).reduce(
        (sum, product) => sum + (product?.price || 0),
        0,
      ),
    )
  }, [])

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
          {getProducts.map((product) => (
            <div key={product.itemId}>
              <ProductCard data={product} mode="view" />
            </div>
          ))}
        </ListContainer>
      </div>

      {/* 다음 버튼 */}
      <div className="mt-auto mb-8 px-4">
        <CostBox>
          <Text variant="body2" weight="bold">
            총 금액
          </Text>
          <Text variant="body2" weight="bold" color="kiwi">
            {totalPrice.toLocaleString()}원
          </Text>
        </CostBox>
        <MainButton text="안심결제하기" onClick={handleNext} />
      </div>
    </>
  )
}

// 더미 데이터
const getProducts: BoardItem[] = [
  {
    categoryId: 1,
    categoryName: '하우징',
    itemId: 1,
    itemName: 'Qwertykeys QK80MK2 WK PINK',
    price: 241000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 2,
    categoryName: '키캡',
    itemId: 3,
    itemName: '오스메 사쿠라 키캡',
    price: 140000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 3,
    categoryName: '스위치',
    itemId: 6,
    itemName: '오스틴 샤지 키드',
    price: 140000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 4,
    categoryName: '스테빌라이저',
    itemId: 7,
    itemName: 'Durock V2 스테빌라이저',
    price: 25000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 5,
    categoryName: '흡음재',
    itemId: 10,
    itemName: 'PE Foam 흡음재',
    price: 15000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 6,
    categoryName: '보강판',
    itemId: 11,
    itemName: 'FR4 보강판',
    price: 30000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 7,
    categoryName: '기판',
    itemId: 14,
    itemName: 'Solder 기판',
    price: 85000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 100,
    categoryName: '조립비용',
    itemId: 100,
    itemName: '인건비 및 상품 구매 배송비',
    price: 50000,
    imageUrl: 'https://picsum.photos/200',
  },
]
