import tw from 'twin.macro'
import MypageBoardCard from './MypageBoardCard'
import { useMyBoardList } from '../hooks/useMypageBoard'
import LoadingMessage from '@/components/message/LoadingMessage'
import ErrorMessage from '@/components/message/ErrorMessage'

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

export default function MypageBoard() {
  const { data: quotes, isLoading, error } = useMyBoardList()

  return (
    <>
      {isLoading && <LoadingMessage />}

      {error && <ErrorMessage />}

      {!isLoading && !error && (!quotes || quotes.length === 0) && (
        <EmptyContainer>
          <p className="text-gray">견적 내역이 없습니다.</p>
        </EmptyContainer>
      )}

      <ListContainer>
        {quotes &&
          quotes.map((item) => (
            <MypageBoardCard key={item.boardId} {...item} />
          ))}
      </ListContainer>
    </>
  )
}
