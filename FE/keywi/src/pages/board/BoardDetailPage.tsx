import HeaderIcons from '@/components/HeaderIcons'
import NavBar from '@/components/NavBar'
import BoardDetailTop from '@/features/board/components/BoardDetailTop'
import BoardDetailMain from '@/features/board/components/BoardDetailMain'
import MainButton from '@/components/MainButton'
import tw from 'twin.macro'
import { NavArrowLeft } from 'iconoir-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBoardDetail } from '@/features/board/hooks/useBoardDetail'

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
  const { boardId } = useParams<{ boardId: string }>()
  const { data, loading, error } = useBoardDetail(Number(boardId))

  if (loading) return <p>로딩 중...</p>
  if (error) return <p>{error}</p>
  if (!data) return <p>게시글을 찾을 수 없습니다.</p>

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
        <BoardDetailTop data={data} />
        <BoardDetailMain data={data} />
      </ScrollArea>
      <NavBar />
      {/* SECTION - 채팅 버튼 */}
      {!data.author && (
        <div className="w-full px-4 fixed bottom-24">
          <MainButton text="1:1 채팅 하러 가기" />
        </div>
      )}
    </Container>
  )
}
