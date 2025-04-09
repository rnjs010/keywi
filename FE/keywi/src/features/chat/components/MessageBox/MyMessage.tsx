import DealMessage from './DealMessage'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { ChatMessage } from '@/interfaces/ChatInterfaces'
import { formatChatTime } from '@/utils/formatChatTime'

const Container = tw.div`
  flex items-end mb-4 justify-end
`

export default function MyMessage({
  messageId,
  content,
  sentAt,
  messageType,
}: ChatMessage) {
  return (
    <Container>
      <div className="flex items-end gap-2">
        <Text variant="caption3" weight="regular" color="littleGray">
          {formatChatTime(sentAt)}
        </Text>
        {messageType === 'TEXT' ? (
          <div className="py-1 px-4 rounded-3xl bg-kiwi">
            <Text variant="body1" weight="regular" color="white">
              {content}
            </Text>
          </div>
        ) : messageType === 'IMAGE' ? (
          <div className="rounded-lg overflow-hidden max-w-[240px]">
            <img
              src={content ?? ''}
              alt="Sent image"
              className="w-full h-auto object-cover"
            />
          </div>
        ) : (
          <DealMessage
            messageId={messageId}
            messageType={messageType}
            content={content ?? ''}
            isMine={true}
          />
        )}
      </div>
    </Container>
  )
}
