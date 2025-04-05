import { Text } from '@/styles/typography'
import { useNavigate } from 'react-router-dom'
import tw from 'twin.macro'
import { useRecent } from '../hooks/useRecent'

const Container = tw.div`
  w-full
`
const TitleWrapper = tw.div`
  flex justify-between items-center mb-4
`
const ClearBtn = tw.button`
`
const WordWrapper = tw.div`
  flex flex-wrap gap-2
`
const WordItem = tw.div`
  border border-littleGray rounded-full px-3 py-1
`
const EmptyState = tw.div`
  text-center py-2
`

export default function SearchRecent() {
  const navigate = useNavigate()
  const { recentKeywords, deleteAllRecentKeywords } = useRecent()

  // 검색어 클릭 핸들러
  const handleKeywordClick = (keyword: string) => {
    navigate(`/search/${keyword}`)
  }

  return (
    <Container>
      <TitleWrapper>
        <Text variant="body1" weight="bold">
          최근 검색어
        </Text>
        <ClearBtn onClick={deleteAllRecentKeywords}>
          <Text variant="caption1" color="kiwi">
            모두 지우기
          </Text>
        </ClearBtn>
      </TitleWrapper>
      {recentKeywords.length > 0 ? (
        <WordWrapper>
          {recentKeywords.map((item, index) => (
            <WordItem
              key={`${item}-${index}`}
              onClick={() => handleKeywordClick(item)}
            >
              <Text variant="caption1" color="darkGray">
                {item}
              </Text>
            </WordItem>
          ))}
        </WordWrapper>
      ) : (
        <EmptyState>
          <Text variant="caption1" color="littleGray">
            최근 검색어가 없습니다
          </Text>
        </EmptyState>
      )}
    </Container>
  )
}
