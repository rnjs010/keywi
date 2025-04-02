import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'
import { TiMinus } from 'react-icons/ti'

const Container = tw.div`
  w-full
`
const TitleWrapper = tw.div`
  flex items-center mb-4 gap-4
`
const ContentWrapper = tw.div`
  mx-2
`
const WordList = tw.div`
  grid grid-cols-2 gap-2
`
const WordItem = tw.div`
  flex items-center py-1 gap-2
`
const Rank = tw.span`
  font-bold text-sm w-[1rem] text-center
`
const Status = tw.div`
  flex items-center w-[1.5rem] justify-center
`

// 인기 검색어 더미 데이터 - 이미지에 맞게 구성
const popularSearches = [
  { rank: 1, term: '나이트 스테빌 V3', status: 'new' },
  { rank: 2, term: 'TUT 버블티', status: 'up' },
  { rank: 3, term: '블루 치즈', status: 'new' },
  { rank: 4, term: '쿼카 아티산', status: 'new' },
  { rank: 5, term: '트랜라', status: 'up' },
  { rank: 6, term: '딸기우유', status: 'same' },
  { rank: 7, term: 'HMX 딥네이비', status: 'new' },
  { rank: 8, term: 'VENOM', status: 'down' },
  { rank: 9, term: '저월백', status: 'down' },
  { rank: 10, term: '세라키 V2', status: 'new' },
]

export default function SearchPopular() {
  // 한국 시간(KST) 기준으로 현재 시간 가져오기
  const getCurrentKoreanHour = () => {
    // 한국 시간은 UTC+9
    const now = new Date()
    const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000)
    return koreanTime.getUTCHours()
  }

  const currentHour = getCurrentKoreanHour()

  return (
    <Container>
      <TitleWrapper>
        <Text variant="body1" weight="bold">
          인기 검색어
        </Text>
        {/* 현재 시 기준으로 보여주기 */}
        <Text variant="caption1" color="littleGray">
          {currentHour}시 기준
        </Text>
      </TitleWrapper>
      <ContentWrapper>
        {/* 상태에 따라 아이콘으로 표시 */}
        <WordList>
          {popularSearches.map((item) => (
            <WordItem key={item.rank}>
              <Rank>{item.rank}</Rank>
              <Status>
                {item.status === 'new' && (
                  <Text variant="caption3" weight="bold" color="kiwi">
                    NEW
                  </Text>
                )}
                {item.status === 'up' && <FaCaretUp style={{ color: 'red' }} />}
                {item.status === 'down' && (
                  <FaCaretDown style={{ color: 'blue' }} />
                )}
                {item.status === 'same' && (
                  <TiMinus style={{ color: 'gray' }} />
                )}
              </Status>
              <Text variant="caption1">{item.term}</Text>
            </WordItem>
          ))}
        </WordList>
      </ContentWrapper>
    </Container>
  )
}
