import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { Plus, Send } from 'iconoir-react'

const Container = tw.div`
  flex items-center justify-between px-4 pt-2 pb-6
`

const InputBox = tw.div`
  bg-[#f5f5f8] rounded-full px-4 py-2 w-72
`

export default function ChatRoomSendBox() {
  return (
    <Container>
      <Plus width="2rem" height="2rem" color={colors.darkGray} />
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
