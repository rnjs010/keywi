import { colors } from '@/styles/colors'
import { Text } from '@/styles/typography'
import {
  Bookmark,
  BookmarkSolid,
  ChatBubbleEmpty,
  Heart,
  HeartSolid,
  ShareIos,
} from 'iconoir-react'
import { useEffect, useState } from 'react'
import tw from 'twin.macro'
import { HomeFeedInteractionProps } from '@/interfaces/HomeInterfaces'
import { useNavigate } from 'react-router-dom'
import {
  useBookmarkMutation,
  useLikeMutation,
} from '../../hooks/useFeedInteractions'
import { saveScrollPosition } from '@/utils/scrollManager'

const Container = tw.div`
  flex
  mx-4
  justify-between
`
const IconBtn = tw.button`
  flex
  items-center
  justify-center
  outline-none
`
const CommentWrapper = tw.div`
  flex 
  items-center
  gap-1
`
const CommentBtn = tw.button`
`

const LikeWrapper = tw.div`
  flex 
  items-center
  gap-1
`
// 스크롤 키
const SCROLL_KEY = 'home-feed'

export default function HomeFeedInteraction({
  likeCount: initialLikeCount,
  commentCount,
  isLiked: initialIsLiked = false,
  isBookmarked: initialIsBookmarked = false,
  feedId,
}: HomeFeedInteractionProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)

  // API 연동 훅
  const likeMutation = useLikeMutation()
  const bookmarkMutation = useBookmarkMutation()

  // props 값이 변경되면 상태 업데이트
  useEffect(() => {
    setIsLiked(initialIsLiked)
    setLikeCount(initialLikeCount)
    setIsBookmarked(initialIsBookmarked)
  }, [initialIsLiked, initialLikeCount, initialIsBookmarked])

  const handleLike = () => {
    // 아이콘 변경
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))

    // API 호출
    likeMutation.mutate(feedId, {
      onSuccess: (data) => {
        // API 응답으로 정확한 값으로 업데이트
        setIsLiked(data.liked)
        setLikeCount(data.likeCount)
      },
      onError: () => {
        // 실패 시 원상복구
        setIsLiked(isLiked)
        setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1))
      },
    })
  }

  const handleBookmark = () => {
    // 아이콘 변경
    setIsBookmarked(!isBookmarked)

    // API 호출
    bookmarkMutation.mutate(feedId, {
      onSuccess: (data) => {
        setIsBookmarked(data.bookmarked)
      },
      onError: () => {
        // 실패 시 원상복구
        setIsBookmarked(isBookmarked)
      },
    })
  }

  const navigate = useNavigate()

  const handleCommentClick = () => {
    // 현재 스크롤 위치 저장
    const scrollElement = document.querySelector('[class*="ScrollArea"]')
    if (scrollElement) {
      // 스크롤 위치 저장
      saveScrollPosition(SCROLL_KEY, scrollElement.scrollTop)
    }

    navigate(`/home/comment/${feedId}`)
  }

  return (
    <Container>
      <div className="flex gap-3">
        <LikeWrapper>
          <IconBtn onClick={handleLike} disabled={likeMutation.isPending}>
            {isLiked ? (
              <HeartSolid height={22} width={22} color={colors.kiwi} />
            ) : (
              <Heart height={22} width={22} strokeWidth={1.5} />
            )}
          </IconBtn>
          <Text variant="caption1">{likeCount}</Text>
        </LikeWrapper>
        <CommentWrapper>
          <CommentBtn onClick={handleCommentClick}>
            <ChatBubbleEmpty height={22} width={22} strokeWidth={1.5} />
          </CommentBtn>
          <Text variant="caption1">{commentCount}</Text>
        </CommentWrapper>
        <ShareIos height={22} width={22} strokeWidth={1.5} />
      </div>
      <IconBtn onClick={handleBookmark} disabled={bookmarkMutation.isPending}>
        {isBookmarked ? (
          <BookmarkSolid height={22} width={22} color={colors.kiwi} />
        ) : (
          <Bookmark height={22} width={22} strokeWidth={1.5} />
        )}
      </IconBtn>
    </Container>
  )
}
