import tw from 'twin.macro'
import { CommentListProps } from '@/interfaces/HomeInterfaces'
import CommentItem from './CommentItem'

const Container = tw.div`
  flex
  flex-col
  flex-1
  overflow-y-auto
`

const EmptyCommentContainer = tw.div`
  flex
  justify-center
  items-center
  py-12
  text-gray
`

export default function CommentList({ comments }: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <EmptyCommentContainer>
        아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
      </EmptyCommentContainer>
    )
  }

  return (
    <Container>
      {/* 댓글을 최신순으로 정렬하여 표시 (맨 아래 최신) */}
      {[...comments].reverse().map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </Container>
  )
}
