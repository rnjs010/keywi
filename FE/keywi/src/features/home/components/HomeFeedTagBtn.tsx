import tw from 'twin.macro'
import styled from '@emotion/styled'
import { PinSolid } from 'iconoir-react'
import { colors } from '@/styles/colors'

const ToggleButton = styled.button`
  ${tw`
    absolute
    left-4
    bottom-4
    z-10
    flex
    items-center
    justify-center
    w-8
    h-8
    rounded-full
    bg-white
    shadow-md
    transition-opacity
    duration-200
  `}
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`

interface TagToggleButtonProps {
  onClick: () => void
}

export default function HomeFeedTagBtn({ onClick }: TagToggleButtonProps) {
  return (
    <ToggleButton onClick={onClick}>
      <PinSolid width={16} height={16} color={colors.kiwi} />
    </ToggleButton>
  )
}
