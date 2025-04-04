import BoardCard from '@/features/board/components/BoardCard'
import { useBoardList } from '../hooks/useBoardList'
import LoadingMessage from '@/components/LoadingMessage'
import ErrorMessage from '@/components/ErrorMessage'
import NoDataMessage from '@/components/NoDataMessage'

export default function BoardCardList() {
  // React Query를 이용해 게시글 목록 조회
  const { data: posts, isLoading, error } = useBoardList()

  return (
    <>
      {isLoading && <LoadingMessage />}

      {error && <ErrorMessage />}

      {!isLoading && !error && (!posts || posts.length === 0) && (
        <NoDataMessage text="게시글이 없습니다." />
      )}

      {posts &&
        posts.map((item) => (
          // <BoardCard key={item.id} {...item} />
          <BoardCard key={item.boardId} {...item} />
        ))}
    </>
  )
}
