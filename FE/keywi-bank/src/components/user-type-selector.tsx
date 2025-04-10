import tw from 'twin.macro'
import styled from '@emotion/styled'

const Container = tw.div`mb-8`
const Label = tw.span`block w-full mb-4 text-blue-800 font-semibold text-[30px] text-left`
const ButtonGroup = tw.div`flex gap-4 flex-wrap`

const SelectButton = styled.button<{ selected: boolean }>`
  ${tw`px-4 py-2 rounded-lg font-semibold border transition-colors duration-200`}
  ${({ selected }) =>
    selected
      ? tw`rounded-lg bg-blue-600 text-white border-blue-600 hover:bg-blue-700`
      : tw`rounded-lg bg-white text-blue-600 border-blue-300 hover:bg-blue-100`}
`

interface UserTypeSelectorProps {
  userType: string
  setUserType: (type: string) => void
}

export function UserTypeSelector({
  userType,
  setUserType,
}: UserTypeSelectorProps) {
  return (
    <Container>
      <Label>사용자 선택</Label>
      <ButtonGroup>
        <SelectButton
          selected={userType === '조립자(혜원)'}
          onClick={() => setUserType('조립자(혜원)')}
        >
          조립자(혜원)
        </SelectButton>
        <SelectButton
          selected={userType === '구매자(규리)'}
          onClick={() => setUserType('구매자(규리)')}
        >
          구매자(규리)
        </SelectButton>
        <SelectButton
          selected={userType === '플랫폼(키위)'}
          onClick={() => setUserType('플랫폼(키위)')}
        >
          플랫폼(키위)
        </SelectButton>
      </ButtonGroup>
    </Container>
  )
}
