import { Text } from '@/styles/typography'
import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Plus, Send, MediaImagePlus, Wallet } from 'iconoir-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useChatImageStore } from '@/stores/chatStore'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useState } from 'react'
import { useUserStore } from '@/stores/userStore'
import { WebSocketContext } from '@/services/WebSocketProvider'

const Container = tw.div`
  flex items-center justify-between px-4 pt-2 pb-3
`

const InputBox = styled.textarea`
  ${tw`bg-[#f5f5f8] rounded-full px-4 py-2 w-72 h-10 items-center`}

  &::-webkit-scrollbar {
    display: none;
  }
`

const IconCircle = tw.div`
  w-10 h-10 rounded-full flex items-center justify-center
`

export default function ChatRoomSendBox() {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const setShowImage = useChatImageStore((state) => state.setShowImage)

  const handleAddImageClick = () => {
    setShowImage(true)
  }

  const handleDealRequestClick = () => {
    navigate(`/chat/${roomId}/dealrequest`)
  }

  const [message, setMessage] = useState('')
  const { client, isConnected } = useContext(WebSocketContext)
  const userId = useUserStore((state) => state.userId)
  const sendMessage = () => {
    if (!message.trim() || !isConnected || !roomId) return

    if (client?.connected && roomId && userId) {
      client.publish({
        destination: '/app/chat/message',
        body: JSON.stringify({
          roomId,
          messageType: 'TEXT',
          content: message.trim(),
          items: null,
          senderId: userId,
        }),
        headers: {
          'X-User-ID': userId?.toString() || '',
        },
      })
    }

    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
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
          <DropdownMenuItem onClick={handleAddImageClick}>
            <IconCircle className="bg-[#F0D61B]">
              <MediaImagePlus color={colors.white} />
            </IconCircle>
            <Text variant="body1" weight="regular" color="darkGray">
              사진 첨부
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

      <InputBox
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지 보내기"
        className="bg-transparent outline-none text-[#303337]"
      />
      <Send
        height="1.6rem"
        width="1.5rem"
        color={colors.darkGray}
        onClick={sendMessage}
      />
    </Container>
  )
}
