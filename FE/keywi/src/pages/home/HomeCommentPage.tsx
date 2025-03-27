import DetailHeader from '@/components/DetailHeader'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { CommentData, FeedData } from '@/interfaces/HomeInterfaces'
import {
  dummyComments,
  dummyFeeds,
} from '@/features/home/services/homeDummyData'
import CommentInput from '@/features/home/components/CommentInput'
import CommentList from '@/features/home/components/CommentList'

const Container = tw.div`
  w-full 
  max-w-screen-sm 
  mx-auto 
  flex 
  flex-col 
  h-screen  
  overflow-x-hidden
`

const ContentArea = styled.div`
  ${tw`
    flex-1 
  `}

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
`

export default function HomeCommentPage() {
  const { feedId } = useParams<{ feedId: string }>()
  // feed 정보는 나중에 피드 내용 표시 등에 사용할 예정
  const [_feed, setFeed] = useState<FeedData | null>(null)
  const [comments, setComments] = useState<CommentData[]>([])
  //NOTE - 추후 댓글창 로딩 필요시 활성화 할 예정
  // const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (feedId) {
      // 피드 데이터 찾기 (실제로는 API 호출)
      const feedIdNum = parseInt(feedId)
      const foundFeed = dummyFeeds.find((feed) => feed.id === feedIdNum)
      setFeed(foundFeed || null)

      // 댓글 데이터 가져오기
      const feedComments = dummyComments[feedIdNum] || []
      setComments(feedComments)
    }
  }, [feedId])

  const handleCommentSubmit = (content: string) => {
    if (!feedId) return

    // 새 댓글 생성 (실제로는 API 호출)
    const newComment: CommentData = {
      id: Date.now(), // 임시 ID
      username: '현재사용자', // 실제로는 로그인한 사용자 정보 사용
      profileImage: 'https://cataas.com/cat/says/user',
      content,
      timeAgo: '방금 전',
    }

    // 댓글 목록 업데이트
    setComments((prev) => [...prev, newComment])

    // 실제 구현에서는 여기서 서버로 새 댓글 전송
  }

  return (
    <>
      <DetailHeader title={`댓글 ${comments.length}`} />
      <Container>
        <ContentArea>
          <CommentList comments={comments} />
        </ContentArea>
        <CommentInput
          feedId={parseInt(feedId || '0')}
          onCommentSubmit={handleCommentSubmit}
        />
      </Container>
    </>
  )
}
