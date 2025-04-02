import { Text } from '@/styles/typography'
import tw from 'twin.macro'

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

// 최근 검색어 더미 데이터
const recentSearches = ['키보드', '몽글몽글', '저소음축']

export default function SearchRecent() {
  return (
    <Container>
      <TitleWrapper>
        <Text variant="body1" weight="bold">
          최근 검색어
        </Text>
        <ClearBtn>
          <Text variant="caption1" color="kiwi">
            모두 지우기
          </Text>
        </ClearBtn>
      </TitleWrapper>
      <WordWrapper>
        {recentSearches.map((word) => (
          <WordItem>
            <Text variant="caption1" color="darkGray">
              {word}
            </Text>
          </WordItem>
        ))}
      </WordWrapper>
    </Container>
  )
}
