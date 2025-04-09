import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { HomeFeedTextProps } from '@/interfaces/HomeInterfaces'

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
  flex
  flex-wrap
  gap-1
`
const HashTag = tw.span`
  text-kiwi
`
const TimeStamp = tw.div`
  mt-0.5
`

export default function HomeFeedText({
  content,
  hashtags,
  timeAgo,
}: HomeFeedTextProps) {
  return (
    <Container>
      <TextContent>{content}</TextContent>
      <HashTagWrapper>
        {hashtags.map((tag, index) => (
          <HashTag key={index}>
            <Text variant="caption1" color="kiwi">
              #{typeof tag === 'object' ? tag : tag}
            </Text>
          </HashTag>
        ))}
      </HashTagWrapper>
      <TimeStamp>
        <Text variant="caption2" color="gray">
          {timeAgo}
        </Text>
      </TimeStamp>
    </Container>
  )
}
