import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { Plus } from 'iconoir-react'
import { colors } from '@/styles/colors'

const WriteBtnContainer = tw.button`
  fixed bottom-24 right-4 flex flex-row items-center rounded-full pl-2 py-2 pr-3 bg-default
`

export default function BoardWriteBtn() {
  return (
    <WriteBtnContainer>
      <Plus color={colors.white} width="1.5rem" height="1.5rem" />
      <Text variant="body1" weight="regular" color="white">
        글쓰기
      </Text>
    </WriteBtnContainer>
  )
}
