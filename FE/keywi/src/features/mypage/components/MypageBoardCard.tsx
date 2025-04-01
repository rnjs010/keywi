import Badge from '@/components/Badge'
import getBadgeData from '@/utils/getBadgeData'
import { colors } from '@/styles/colors'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { ChatBubbleSolid } from 'iconoir-react'
import { Link } from 'react-router-dom'
import { MypageBoardCardProps } from '@/interfaces/MypageInterface'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { ReviewStars } from './ReviewStars'

const CardContainer = tw.div`
  flex flex-col justify-between items-start py-4 border-b border-white
`
const ContentContainer = tw.div`
  mt-1 flex flex-row justify-between w-full justify-items-center
`
const TitleContainer = tw.div`
  flex items-center gap-4
`
const ThumbnailImage = tw.img`
  w-[3rem] h-[3rem] rounded-md object-cover self-start
`
const ReviewBtn = tw.button`
  w-full py-1 rounded-md mt-3 justify-center text-darkKiwi bg-pay
`
const RatingContainer = tw.div`
  flex flex-col items-center justify-center
`
const RatingMessage = tw.div`
  text-center 
`
const SubmitButton = tw.button`
  px-6 mt-2 text-darkKiwi rounded-md font-bold
`
// 별점 버튼의 Link를 막기 위한 컴포넌트
const StopPropagationWrapper = tw.div`
  w-full block
`
// 커스텀 다이얼로그 타이틀 스타일
const CustomDialogTitle = styled(DialogTitle)`
  text-align: center;
  margin-bottom: 0;
  padding-bottom: 0;
  color: ${colors.darkKiwi};
  font-size: 1.1rem;
`

export default function MypageBoardCard({
  id,
  status,
  title,
  date,
  time,
  chstCount,
  thumbnailUrl,
}: MypageBoardCardProps) {
  const badgeData = getBadgeData(status)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // status 가 'COMPLETED' 일 때만 별점 버튼 표시
  const showReviewButton = status === 'COMPLETED'

  // 별점 제출 핸들러
  const handleSubmitRating = () => {
    // 여기에 별점 api 호출 handler 연동
    console.log(`별점 제출되었습니다.`)
    setIsDialogOpen(false)
  }

  // 이벤트 전파 방지 핸들러
  const handleStopPropagation = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Link to={`/board/${id}`}>
      <CardContainer>
        <Badge title={badgeData.title} color={badgeData.color} />
        <ContentContainer>
          <div className="flex-1">
            {/* 제목, 채팅 수 */}
            <TitleContainer>
              <Text variant="body1" weight="regular">
                {title}
              </Text>
              {chstCount !== 0 && (
                <span className="flex flex-row gap-1 items-center">
                  <ChatBubbleSolid
                    color={colors.gray}
                    width="1rem"
                    height="1rem"
                  />
                  <Text variant="caption1" weight="regular" color="gray">
                    {chstCount}
                  </Text>
                </span>
              )}
            </TitleContainer>
            {/* 닉네임, 날짜 */}
            <div className="mt-1">
              <Text variant="caption2" weight="regular" color="gray">
                {date} | {time}
              </Text>
            </div>
          </div>
          {/* 사진 */}
          {thumbnailUrl && (
            <ThumbnailImage src={thumbnailUrl} alt="thumbnail" />
          )}
        </ContentContainer>
        {/* 별점 버튼 및 모달 */}
        {showReviewButton && (
          <StopPropagationWrapper onClick={handleStopPropagation}>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <ReviewBtn>
                  <Text variant="caption1" weight="bold">
                    별점 남기기
                  </Text>
                </ReviewBtn>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <CustomDialogTitle>이번 거래는 어땠나요?</CustomDialogTitle>

                <RatingContainer>
                  <RatingMessage>
                    <Text
                      variant="caption1"
                      color="gray"
                      className="text-center"
                    >
                      별점은 조립자의 당도에 반영됩니다!
                    </Text>
                  </RatingMessage>
                  <ReviewStars />
                  <SubmitButton onClick={handleSubmitRating}>확인</SubmitButton>
                </RatingContainer>
              </DialogContent>
            </Dialog>
          </StopPropagationWrapper>
        )}
      </CardContainer>
    </Link>
  )
}
