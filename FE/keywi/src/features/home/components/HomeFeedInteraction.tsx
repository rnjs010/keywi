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
import { useState } from 'react'
import tw from 'twin.macro'

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
const LikeWrapper = tw.div`
  flex 
  items-center
  gap-1
`

export default function HomeFeedInteraction() {
  //TODO - 백 연결 후 상태 관리 할 것임
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(39)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  return (
    <Container>
      <div className="flex gap-3">
        <LikeWrapper>
          <IconBtn onClick={handleLike}>
            {isLiked ? (
              <HeartSolid height={22} width={22} color={colors.kiwi} />
            ) : (
              <Heart height={22} width={22} strokeWidth={1.5} />
            )}
          </IconBtn>
          <Text variant="caption1">{likeCount}</Text>
        </LikeWrapper>
        <CommentWrapper>
          <ChatBubbleEmpty height={22} width={22} strokeWidth={1.5} />
          <Text variant="caption1">3</Text>
        </CommentWrapper>
        <ShareIos height={22} width={22} strokeWidth={1.5} />
      </div>
      <IconBtn onClick={handleBookmark}>
        {isBookmarked ? (
          <BookmarkSolid height={22} width={22} color={colors.kiwi} />
        ) : (
          <Bookmark height={22} width={22} strokeWidth={1.5} />
        )}
      </IconBtn>
    </Container>
  )
}
