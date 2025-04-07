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
  text-gray
  py-8
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
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </CommentsWrapper>
    </Container>
  )
}
