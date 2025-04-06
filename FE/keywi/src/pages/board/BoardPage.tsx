import NavBar from '@/components/NavBar'
import SubHeader from '@/components/SubHeader'
import BoardCardList from '@/features/board/components/BoardCardList'
import BoardWriteBtn from '@/features/board/components/BoardWriteBtn'
import tw from 'twin.macro'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden
`

const ScrollArea = tw.div`
  flex-1 overflow-y-auto px-4
`

export default function BoardPage() {
  return (
    <Container>
      <SubHeader title="견적게시판" />
      {/* SECTION -  게시글 리스트 영역 */}
      <ScrollArea>
        <BoardCardList />
      </ScrollArea>
      <NavBar />
      {/* SECTION - 글쓰기 버튼 */}
      <BoardWriteBtn />
    </Container>
  )
}
