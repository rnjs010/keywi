import tw from 'twin.macro'
import { CommentListProps } from '@/interfaces/HomeInterfaces'
import CommentItem from './CommentItem'

const Container = tw.div`
  flex
  flex-col
  flex-1
  overflow-y-auto
  justify-end
`

const EmptyCommentContainer = tw.div`
  flex
  justify-center
  items-center
  py-12
  text-gray
  mt-auto
`
const CommentsWrapper = tw.div`
  flex
  flex-col
`

export default function CommentList({ comments }: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <Container>
        <EmptyCommentContainer>
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
        </EmptyCommentContainer>
      </Container>
    )
  }

  return (
    <Container>
      <CommentsWrapper>
        {/* 댓글을 시간순으로 정렬하여 표시 (과거->최신 순서로) */}
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </CommentsWrapper>
    </Container>
  )
}
