import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { Message } from '@/interfaces/ChatInterfaces'
import DealMessage from './DealMessage'

const Container = tw.div`
  flex items-start mb-4 gap-2
`

const ThumbnailImage = tw.img`
    w-[2rem] h-[2rem] rounded-full object-cover
`

export default function OpponentMessage({
  senderProfileUrl,
  content,
  formattedTime,
  messageType,
}: Message) {
  return (
    <Container>
      <ThumbnailImage src={senderProfileUrl} alt="thumbnail" />
      <div className="flex items-end gap-2">
        {messageType === 'TEXT' ? (
          <div className="py-1 px-4 rounded-3xl bg-[#F2F3F6]">
            <Text variant="body1" weight="regular" color="black">
              {content}
            </Text>
          </div>
        ) : (
          <DealMessage />
        )}
        <Text variant="caption3" weight="regular" color="littleGray">
          {formattedTime}
        </Text>
      </div>
    </Container>
  )
}
