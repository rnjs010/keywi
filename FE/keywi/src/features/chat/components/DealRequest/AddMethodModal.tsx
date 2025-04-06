import { EditPencil, Search } from 'iconoir-react'
import { Text } from '@/styles/typography'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import tw from 'twin.macro'
import { colors } from '@/styles/colors'

const MethodButton = tw.button`
  flex items-center gap-4 w-full text-left py-3
`

const TextBox = tw.div`
  flex flex-col flex-1
`

interface MethodModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSelectDirect: () => void
  onSelectSearch: () => void
}

export default function AddMethodModal({
  isOpen,
  onOpenChange,
  onSelectDirect,
  onSelectSearch,
}: MethodModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl w-[calc(100%-32px)] max-w-md mx-auto">
        <DialogHeader className="flex items-start">
          <Text variant="body1" weight="bold">
            상품 추가 방법
          </Text>
        </DialogHeader>
        <div className="flex flex-col">
          <MethodButton onClick={onSelectDirect}>
            <EditPencil height="2rem" width="2rem" color={colors.darkKiwi} />
            <TextBox>
              <Text variant="caption1" weight="bold">
                직접 입력
              </Text>
              <Text variant="caption3" weight="bold" color="gray">
                구매할 상품을 직접 추가할 수 있어요
              </Text>
            </TextBox>
          </MethodButton>
          <MethodButton onClick={onSelectSearch}>
            <Search height="2rem" width="2rem" color={colors.darkKiwi} />
            <TextBox>
              <Text variant="caption1" weight="bold">
                검색 입력
              </Text>
              <Text variant="caption3" weight="bold" color="gray">
                카테고리 별 상품을 검색해서 추가할 수 있어요
              </Text>
            </TextBox>
          </MethodButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}
