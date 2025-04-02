//SECTION - r거래 상태, 당도 표시에 사용되는 Badge
import tw from 'twin.macro'
import { Text } from '@/styles/typography'

const colorStyles = {
  red: 'bg-[#F2D9D5] text-[#AA2E1B]',
  blue: 'bg-[#D5E6F0] text-[#146695]',
  gray: 'bg-[#DBDBDB] text-[#535353]',
  low: 'bg-[#BEE4CE] text-[#53936E]',
  mid: 'bg-[#DFEE95] text-[#80980C]',
  high: 'bg-[#F8EFAC] text-[#CCB300]',
}

const sizeStyles = {
  small: 'px-1.5 py-0.25 text-[10px]',
  medium: 'px-2 py-0.5 text-xs', // 기본 크기
  large: 'px-3 py-1 text-sm',
}

const BadgeContainer = tw.span`
  inline-flex w-fit items-center rounded-full font-medium
`

interface BadgeProps {
  title: string
  color: keyof typeof colorStyles
  size?: keyof typeof sizeStyles
}

export default function Badge({ title, color, size = 'medium' }: BadgeProps) {
  return (
    <BadgeContainer className={`${colorStyles[color]} ${sizeStyles[size]}`}>
      <Text variant="caption2" weight="bold">
        {title}
      </Text>
    </BadgeContainer>
  )
}
