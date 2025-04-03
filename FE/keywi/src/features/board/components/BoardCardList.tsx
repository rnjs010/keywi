import BoardCard from '@/features/board/components/BoardCard'
import { useBoardList } from '../hooks/useBoardList'

export default function BoardCardList() {
  // React Query를 이용해 게시글 목록 조회
  const { data: posts, isLoading, error } = useBoardList()

  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>에러가 발생했습니다: {error.message}</div>
  if (!posts) return <div>게시글이 없습니다.</div>

  return (
    <>
      {posts.map((item) => (
        // <BoardCard key={item.id} {...item} />
        <BoardCard key={item.boardId} {...item} />
      ))}
    </>
  )
}
