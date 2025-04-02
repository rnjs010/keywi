//SECTION - 메인 버튼 (가로 전체 차지)
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import styled from '@emotion/styled'

interface ButtonProps {
  text: string
  disabled?: boolean
  cancle?: boolean
  onClick?: () => void
  className?: string
}

const StyledButton = styled.button<{ disabled: boolean; cancle: boolean }>`
  ${tw`
    w-full 
    py-3
    rounded-md 
    mb-1
    flex
    items-center
    justify-center
    text-white
  `}
  ${({ disabled }) => (disabled ? tw`bg-disabled` : tw`bg-default`)}
  ${({ cancle }) =>
    cancle ? tw`text-darkKiwi bg-disabled` : tw`text-white bg-default`}
`

export default function MainButton({
  text,
  disabled = false,
  cancle = false,
  onClick,
  className,
}: ButtonProps) {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }

  return (
    <StyledButton
      onClick={handleClick}
      disabled={disabled}
      className={className}
      cancle={cancle}
    >
      {text}
    </StyledButton>
  )
}
