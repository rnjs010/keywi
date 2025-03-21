import Badge from '@/components/Badge'
import SubHeader from '@/components/SubHeader'
import tw from 'twin.macro'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen px-4 box-border overflow-x-hidden
`

const ScrollArea = tw.div`
  flex-1 overflow-y-auto
`

const Box = tw.div`
  h-10 bg-red-200
`

export default function BoardPage() {
  return (
    <Container>
      <SubHeader title="견적게시판" />
      <Badge title="조립요청" color="red" />
      <Badge title="진행중" color="blue" />
      <Badge title="조립완료" color="gray" />
      <ScrollArea>
        {/* 스크롤 될 영역 */}
        <div className="h-60 bg-blue-200">sdfsdfsaf</div>
        <div className="h-80 bg-green-200"></div>
        <div className="h-40 bg-yellow-200"></div>
        <div className="h-60 bg-purple-200"></div>
        <div className="h-80 bg-gray"></div>
        <div className="h-40 bg-pink-200"></div>
        <div className="h-60 bg-indigo-200"></div>
        <div className="h-80 bg-orange-200"></div>
      </ScrollArea>
      <Box>NavBar 영역</Box>
    </Container>
  )
}
