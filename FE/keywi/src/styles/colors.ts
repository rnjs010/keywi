export const colors = {
  // text
  darkKiwi: '#4C7A0D',
  kiwi: '#70C400',
  lightKiwi: '#D6E8BE',
  black: '#000000', // main 이 아니라 black 으로 표시함
  darkGray: '#6D6D6D',
  gray: '#B7B7B7',
  littleGray: '#DBDBDB',
  white: '#FFFFFF',
  // background
  input: '#F7F7F7',
  img: 'rgba(0, 0, 0, 0.2)',
  modal: 'rgba(0, 0, 0, 0.5)', // tag랑 같이 쓰기
  pay: 'rgba(218, 237, 193, 0.3)',
  info: '#DAEDC1',
  // button
  default: '#70C400',
  hover: '#7ED40C',
  disabled: '#DAEDC1',
  pressed: '#579700',
} as const

export type ColorName = keyof typeof colors
