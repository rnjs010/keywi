import tw from 'twin.macro'
import HeaderSearch from '@/components/HeaderSearch'
import { ArrowLeft } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'

const HeaderContainer = tw.div`
  flex 
  items-center
  px-4
  z-10
  w-full
  py-4
`
const BackBtn = tw.button`
  pr-4
  py-2
`

export function SearchHeader() {
  const navigate = useNavigate()

  // 뒤로가기
  const handleBack = () => navigate(-1)
  return (
    <HeaderContainer>
      <BackBtn onClick={handleBack}>
        <ArrowLeft width={'1.3rem'} height={'1.3rem'} />
      </BackBtn>
      <HeaderSearch height={'2.5rem'} />
    </HeaderContainer>
  )
}
