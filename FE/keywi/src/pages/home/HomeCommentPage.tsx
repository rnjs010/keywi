import DetailHeader from '@/components/DetailHeader'
import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import CommentInput from '@/features/home/components/comment/CommentInput'
import CommentList from '@/features/home/components/comment/CommentList'
import { useComments } from '@/features/home/hooks/useComments'
import LoadingMessage from '@/components/message/LoadingMessage'

const Container = tw.div`
  w-full 
  max-w-screen-sm 
  mx-auto 
  flex 
  flex-col 
  h-screen
  pb-4
`
const HeaderWrapper = tw.div`
  sticky
  top-0
  z-10
  bg-white
  w-full
`
const ContentArea = styled.div`
  ${tw`
    flex
    flex-col
    flex-1
    overflow-y-auto
    justify-end
  `}

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
`

export default function HomeCommentPage() {
  const navigate = useNavigate()
  const { feedId } = useParams<{ feedId: string }>()
  const feedIdNumber = parseInt(feedId || '0', 10)

  const { comments, isLoading, submitComment } = useComments(feedIdNumber)
  const contentRef = useRef<HTMLDivElement>(null)

  // 댓글 제출 핸들러
  const handleCommentSubmit = (content: string) => {
    submitComment(content)
  }

  // 뒤로가기 버튼 핸들러
  const handleBack = () => {
    navigate('/home', { state: { fromComments: true } })
  }

  // 컴포넌트가 마운트되거나 댓글이 추가될 때 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (contentRef.current && !isLoading) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [comments.length, isLoading])

  return (
    <Container>
      <HeaderWrapper>
        <DetailHeader title={`댓글 ${comments.length}`} onBack={handleBack} />
      </HeaderWrapper>

      <ContentArea ref={contentRef}>
        {isLoading ? <LoadingMessage /> : <CommentList comments={comments} />}
      </ContentArea>

      <CommentInput
        feedId={feedIdNumber}
        onCommentSubmit={handleCommentSubmit}
      />
    </Container>
  )
}
