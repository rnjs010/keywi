import MainButton from '@/components/MainButton'
import tw from 'twin.macro'

const BtnWrapper = tw.div`
  mt-auto
  mb-16
  w-full
`

export default function CompleteBtn() {
  const handleNext = () => {}

  return (
    <BtnWrapper>
      <MainButton text="다음" disabled={false} onClick={handleNext} />
    </BtnWrapper>
  )
}
