//SECTION - 피드 작성 버튼 : 클릭하면 바로 앨범 진입
import { Plus } from 'iconoir-react'
import { useState } from 'react'
import tw from 'twin.macro'
import MultiImagePicker from './MultiImagePicker'

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
  const [showPicker, setShowPicker] = useState(false)

  const handleButtonClick = () => {
    setShowPicker(true)
  }

  const handlePickerClose = () => {
    setShowPicker(false)
  }

  return (
    <>
      <Container>
        <RoundBtn onClick={handleButtonClick}>
          <Plus width={36} height={36} color="white" strokeWidth={2} />
        </RoundBtn>
      </Container>
      <MultiImagePicker
        visible={showPicker}
        onPickerClose={handlePickerClose}
      />
    </>
  )
}
