import HeaderIcons from '@/components/HeaderIcons'
import NavBar from '@/components/NavBar'
import BoardDetailTop from '@/features/board/components/BoardDetailTop'
import BoardDetailMain from '@/features/board/components/BoardDetailMain'
import MainButton from '@/components/MainButton'
import tw from 'twin.macro'
import { NavArrowLeft } from 'iconoir-react'
import { BoardData } from '@/interfaces/BoardInterface'
import { useNavigate } from 'react-router-dom'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden
`

const HeaderContainer = tw.div`
  flex justify-between items-center py-4 px-4
`

const ScrollArea = tw.div`
  flex-1 overflow-y-auto px-4
`

export default function BoardDetailPage() {
  const navigate = useNavigate()

  return (
    <Container>
      {/* SECTION - 헤더 영역 */}
      <HeaderContainer>
        <NavArrowLeft
          height="1.875rem"
          width="1.875rem"
          onClick={() => navigate('/board')}
        />
        <HeaderIcons />
      </HeaderContainer>
      {/* SECTION - 게시글 상세 영역 */}
      <ScrollArea>
        <BoardDetailTop data={dummyData} />
        <BoardDetailMain data={dummyData} />
      </ScrollArea>
      <NavBar />
      {/* SECTION - 채팅 버튼 */}
      <div className="w-full px-4 fixed bottom-24">
        <MainButton text="1:1 채팅 하러 가기" />
      </div>
    </Container>
  )
}

//NOTE - 게시글 데이터 예시
const dummyData: BoardData = {
  id: 123,
  title: '게이밍 키보드 견적 요청합니다',
  content:
    '메인 키보드로 하나 맞추려고 하는데 견적 이정도면 괜찮을까요? 그리고 집에 첨부된 사진과 같은 스테빌라이저가 있는데 아래 견적과 호환 가능할까요??채팅 요청 부탁드립니다 ^.^',
  authorNickname: '키보드러버',
  createdAt: '2025.03.13 | 15:43',
  status: 'REQUEST',
  chatCount: 5,
  bookmarkCount: 12,
  viewCount: 156,
  isBookmarked: true,
  isAuthor: false,
  items: [
    {
      categoryId: 1,
      categoryName: '하우징',
      itemId: 101,
      itemName: 'Qwertykeys QK80MK2 WK PINK',
      price: 241000,
      imageUrl: 'https://picsum.photos/200',
    },
    {
      categoryId: 2,
      categoryName: '키캡',
      itemId: 102,
      itemName: '오스메 사쿠라 키캡',
      price: 149000,
      imageUrl: 'https://picsum.photos/200',
    },
    {
      categoryId: 3,
      categoryName: '스위치',
      itemId: 103,
      itemName: 'SWK 체다 리니어 스위치',
      price: 38000,
      imageUrl: 'https://picsum.photos/200',
    },
  ],
  images: ['https://picsum.photos/200'],
}
