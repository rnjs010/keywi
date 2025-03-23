import HeaderIcons from '@/components/HeaderIcons'
import NavBar from '@/components/NavBar'
import { useParams } from 'react-router-dom'
import tw from 'twin.macro'
import { NavArrowLeft } from 'iconoir-react'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden
`

const HeaderContainer = tw.div`
  flex justify-between items-center py-4 px-4
`

const ScrollArea = tw.div`
  flex-1 overflow-y-auto px-4
`

export default function BoardDetailPage() {
  const { postId } = useParams()

  return (
    <Container>
      {/* SECTION - 헤더 영역 */}
      <HeaderContainer>
        <NavArrowLeft />
        <HeaderIcons />
      </HeaderContainer>
      {/* SECTION - 게시글 상세 영역 */}
      <ScrollArea></ScrollArea>
      <NavBar />
    </Container>
  )
}
