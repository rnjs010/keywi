import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { Plus, Send } from 'iconoir-react'

const Container = tw.div`
  flex items-center gap-2 px-4 pt-2 pb-6 sticky bottom-0
`

const InputBox = tw.div`
  bg-[#f5f5f8] rounded-full px-4 py-2 flex items-center
`

export default function ChatRoomSendBox() {
  return (
    <Container>
      <Plus height="3rem" width="3rem" color={colors.darkGray} />
      <InputBox>
        <input
          type="text"
          placeholder="메시지 보내기"
          className="bg-transparent outline-none text-[#303337]"
        />
      </InputBox>
      <Send height="2rem" width="2rem" color={colors.darkGray} />
    </Container>
  )
}
