import { useEffect, useState } from 'react'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { LuDelete } from 'react-icons/lu'
import { colors } from '@/styles/colors'

const KeypadContainer = tw.div`
  grid grid-cols-3 mt-6
`

const KeyButton = tw.button`
  bg-kiwi py-4 flex items-center justify-center
  active:opacity-70 transition-opacity duration-100
`

interface RandomKeyPadProps {
  onKeyPress: (key: string) => void
  onDelete: () => void
  onAllDelete: () => void
  passwordLength: number
}

export default function RandomKeyPad({
  onKeyPress,
  onDelete,
  onAllDelete,
  passwordLength,
}: RandomKeyPadProps) {
  const [keypadNumbers, setKeypadNumbers] = useState<number[]>([])

  useEffect(() => {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const shuffled = numbers.sort(() => 0.5 - Math.random())
    setKeypadNumbers(shuffled)
  }, [])

  return (
    <>
      <KeypadContainer>
        {keypadNumbers.slice(0, 9).map((num) => (
          <KeyButton
            key={num}
            onClick={() => onKeyPress(String(num))}
            disabled={passwordLength >= 6}
          >
            <Text variant="title1" weight="bold" color="white">
              {num}
            </Text>
          </KeyButton>
        ))}
        <KeyButton onClick={onAllDelete}>
          <Text variant="body1" weight="bold" color="white">
            전체삭제
          </Text>
        </KeyButton>
        <KeyButton
          onClick={() => onKeyPress(String(keypadNumbers[9]))}
          disabled={passwordLength >= 6}
        >
          <Text variant="title1" weight="bold" color="white">
            {keypadNumbers[9]}
          </Text>
        </KeyButton>
        <KeyButton onClick={onDelete}>
          <LuDelete size={`2rem`} color={colors.white} />
        </KeyButton>
      </KeypadContainer>
    </>
  )
}
