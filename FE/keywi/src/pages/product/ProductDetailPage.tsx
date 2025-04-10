import HeaderIcons from '@/components/HeaderIcons'
import NavBar from '@/components/NavBar'
import ProductDescription from '@/features/product/component/ProductDescription'
import { NavArrowLeft } from 'iconoir-react'
import { useLocation, useNavigate } from 'react-router-dom'
import tw from 'twin.macro'

const Container = tw.div`
  w-full 
  max-w-screen-sm 
  mx-auto 
  flex 
  flex-col 
  h-screen 
  box-border 
  overflow-x-hidden
`
const HeaderContainer = tw.div`
  p-4
  flex
  justify-between
  items-center
  z-10
`
const NavBarContainer = tw.div`
  fixed
  bottom-0
  left-0
  right-0
  bg-white
  z-10
  max-w-screen-sm
  mx-auto
  w-full
`

export default function ProductDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // 전달받은 state에서 카테고리 정보 추출
  const { category, subCategory } = location.state || {}
  console.log(category, subCategory)

  // 뒤로가기 핸들러
  const handleBack = () => {
    if (location.state?.category) {
      navigate(location.state.category)
    } else {
      const fromFeed = location.state?.fromFeed === true

      if (fromFeed) {
        navigate('/home', { state: { fromFeed: true } })
      } else {
        navigate(-1) // 또는 navigate('/')
      }
    }
  }

  return (
    <Container>
      <HeaderContainer>
        <NavArrowLeft width="1.875rem" height="1.875rem" onClick={handleBack} />
        <HeaderIcons />
      </HeaderContainer>
      <ProductDescription />
      <NavBarContainer>
        <NavBar />
      </NavBarContainer>
    </Container>
  )
}
