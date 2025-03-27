//SECTION - 피드 작성 버튼 : 피드 작성 페이지로 이동
import { Plus } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

  const handleButtonClick = () => {
    navigate('/home/imgselect')
  }

  return (
    <Container>
      <RoundBtn onClick={handleButtonClick}>
        <Plus width={36} height={36} color="white" strokeWidth={2} />
      </RoundBtn>
    </Container>
  )
}
