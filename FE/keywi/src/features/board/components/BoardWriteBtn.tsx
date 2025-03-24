import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { Plus } from 'iconoir-react'
import { colors } from '@/styles/colors'
import { useNavigate } from 'react-router-dom'

const WriteBtnContainer = tw.button`
  fixed bottom-24 right-4 flex flex-row items-center rounded-full pl-2 py-2 pr-3 bg-default
`

export default function BoardWriteBtn() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/board/write') // 버튼 클릭 시 /board/write로 이동
  }

  return (
    <WriteBtnContainer onClick={handleClick}>
      <Plus color={colors.white} width="1.5rem" height="1.5rem" />
      <Text variant="body1" weight="regular" color="white">
        글쓰기
      </Text>
    </WriteBtnContainer>
  )
}
