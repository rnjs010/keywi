import HeaderIcons from '@/components/HeaderIcons'
import NavBar from '@/components/NavBar'
import ProductDescription from '@/features/product/component/ProductDescription'
import { NavArrowLeft } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'
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
  return (
    <Container>
      <HeaderContainer>
        <NavArrowLeft
          width={30}
          height={30}
          onClick={() => navigate('/product')}
        />
        <HeaderIcons />
      </HeaderContainer>
      <ProductDescription />
      <NavBarContainer>
        <NavBar />
      </NavBarContainer>
    </Container>
  )
}
