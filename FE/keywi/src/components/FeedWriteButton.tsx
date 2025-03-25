import { Plus } from 'iconoir-react'
import tw from 'twin.macro'

const Container = tw.div`
  fixed
  bottom-24
  right-3
  z-50
`
const RoundBtn = tw.button`
  flex
  items-center
  justify-center
  w-16
  h-16
  rounded-full
  transition-transform
  duration-200
  active:scale-95
  bg-default
`

export default function FeedWriteButton() {
  return (
    <Container>
      <RoundBtn>
        <Plus width={36} height={36} color="white" strokeWidth={2} />
      </RoundBtn>
    </Container>
  )
}
