import { Text } from '@/styles/typography'
import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { AiOutlineSafety } from 'react-icons/ai'
import { Dialog, DialogContent } from '@/components/ui/dialog'

const ContentBox = tw.div`
  my-2
`

const Title = tw.div`
  flex items-start
`

const IconCircle = tw.div`
  w-20 h-20 rounded-full flex items-center justify-center
`

interface MethodModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function CommissionInfoModal({
  isOpen,
  onOpenChange,
}: MethodModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl w-[calc(100%-32px)] max-w-md mx-auto flex flex-col items-center">
        {/* 내용 */}
        <ContentBox>
          <Title>
            <Text variant="body1" weight="bold">
              안심결제 수수료 안내
            </Text>
          </Title>
          <div className="flex flex-col gap-1">
            <Text variant="caption1" weight="regular" color="darkGray">
              거래 시 발생할 수 있는 문제로부터, 여러분의 소중한 돈을 지켜드리기
              위한 서비스 운영 비용이에요.
            </Text>
            <Text variant="caption1" weight="bold" color="darkGray">
              - 키위 수수료 : 조립 비용의 1%
            </Text>
          </div>
        </ContentBox>

        <ContentBox>
          <Title>
            <Text variant="body1" weight="bold">
              안심결제 수수료는 누가 내나요?
            </Text>
          </Title>
          <Text variant="caption1" weight="regular" color="darkGray">
            안심결제 서비스 이용 수수료는 의뢰자가 부담해요. 조립자는 수수료를
            내지 않아요.
          </Text>
        </ContentBox>

        {/* 이미지 */}
        <IconCircle className="bg-kiwi">
          <AiOutlineSafety size={'4rem'} color={colors.white} />
        </IconCircle>
      </DialogContent>
    </Dialog>
  )
}
