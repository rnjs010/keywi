import { Text } from '@/styles/typography'
import tw from 'twin.macro'

const Container = tw.div`
  w-full
`
const TitleWrapper = tw.div`
  flex items-center mb-4 gap-4
`

const WordWrapper = tw.div`
  flex flex-wrap gap-2
`

const WordItem = tw.div`
  border border-littleGray rounded-full px-3 py-1
`

// 추천 검색어 더미 데이터
const recommendedSearches = [
  '하이피치',
  '키긱',
  '키캡',
  '기판',
  '클리어',
  '오테뮤',
  'CRUSH80',
  'WAVE75',
  '오스메',
]

export default function SearchRecommend() {
  return (
    <Container>
      <TitleWrapper>
        <Text variant="body1" weight="bold">
          추천 검색어
        </Text>
        <Text variant="caption1" color="littleGray">
          최근 검색어 기반으로 골라봤어요.
        </Text>
      </TitleWrapper>
      <WordWrapper>
        {recommendedSearches.map((word) => (
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
