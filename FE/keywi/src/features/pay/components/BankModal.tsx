import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { BANK_MAP } from '@/utils/bankCodeMapper'

const BankGrid = tw.div`
  grid grid-cols-3 gap-2 py-4
`

const BankItem = tw.div`
  flex flex-col items-center justify-center p-2 cursor-pointer bg-[#EFEFEF] rounded-lg bg-opacity-50
`

const BankLogo = tw.div`
  w-16 h-16 rounded-full flex items-center justify-center mb-2
`

interface BankDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
  onSelectBank?: (bank: string) => void
}

export default function BankModal({
  isOpen,
  onOpenChange,
  trigger,
  onSelectBank,
}: BankDrawerProps) {
  const securities = [
    'DB금융투자',
    'KB증권',
    'NH투자',
    'SK',
    '교보',
    '다올투자증권',
    '대신',
    '메리츠증권',
    '미래에셋',
    '삼성증권',
    '신한투자',
    '유안타증권',
    '유진투자',
    '키움',
    '토스증권',
    '하나증권',
    '하이투자',
    '한국투자',
    '한화투자',
    '현대차증권',
  ]

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <Text variant="title3" weight="bold" color="darkKiwi">
            은행/증권사 선택
          </Text>
        </DrawerHeader>

        <div className="overflow-y-auto h-96 px-4">
          {/* SECTION - 은행 리스트 */}
          <Text variant="body2" weight="bold" color="black">
            은행
          </Text>
          <BankGrid>
            {Object.entries(BANK_MAP).map(([code, { name, logoPath }]) => (
              <BankItem
                key={code}
                onClick={() => onSelectBank && onSelectBank(code)} // 코드 넘겨줌
              >
                <BankLogo>
                  <img
                    src={logoPath}
                    alt={`${name} 로고`}
                    className="w-10 h-10 object-contain"
                  />
                </BankLogo>
                <Text variant="caption1" weight="regular" color="black">
                  {name.replace(/은행$/, '')}
                </Text>
              </BankItem>
            ))}
          </BankGrid>

          {/* SECTION - 증권사 리스트 */}
          <Text variant="body2" weight="bold" color="black">
            증권사
          </Text>
          <BankGrid>
            {securities.map((security) => (
              <BankItem
                key={security}
                disabled={true}
                className="opacity-50 cursor-not-allowed"
              >
                <BankLogo>
                  <img
                    src={`/securities/${security}.png`}
                    alt={`${security} 로고`}
                    className="w-10 h-10 object-contain"
                  />
                </BankLogo>
                <Text variant="caption1" weight="regular" color="black">
                  {security}
                </Text>
              </BankItem>
            ))}
          </BankGrid>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
