import StyledTabs, { TabItem } from '@/components/StyledTabs'
import SearchFeed from '@/features/search/components/SearchFeed'
import { SearchHeader } from '@/features/search/components/SearchHeader'
import SearchProduct, {
  Product,
} from '@/features/search/components/SearchProduct'
import SearchUser, { User } from '@/features/search/components/SearchUser'
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
  relative
`

// 상단 고정 컨테이너
const FixedTopSection = tw.div`
  w-full
`

export function AfterSearchPage() {
  // 더미데이터
  const [feeds] = useState([
    { id: 1, imageUrl: 'https://picsum.photos/300?random=1' },
    { id: 2, imageUrl: 'https://picsum.photos/300?random=2' },
    { id: 3, imageUrl: 'https://picsum.photos/300?random=3' },
    { id: 4, imageUrl: 'https://picsum.photos/300?random=4' },
    { id: 5, imageUrl: 'https://picsum.photos/300?random=5' },
    { id: 6, imageUrl: 'https://picsum.photos/300?random=6' },
    { id: 7, imageUrl: 'https://picsum.photos/300?random=7' },
    { id: 8, imageUrl: 'https://picsum.photos/300?random=8' },
    { id: 9, imageUrl: 'https://picsum.photos/300?random=9' },
    { id: 10, imageUrl: 'https://picsum.photos/300?random=10' },
    { id: 11, imageUrl: 'https://picsum.photos/300?random=11' },
    { id: 12, imageUrl: 'https://picsum.photos/300?random=12' },
    { id: 13, imageUrl: 'https://picsum.photos/300?random=13' },
    { id: 14, imageUrl: 'https://picsum.photos/300?random=14' },
    { id: 15, imageUrl: 'https://picsum.photos/300?random=15' },
    { id: 16, imageUrl: 'https://picsum.photos/300?random=10' },
    { id: 17, imageUrl: 'https://picsum.photos/300?random=11' },
    { id: 18, imageUrl: 'https://picsum.photos/300?random=12' },
    { id: 19, imageUrl: 'https://picsum.photos/300?random=13' },
    { id: 20, imageUrl: 'https://picsum.photos/300?random=14' },
    { id: 21, imageUrl: 'https://picsum.photos/300?random=15' },
  ])

  // 상품 더미 데이터
  const [products] = useState<Product[]>([
    {
      id: 1,
      imageUrl: 'https://picsum.photos/400/400?keyboard=1',
      manufacturer: 'Qwertykeys',
      name: 'QK80MK2 WK PINK',
      price: 241000,
    },
    {
      id: 2,
      imageUrl: 'https://picsum.photos/400/400?keyboard=2',
      manufacturer: 'OSUME',
      name: 'sakura keycaps',
      price: 140000,
    },
    {
      id: 3,
      imageUrl: 'https://picsum.photos/400/400?keyboard=3',
      manufacturer: 'SWK',
      name: '체리 리니어 스위치',
      price: 38000,
    },
    {
      id: 4,
      imageUrl: 'https://picsum.photos/400/400?keyboard=4',
      manufacturer: 'Cerulean',
      name: '세라키 V2 Blue Crazed',
      price: 217000,
    },
    {
      id: 5,
      imageUrl: 'https://picsum.photos/400/400?keyboard=4',
      manufacturer: 'Cerulean',
      name: '세라키 V2 Blue Crazed',
      price: 217000,
    },
    {
      id: 6,
      imageUrl: 'https://picsum.photos/400/400?keyboard=4',
      manufacturer: 'Cerulean',
      name: '세라키 V2 Blue Crazed',
      price: 217000,
    },
  ])

  // 사용자 더미 데이터 - 이미지에 맞게 구성
  const [users] = useState<User[]>([
    {
      id: 1,
      username: '규리콩땅',
      profileImage: '', // 빈 이미지로 설정하면 회색 원으로 표시됩니다
      description: '감성한방',
      subscription: '당도 16',
    },
    {
      id: 2,
      username: '규리콩땅',
      profileImage: '',
      description: '감성한방',
      subscription: '싼토 16',
    },
    {
      id: 3,
      username: '규리콩땅',
      profileImage: '',
      description: '감성한방',
      subscription: '싼토 16',
    },
    {
      id: 4,
      username: '규리콩땅',
      profileImage: '',
      description: '감성한방',
      subscription: '싼토 16',
    },
    {
      id: 5,
      username: '규리콩땅',
      profileImage: '',
      description: '감성한방',
      subscription: '싼토 16',
    },
  ])

  // 탭 아이템 정의
  const tabItems: TabItem[] = [
    {
      value: 'feed',
      label: '피드',
      content: <SearchFeed feeds={feeds} />,
    },
    {
      value: 'product',
      label: '상품',
      content: <SearchProduct products={products} />,
    },
    {
      value: 'user',
      label: '계정',
      content: <SearchUser users={users} />,
    },
  ]

  // 탭 변경 핸들러 (추후 api 호출시 사용)
  const handleTabChange = (value: string) => {
    console.log('Current tab:', value)
    // 필요한 로직 추가
  }

  return (
    <Container>
      {/* 상단 고정 영역 */}
      <FixedTopSection>
        <SearchHeader />
      </FixedTopSection>
      <StyledTabs
        tabs={tabItems}
        defaultValue="feed"
        onChange={handleTabChange}
      />
    </Container>
  )
}
