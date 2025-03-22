import NavBar from '@/components/NavBar'
import SubHeader from '@/components/SubHeader'
import BoardCard from '@/features/board/components/BoardCard'
import BoardWriteBtn from '@/features/board/components/BoardWriteBtn'
import tw from 'twin.macro'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden
`

const ScrollArea = tw.div`
  flex-1 overflow-y-auto px-4
`

export default function BoardPage() {
  return (
    <Container>
      <SubHeader title="견적게시판" />
      {/* SECTION -  게시글 리스트 영역 */}
      <ScrollArea>
        {posts.map((item) => (
          <BoardCard {...item} />
        ))}
      </ScrollArea>
      <NavBar />
      {/* SECTION - 글쓰기 버튼 */}
      <BoardWriteBtn />
    </Container>
  )
}

//NOTE - 게시글 데이터 예시
const posts = [
  {
    id: 123,
    status: 'REQUEST',
    title: '키보드 견적 요청합니다.',
    authorNickname: '키위보다귤',
    date: '2025.03.13 | 15:43',
    chstCount: 0,
    thumbnailUrl:
      'https://pplx-res.cloudinary.com/image/upload/v1742650479/user_uploads/NInbhrjWbkuvzXG/image.jpg',
  },
  {
    id: 124,
    status: 'REQUEST',
    title: '견적부탁드립니다...',
    authorNickname: '카레',
    date: '2025.03.13 | 15:43',
    chstCount: 1,
    thumbnailUrl: '',
  },
  {
    id: 125,
    status: 'IN_PROGRESS',
    title: '견적 및 호환성 상담 신청합니다.',
    authorNickname: '스피드게임',
    date: '2025.03.13 | 15:43',
    chstCount: 3,
    thumbnailUrl:
      'https://pplx-res.cloudinary.com/image/upload/v1742650479/user_uploads/NInbhrjWbkuvzXG/image.jpg',
  },
  {
    id: 126,
    status: 'REQUEST',
    title: '조립식 키보드 견적 요청',
    authorNickname: '고양이',
    date: '2025.03.13 | 15:43',
    chstCount: 0,
    thumbnailUrl: '',
  },
  {
    id: 127,
    status: 'IN_PROGRESS',
    title: '업무용 키보드 견적',
    authorNickname: '큐티엔젤젤',
    date: '2025.03.13 | 15:43',
    chstCount: 0,
    thumbnailUrl:
      'https://pplx-res.cloudinary.com/image/upload/v1742650479/user_uploads/NInbhrjWbkuvzXG/image.jpg',
  },
  {
    id: 128,
    status: 'COMPLETED',
    title: '키보드 조립 요청합니당!',
    authorNickname: '옹시미키위러버',
    date: '2025.03.13 | 15:43',
    chstCount: 0,
    thumbnailUrl:
      'https://pplx-res.cloudinary.com/image/upload/v1742650479/user_uploads/NInbhrjWbkuvzXG/image.jpg',
  },
  {
    id: 129,
    status: 'REQUEST',
    title: '조립식 키보드 견적 요청',
    authorNickname: '고양이',
    date: '2025.03.13 | 15:43',
    chstCount: 0,
    thumbnailUrl: '',
  },
  {
    id: 130,
    status: 'REQUEST',
    title: '조립식 키보드 견적 요청',
    authorNickname: '고양이',
    date: '2025.03.13 | 15:43',
    chstCount: 0,
    thumbnailUrl: '',
  },
  {
    id: 131,
    status: 'REQUEST',
    title: '조립식 키보드 견적 요청',
    authorNickname: '고양이',
    date: '2025.03.13 | 15:43',
    chstCount: 0,
    thumbnailUrl: '',
  },
]
