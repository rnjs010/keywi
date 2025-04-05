import HeaderIcons from '@/components/HeaderIcons'
import NavBar from '@/components/NavBar'
import BoardDetailTop from '@/features/board/components/BoardDetailTop'
import BoardDetailMain from '@/features/board/components/BoardDetailMain'
import MainButton from '@/components/MainButton'
import tw from 'twin.macro'
import { NavArrowLeft, Bookmark, BookmarkSolid } from 'iconoir-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBoardDetail } from '@/features/board/hooks/useBoardDetail'
import { useState } from 'react'
import { colors } from '@/styles/colors'
import ErrorMessage from '@/components/message/ErrorMessage'
import LoadingMessage from '@/components/message/LoadingMessage'
import NoDataMessage from '@/components/message/NoDataMessage'

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
  const params = useParams<{ postId: string }>()
  const boardId = params.postId ? Number(params.postId) : null
  const [isBookmarked, setIsBookmarked] = useState(false)

  if (!boardId) return <ErrorMessage />
  const { data, loading, error } = useBoardDetail(boardId)

  const handleBookmarkClick = () => {
    setIsBookmarked((prev) => !prev)
  }

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
        {loading ? (
          <LoadingMessage />
        ) : error ? (
          <ErrorMessage />
        ) : !data ? (
          <NoDataMessage text="데이터가 없습니다." />
        ) : (
          <>
            <BoardDetailTop data={data} />
            <BoardDetailMain data={data} />
          </>
        )}
      </ScrollArea>

      <NavBar />

      {/* SECTION - 채팅 버튼 */}
      {data && !data.author && (
        <div className="flex flex-row justify-between items-center gap-2 w-full max-w-screen-sm px-4 fixed bottom-24">
          <MainButton text="1:1 채팅 하러 가기" />
          <div onClick={handleBookmarkClick} className="cursor-pointer">
            {isBookmarked ? (
              <BookmarkSolid height="2rem" width="2rem" color={colors.kiwi} />
            ) : (
              <Bookmark height="2rem" width="2rem" color={colors.darkGray} />
            )}
          </div>
        </div>
      )}
    </Container>
  )
}
