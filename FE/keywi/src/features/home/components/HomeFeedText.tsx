import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import styled from '@emotion/styled'

const Container = tw.div`
  px-4
  pt-3
`

const TextContent = styled.div`
  white-space: pre-line; /* 줄바꿈 유지 */
  line-height: 1.2; /* 줄 간격 더 좁게 조정 */
  font-size: 0.875rem; /* caption1과 동일한 크기 유지 */
  margin-bottom: 2px;
`

const HashTagWrapper = tw.div`
  text-wrap
`

const TimeStamp = tw.div`
  mt-0.5
`

const text =
  '키위에서 이번에 새로 맞춘 키보드랑 한 컷\n고수님이 상세하게 견적 주셔서 원하는 키보드 겟 해버려따~'

export default function HomeFeedText() {
  return (
    <Container>
      <TextContent>{text}</TextContent>
      <HashTagWrapper>
        <Text variant="caption1" color="kiwi">
          #바다소금축
        </Text>
      </HashTagWrapper>
      <TimeStamp>
        <Text variant="caption2" color="gray">
          3일 전
        </Text>
      </TimeStamp>
    </Container>
  )
}
