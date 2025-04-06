import ProductCard from '../DealRequest/ProductCard'
import MainButton from '@/components/MainButton'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { BoardItem } from '@/interfaces/BoardInterface'
import { useDealAcceptStore } from '@/stores/chatStore'
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
            <div key={product.productId}>
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
    productId: 1,
    productName: 'Qwertykeys QK80MK2 WK PINK',
    price: 241000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 2,
    categoryName: '키캡',
    productId: 3,
    productName: '오스메 사쿠라 키캡',
    price: 140000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 3,
    categoryName: '스위치',
    productId: 6,
    productName: '오스틴 샤지 키드',
    price: 140000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 4,
    categoryName: '스테빌라이저',
    productId: 7,
    productName: 'Durock V2 스테빌라이저',
    price: 25000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 5,
    categoryName: '흡음재',
    productId: 9,
    productName: 'PORON PCB 흡음재',
    price: 18000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 6,
    categoryName: '보강판',
    productId: 11,
    productName: 'FR4 보강판',
    price: 30000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 7,
    categoryName: '기판',
    productId: 13,
    productName: 'Hotswap 기판',
    price: 95000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
]
