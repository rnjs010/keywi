import tw from 'twin.macro'
import { CommentListProps } from '@/interfaces/HomeInterfaces'
import CommentItem from './CommentItem'

const Container = tw.div`
  flex
  flex-col
  flex-1
  overflow-y-auto
  pb-16
`

const EmptyCommentContainer = tw.div`
  flex
  justify-center
  items-center
  py-12
  text-gray
`

// const CommentSkeletonItem = () => (
//   <div className="flex px-4 py-3 border-b border-gray">
//     <Skeleton className="w-9 h-9 rounded-full mr-3 flex-shrink-0" />
//     <div className="flex-1">
//       <Skeleton className="w-24 h-4 mb-2" />
//       <Skeleton className="w-3/4 h-3 mb-1" />
//       <Skeleton className="w-16 h-3 mt-2" />
//     </div>
//   </div>
// )

export default function CommentList({
  comments,
  // isLoading = false,
}: CommentListProps) {
  // if (isLoading) {
  //   return (
  //     <Container>
  //       <CommentSkeletonItem />
  //       <CommentSkeletonItem />
  //       <CommentSkeletonItem />
  //     </Container>
  //   )
  // }

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
        <CommentItem comment={comment} />
      ))}
    </Container>
  )
}
