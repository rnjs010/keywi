import { Text } from '@/styles/typography'
import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { Plus, Send, MediaImage, Camera, Wallet } from 'iconoir-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate, useParams } from 'react-router-dom'

const Container = tw.div`
  flex items-center justify-between px-4 pt-2 pb-3
`

const InputBox = tw.div`
  bg-[#f5f5f8] rounded-full px-4 py-2 w-72
`

const IconCircle = tw.div`
  w-10 h-10 rounded-full flex items-center justify-center
`

export default function ChatRoomSendBox() {
  const navigate = useNavigate()
  const { roomId } = useParams()

  const handleDealRequestClick = () => {
    navigate(`/chat/${roomId}/dealrequest`)
  }

  return (
    <Container>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>
            <Plus width="2rem" height="2rem" color={colors.darkGray} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-40">
          <DropdownMenuItem onClick={() => alert('갤러리')}>
            <IconCircle className="bg-[#F0D61B]">
              <MediaImage color={colors.white} />
            </IconCircle>
            <Text variant="body1" weight="regular" color="darkGray">
              갤러리
            </Text>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert('카메라')}>
            <IconCircle className="bg-[#61B2E2]">
              <Camera color={colors.white} />
            </IconCircle>
            <Text variant="body1" weight="regular" color="darkGray">
              카메라
            </Text>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDealRequestClick}>
            <IconCircle className="bg-kiwi">
              <Wallet color={colors.white} />
            </IconCircle>
            <Text variant="body1" weight="regular" color="darkGray">
              거래요청
            </Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InputBox>
        <input
          type="text"
          placeholder="메시지 보내기"
          className="bg-transparent outline-none text-[#303337]"
        />
      </InputBox>
      <Send height="1.6rem" width="1.5rem" color={colors.darkGray} />
    </Container>
  )
}
