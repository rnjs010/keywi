import Badge from '@/components/Badge'
import getBadgeData from '@/utils/getBadgeData'
import { colors } from '@/styles/colors'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { ChatBubbleSolid } from 'iconoir-react'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import { ReviewStars } from './ReviewStars'
import { BoardCardData } from '@/interfaces/BoardInterface'
import { formatDateTime } from '@/utils/formatDateTime'
import {
  useChangeBoardStatus,
  useCheckRatingExists,
  useRatingBoard,
} from '../hooks/useMypageBoard'
import { toast } from 'sonner'

const CardContainer = tw.div`
  flex flex-col py-4 border-b border-[#EEEEEE] gap-1
`
const ContentContainer = tw.div`
  mt-1 flex flex-row justify-between w-full items-start justify-items-center px-1
`
const TitleContainer = tw.div`
  flex items-center gap-4
`
const StatusContainer = tw.div`
  flex items-center justify-center
`
const ThumbnailImage = tw.img`
  w-[3rem] h-[3rem] rounded-md object-cover self-start
`
const StatusBtn = tw.button`
  w-full py-1 rounded-md mt-3 justify-center
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

// BoardCardData에 isMyProfile 추가
interface MypageBoardCardProps extends BoardCardData {
  isMyProfile: boolean
}

export default function MypageBoardCard({
  boardId,
  title,
  thumbnailUrl,
  dealState,
  chatCount,
  createdAt,
  isMyProfile,
}: MypageBoardCardProps) {
  const badgeData = getBadgeData(dealState)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [ratingValue, setRatingValue] = useState(0)
  // 별점 제출 여부 상태 추가
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false)

  // 별점 제출 여부 확인 쿼리 (선택적)
  const { data: ratingExists, isLoading: isCheckingRating } =
    useCheckRatingExists(boardId, dealState === 'COMPLETED')

  // 별점 제출 여부 확인 결과를 상태에 반영
  useEffect(() => {
    if (ratingExists) {
      setIsRatingSubmitted(ratingExists)
    }
  }, [ratingExists])

  // 상태변경 mutation 훅
  const { mutate: changeBoardStatus, isPending: isStatusChangePending } =
    useChangeBoardStatus()

  // 별점 제출 mutation 훅
  const { mutate: submitRating, isPending: isRatingPending } = useRatingBoard()

  // 각 status 마다 버튼 다르게 하기
  const showProgressBtn = dealState === 'REQUEST'
  const showCompletedBtn = dealState === 'IN_PROGRESS'
  const showRatingBtn =
    dealState === 'COMPLETED' && !isRatingSubmitted && !isCheckingRating

  // 상태 변경 핸들러
  const handleChangeStatus = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    changeBoardStatus({ boardId, currentStatus: dealState })
  }

  // 별점 제출 핸들러
  const handleSubmitRating = () => {
    submitRating(
      {
        boardId,
        rating: ratingValue,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false)
          // 별점 제출 완료 상태로 변경
          setIsRatingSubmitted(true)
          // 성공 알림
          toast.success('별점이 성공적으로 제출되었습니다!')
        },
        onError: (error) => {
          // 오류 처리
          toast.error(
            `별점 제출 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
          )
        },
      },
    )
  }

  // 이벤트 전파 방지 핸들러
  const handleStopPropagation = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <CardContainer>
      <Link to={`/board/${boardId}`}>
        <Badge title={badgeData.title} color={badgeData.color} />
        <ContentContainer>
          <div className="flex-1">
            {/* 제목, 채팅 수 */}
            <TitleContainer>
              <Text variant="body1" weight="regular">
                {title}
              </Text>
              {chatCount !== 0 && (
                <span className="flex flex-row gap-1 items-center">
                  <ChatBubbleSolid
                    color={colors.gray}
                    width="1rem"
                    height="1rem"
                  />
                  <Text variant="caption1" weight="regular" color="gray">
                    {chatCount}
                  </Text>
                </span>
              )}
            </TitleContainer>
            {/* 날짜, 시간 */}
            <div className="mt-1">
              <Text variant="caption2" weight="regular" color="gray">
                {formatDateTime(createdAt)}
              </Text>
            </div>
          </div>
          {/* 사진 */}
          {thumbnailUrl && (
            <ThumbnailImage src={thumbnailUrl} alt="thumbnail" />
          )}
        </ContentContainer>
      </Link>

      {isMyProfile && (
        <StatusContainer>
          {/* 조립요청 -> 진행중 버튼 */}
          {showProgressBtn && (
            <StatusBtn
              className="bg-[#e3edf3]"
              onClick={handleChangeStatus}
              disabled={isStatusChangePending}
            >
              <Text variant="caption1" weight="bold" className="text-[#146695]">
                진행중으로 바꾸기
              </Text>
            </StatusBtn>
          )}
          {/* 진행중 -> 거래 완료 버튼 */}
          {showCompletedBtn && (
            <StatusBtn
              className="bg-[#edebeb]"
              onClick={handleChangeStatus}
              disabled={isStatusChangePending}
            >
              <Text variant="caption1" weight="bold" className="text-[#535353]">
                거래 완료로 바꾸기
              </Text>
            </StatusBtn>
          )}
          {/* 거래완료 -> 별점 남기기 버튼 및 모달 */}
          {showRatingBtn && (
            <StopPropagationWrapper onClick={handleStopPropagation}>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <StatusBtn
                    className="text-darkKiwi bg-pay"
                    disabled={isStatusChangePending}
                  >
                    <Text variant="caption1" weight="bold">
                      별점 남기기
                    </Text>
                  </StatusBtn>
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
                    <ReviewStars
                      value={ratingValue}
                      onChange={setRatingValue}
                    />
                    <SubmitButton
                      onClick={handleSubmitRating}
                      disabled={isRatingPending}
                    >
                      {isRatingPending ? '제출 중...' : '확인'}
                    </SubmitButton>
                  </RatingContainer>
                </DialogContent>
              </Dialog>
            </StopPropagationWrapper>
          )}
          {/* 별점이 제출된 경우 제출 완료 메시지 표시 (선택 사항) */}
          {dealState === 'COMPLETED' && isRatingSubmitted && (
            <Text variant="caption1" color="gray" className="text-center mt-2">
              별점이 제출되었습니다
            </Text>
          )}
        </StatusContainer>
      )}
    </CardContainer>
  )
}
