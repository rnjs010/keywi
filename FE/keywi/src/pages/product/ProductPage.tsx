import NavBar from '@/components/NavBar'
import StyledTabs, { TabItem } from '@/components/StyledTabs'
import HomeHeader from '@/features/home/components/HomeHeader'
import ProductList from '@/features/product/component/ProductList'
import { ProductProps } from '@/interfaces/ProductInterface'
import { useState } from 'react'
import tw from 'twin.macro'

const Container = tw.div`
  w-full 
  max-w-screen-sm 
  mx-auto 
  flex 
  flex-col 
  h-screen 
  box-border 
  overflow-x-hidden
`
const HeaderContainer = tw.div`
  z-10
`
const NavBarContainer = tw.div`
  fixed
  bottom-0
  left-0
  right-0
  bg-white
  z-10
  max-w-screen-sm
  mx-auto
  w-full
`

export default function ProductPage() {
  // 상품 더미 데이터
  const [products] = useState<ProductProps[]>([
    {
      productId: 1,
      thumbnailUrl: 'https://picsum.photos/400/400?keyboard=1',
      manufacturer: 'Qwertykeys',
      productName: 'QK80MK2 WK PINK',
      price: 241000,
      isFavorite: false,
    },
    {
      productId: 2,
      thumbnailUrl: 'https://picsum.photos/400/400?keyboard=2',
      manufacturer: 'OSUME',
      productName: 'sakura keycaps',
      price: 140000,
      isFavorite: true,
    },
    {
      productId: 3,
      thumbnailUrl: 'https://picsum.photos/400/400?keyboard=3',
      manufacturer: 'SWK',
      productName: '체리 리니어 스위치',
      price: 38000,
      isFavorite: true,
    },
    {
      productId: 4,
      thumbnailUrl: 'https://picsum.photos/400/400?keyboard=4',
      manufacturer: 'Cerulean',
      productName: '세라키 V2 Blue Crazed',
      price: 217000,
      isFavorite: false,
    },
    {
      productId: 5,
      thumbnailUrl: 'https://picsum.photos/400/400?keyboard=5',
      manufacturer: 'Cerulean',
      productName: '세라키 V2 White',
      price: 217000,
      isFavorite: false,
    },
    {
      productId: 6,
      thumbnailUrl: 'https://picsum.photos/400/400?keyboard=6',
      manufacturer: 'Cerulean',
      productName: '세라키 V2 Black',
      price: 217000,
      isFavorite: false,
    },
  ])

  // 카테고리 데이터 정의
  const categories = [
    { value: 'all', label: '통합', data: products },
    { value: 'case', label: '키보드', data: products },
    { value: 'keycap', label: '키캡', data: products },
    { value: 'keyswitch', label: '스위치', data: products },
    { value: 'stabilizer', label: '스테빌라이저', data: products },
    { value: 'foam', label: '흡음재', data: products },
    { value: 'plate', label: '보강판', data: products },
    { value: 'pcb', label: '기판', data: products },
  ]

  // 탭 아이템 생성
  const tabItems: TabItem[] = categories.map((category) => ({
    value: category.value,
    label: category.label,
    content: <ProductList products={category.data} />,
  }))

  // 탭 변경 핸들러 (추후 api 호출시 사용)
  const handleTabChange = (value: string) => {
    console.log('Current tab:', value)
    // 필요한 로직 추가
  }

  return (
    <Container>
      <HeaderContainer>
        <HomeHeader />
      </HeaderContainer>
      <StyledTabs
        tabs={tabItems}
        defaultValue="all"
        onChange={handleTabChange}
      />
      <NavBarContainer>
        <NavBar />
      </NavBarContainer>
    </Container>
  )
}
