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
    { feedId: 1, thumbnailUrl: 'https://picsum.photos/300?random=1' },
    { feedId: 2, thumbnailUrl: 'https://picsum.photos/300?random=2' },
    { feedId: 3, thumbnailUrl: 'https://picsum.photos/300?random=3' },
    { feedId: 4, thumbnailUrl: 'https://picsum.photos/300?random=4' },
    { feedId: 5, thumbnailUrl: 'https://picsum.photos/300?random=5' },
    { feedId: 6, thumbnailUrl: 'https://picsum.photos/300?random=6' },
    { feedId: 7, thumbnailUrl: 'https://picsum.photos/300?random=7' },
    { feedId: 8, thumbnailUrl: 'https://picsum.photos/300?random=8' },
    { feedId: 9, thumbnailUrl: 'https://picsum.photos/300?random=9' },
    { feedId: 10, thumbnailUrl: 'https://picsum.photos/300?random=10' },
    { feedId: 11, thumbnailUrl: 'https://picsum.photos/300?random=11' },
    { feedId: 12, thumbnailUrl: 'https://picsum.photos/300?random=12' },
    { feedId: 13, thumbnailUrl: 'https://picsum.photos/300?random=13' },
    { feedId: 14, thumbnailUrl: 'https://picsum.photos/300?random=14' },
    { feedId: 15, thumbnailUrl: 'https://picsum.photos/300?random=15' },
    { feedId: 16, thumbnailUrl: 'https://picsum.photos/300?random=10' },
    { feedId: 17, thumbnailUrl: 'https://picsum.photos/300?random=11' },
    { feedId: 18, thumbnailUrl: 'https://picsum.photos/300?random=12' },
    { feedId: 19, thumbnailUrl: 'https://picsum.photos/300?random=13' },
    { feedId: 20, thumbnailUrl: 'https://picsum.photos/300?random=14' },
    { feedId: 21, thumbnailUrl: 'https://picsum.photos/300?random=15' },
  ])

  // 상품 더미 데이터
  const [products] = useState<Product[]>([
    {
      productId: 1,
      thumbnailUrl: 'https://picsum.photos/400/400?keyboard=1',
      manufacturer: 'Qwertykeys',
      productName: 'QK80MK2 WK PINK',
      price: 241000,
    },
    {
      productId: 2,
      thumbnailUrl: 'https://picsum.photos/400/400?keyboard=2',
      manufacturer: 'OSUME',
      productName: 'sakura keycaps',
      price: 140000,
    },
    {
      productId: 3,
      thumbnailUrl: 'https://picsum.photos/400/400?keyboard=3',
      manufacturer: 'SWK',
      productName: '체리 리니어 스위치',
      price: 38000,
    },
    {
      productId: 4,
      thumbnailUrl: 'https://picsum.photos/400/400?keyboard=4',
      manufacturer: 'Cerulean',
      productName: '세라키 V2 Blue Crazed',
      price: 217000,
    },
    {
      productId: 5,
      thumbnailUrl: 'https://picsum.photos/400/400?keyboard=4',
      manufacturer: 'Cerulean',
      productName: '세라키 V2 Blue Crazed',
      price: 217000,
    },
    {
      productId: 6,
      thumbnailUrl: 'https://picsum.photos/400/400?keyboard=4',
      manufacturer: 'Cerulean',
      productName: '세라키 V2 Blue Crazed',
      price: 217000,
    },
  ])

  // 사용자 더미 데이터
  const [users] = useState<User[]>([
    {
      userId: 1,
      nickname: '규리몽땅',
      profileImageUrl: '',
      profileContent: '감성 몽땅',
      brix: 16,
    },
    {
      userId: 1,
      nickname: '규리콩땅',
      profileImageUrl: '',
      profileContent: '키보드가 너무 좋아요.',
      brix: 23,
    },
    {
      userId: 1,
      nickname: '규리콩땅',
      profileImageUrl: '',
      profileContent: '키보드 전문 수집가 야야야',
      brix: 20,
    },
    {
      userId: 1,
      nickname: '규리콩땅',
      profileImageUrl: '',
      profileContent: '감성있는 키보드를 제작해요',
      brix: 45,
    },
    {
      userId: 1,
      nickname: '규리콩땅',
      profileImageUrl: '',
      profileContent: '감성한방',
      brix: 35,
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
