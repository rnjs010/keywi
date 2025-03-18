import tw from 'twin.macro'
import styled from '@emotion/styled'
import { colors, ColorName } from './colors'

export const typography = {
  body1: {
    regular: tw`font-normal text-base`, // 16px
    bold: tw`font-bold text-base`, // 16px
  },
  body2: {
    regular: tw`font-normal text-lg`, // 18px
    bold: tw`font-bold text-lg`, // 18px
  },
  title1: {
    regular: tw`font-normal text-3xl`, // 30px
    bold: tw`font-bold text-3xl`, // 30px
  },
  title2: {
    regular: tw`font-normal text-2xl`, // 24px
    bold: tw`font-bold text-2xl`, // 24px
  },
  title3: {
    regular: tw`font-normal text-xl`, // 20px
    bold: tw`font-bold text-xl`, // 20px
  },
  caption1: {
    regular: tw`font-normal text-sm`, // 14px
    bold: tw`font-bold text-sm`, // 14px
  },
  caption2: {
    regular: tw`font-normal text-xs`, // 12px
    bold: tw`font-bold text-xs`, // 12px
  },
  caption3: {
    regular: tw`font-normal text-[10px]`, // 10px
    bold: tw`font-bold text-[10px]`, // 10px
  },
}

export const Text = styled.span<{
  variant?: keyof typeof typography
  weight?: 'regular' | 'bold'
  color?: ColorName
}>`
  ${({ variant = 'body1', weight = 'regular' }) => typography[variant][weight]}
  ${({ color }) => color && `color: ${colors[color]};`}
  font-family: 'Pretendard';
`
