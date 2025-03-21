//SECTION - r거래 상태, 당도 표시에 사용되는 Badge
import tw from 'twin.macro'
import { Text } from '../styles/typography'

const colorStyles = {
  red: 'bg-[#F2D9D5] text-[#AA2E1B]',
  blue: 'bg-[#D5E6F0] text-[#146695]',
  gray: 'bg-[#DBDBDB] text-[#535353]',
  low: 'bg-[#BEE4CE] text-[#53936E]',
  mid: 'bg-[#DFEE95] text-[#80980C]',
  high: 'bg-[#F8EFAC] text-[#CCB300]',
}

const BadgeContainer = tw.span`
  inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium
`

interface BadgeProps {
  title: string
  color: keyof typeof colorStyles
}

const Badge = ({ title, color }: BadgeProps) => (
  <BadgeContainer className={`${colorStyles[color]}`}>
    <Text variant="caption2" weight="bold">
      {title}
    </Text>
  </BadgeContainer>
)

export default Badge
