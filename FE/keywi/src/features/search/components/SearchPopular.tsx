import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'
import { TiMinus } from 'react-icons/ti'
import { getCurrentKoreanHour } from '@/utils/getCurrentKoreanHour'
import { useNavigate } from 'react-router-dom'
import { useRank } from '../hooks/useRank'

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
const LoadingWrapper = tw.div`
  w-full flex justify-center items-center py-4
`

export default function SearchPopular() {
  const currentHour = getCurrentKoreanHour()
  const navigate = useNavigate()

  const { data: keywordRanks, isLoading, isError } = useRank()

  // 검색어 클릭 핸들러
  const handleKeywordClick = (keyword: string) => {
    navigate(`/search/${keyword}`)
  }

  // 로딩 중 표시
  if (isLoading) {
    return (
      <Container>
        <TitleWrapper>
          <Text variant="body1" weight="bold">
            인기 검색어
          </Text>
          <Text variant="caption1" color="littleGray">
            {currentHour}시 기준
          </Text>
        </TitleWrapper>
        <LoadingWrapper>
          <Text variant="caption1" color="littleGray">
            검색어 불러오는 중...
          </Text>
        </LoadingWrapper>
      </Container>
    )
  }

  // 에러 처리
  if (isError || !keywordRanks) {
    return (
      <Container>
        <TitleWrapper>
          <Text variant="body1" weight="bold">
            인기 검색어
          </Text>
        </TitleWrapper>
        <ContentWrapper>
          <Text variant="caption1" color="littleGray">
            인기 검색어를 불러올 수 없습니다.
          </Text>
        </ContentWrapper>
      </Container>
    )
  }

  return (
    <Container>
      <TitleWrapper>
        <Text variant="body1" weight="bold">
          인기 검색어
        </Text>
        {/* 현재 시 기준으로 보여주기 - 백 timeBlock 한국시간 기준인지? 업뎃된 시간인지? 물어보기 */}
        <Text variant="caption1" color="littleGray">
          {currentHour}시 기준
        </Text>
      </TitleWrapper>
      <ContentWrapper>
        <WordList>
          {keywordRanks?.map((item) => (
            <WordItem
              key={item.ranking}
              onClick={() => handleKeywordClick(item.keyword)}
            >
              <Rank>{item.ranking}</Rank>
              <Status>
                {item.changeStatus === 'NEW' && (
                  <Text variant="caption3" weight="bold" color="kiwi">
                    NEW
                  </Text>
                )}
                {item.changeStatus === 'UP' && (
                  <FaCaretUp style={{ color: 'red' }} />
                )}
                {item.changeStatus === 'DOWN' && (
                  <FaCaretDown style={{ color: 'blue' }} />
                )}
                {item.changeStatus === 'SAME' && (
                  <TiMinus style={{ color: 'gray' }} />
                )}
              </Status>
              <Text variant="caption1">{item.keyword}</Text>
            </WordItem>
          ))}
        </WordList>
      </ContentWrapper>
    </Container>
  )
}
