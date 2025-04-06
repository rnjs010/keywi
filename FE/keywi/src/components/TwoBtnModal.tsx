import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { Dialog, DialogContent } from '@/components/ui/dialog-noX'
import MainButton from './MainButton'

const ContentBox = tw.div`
  my-2
`

const Title = tw.div`
  flex items-start mb-2
`

interface ModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  content: string
  cancleText: string
  confirmText: string
  onCancle?: () => void
  onConfirm?: () => void
}

export default function TwoBtnModal({
  isOpen,
  onOpenChange,
  title,
  content,
  cancleText,
  confirmText,
  onCancle,
  onConfirm,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl w-[calc(100%-32px)] max-w-md mx-auto flex flex-col items-center">
        {/* 내용 */}
        <ContentBox>
          <Title>
            <Text variant="body1" weight="bold">
              {title}
            </Text>
          </Title>
          <Text variant="caption1" weight="regular">
            {content}
          </Text>
        </ContentBox>

        {/* 버튼 */}
        <div className="flex flex-row gap-4 w-full">
          <MainButton text={cancleText} onClick={onCancle} cancle={true} />
          <MainButton text={confirmText} onClick={onConfirm} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
