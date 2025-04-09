import { Text } from '@/styles/typography'
import { MoreVert, NavArrowLeft } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'
import tw from 'twin.macro'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const HeaderContainer = tw.div`
  flex
  z-10
  items-center
  relative
  h-[3.5rem]
`

const BackButton = tw.button`
  absolute
  left-4
  z-10
`

const MoreButton = tw.button`
  absolute
  right-4
  z-10
`

const TitleContainer = tw.div`
  absolute
  left-0
  right-0
  flex
  justify-center
  w-full
  z-0
`

const NextButton = tw.button`
  absolute
  right-4
  z-10
`

interface NextHeaderProps {
  startTitle: string
  isNextEnabled?: boolean
  onNextClick?: () => void
  endTitle?: string
  more?: boolean
  // 새로운 props
  isMyContent?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export default function NextHeader({
  startTitle,
  isNextEnabled = false,
  onNextClick,
  endTitle,
  more,
  isMyContent = false, // 내 콘텐츠인지 여부
  onEdit,
  onDelete,
}: NextHeaderProps) {
  const navigate = useNavigate()

  // 뒤로가기
  const handleBack = () => navigate(-1)

  return (
    <HeaderContainer>
      <BackButton onClick={handleBack}>
        <NavArrowLeft height={'1.5rem'} width={'1.5rem'} strokeWidth={2} />
      </BackButton>
      <TitleContainer>
        <Text variant="body2" weight="bold">
          {startTitle}
        </Text>
      </TitleContainer>
      {more && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreButton>
              <MoreVert height={'1.5rem'} width={'1.5rem'} strokeWidth={2} />
            </MoreButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isMyContent && (
              <>
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    <Text variant="caption1">수정</Text>
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-red-500 focus:text-red-500"
                  >
                    <Text variant="caption1" color="darkGray">
                      삭제
                    </Text>
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {isNextEnabled && (
        <NextButton
          onClick={isNextEnabled ? onNextClick : undefined}
          disabled={!isNextEnabled}
          className={!isNextEnabled ? 'opacity-50' : ''}
        >
          <Text
            variant="body2"
            weight="bold"
            color={isNextEnabled ? 'kiwi' : 'gray'}
          >
            {endTitle}
          </Text>
        </NextButton>
      )}
    </HeaderContainer>
  )
}
