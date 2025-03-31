import tw from 'twin.macro'
import BoardCard from '@/features/board/components/BoardCard'

const ListContainer = tw.div`
  flex flex-col px-4
`

const EmptyContainer = tw.div`
  w-full 
  py-12
  flex 
  justify-center 
  items-center
`

interface Quote {
  id: number
  status: string
  title: string
  authorNickname: string
  date: string
  chatCount?: number
  thumbnailUrl: string
}

interface MypageBoardProps {
  quotes: Quote[]
}

export default function MypageBoard({ quotes }: MypageBoardProps) {
  if (quotes.length === 0) {
    return (
      <EmptyContainer>
        <p className="text-gray">견적 내역이 없습니다.</p>
      </EmptyContainer>
    )
  }

  return (
    <ListContainer>
      {quotes.map((quote) => (
        <BoardCard
          key={quote.id}
          id={quote.id}
          status={quote.status}
          title={quote.title}
          authorNickname={quote.authorNickname}
          date={quote.date}
          chstCount={quote.chatCount}
          thumbnailUrl={quote.thumbnailUrl}
        />
      ))}
    </ListContainer>
  )
}
