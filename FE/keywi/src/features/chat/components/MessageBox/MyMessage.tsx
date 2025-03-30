import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { Message } from '@/interfaces/ChatInterfaces'
import { TEXT } from 'react-dnd-html5-backend/dist/NativeTypes'
import DealMessage from './DealMessage'

const Container = tw.div`
  flex items-end mb-4 justify-end
`

export default function MyMessage({
  content,
  formattedTime,
  messageType,
}: Message) {
  return (
    <Container>
      <div className="flex items-end gap-2">
        <Text variant="caption3" weight="regular" color="littleGray">
          {formattedTime}
        </Text>
        {messageType === 'TEXT' ? (
          <div className="py-1 px-4 rounded-3xl bg-kiwi">
            <Text variant="body1" weight="regular" color="white">
              {content}
            </Text>
          </div>
        ) : (
          <DealMessage />
        )}
      </div>
    </Container>
  )
}
