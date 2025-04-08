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

export default function HomeFeedInteraction({
  likeCount: initialLikeCount,
  commentCount,
  isLiked: initialIsLiked = false,
  isBookmarked: initialIsBookmarked = false,
  feedId,
}: HomeFeedInteractionProps) {
  const navigate = useNavigate()

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
    likeMutation.mutate(feedId)
  }

  const handleBookmark = () => {
    // 아이콘 변경
    setIsBookmarked(!isBookmarked)

    // API 호출
    bookmarkMutation.mutate(feedId)
  }

  const handleCommentClick = () => {
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
