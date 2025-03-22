//SECTION - 마이페이지, 조립게시판, 채팅페이지의 메인에 사용되는 Header
import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { Star, Bookmark, Bell } from 'iconoir-react'

const HeaderContainer = tw.div`
  flex justify-between items-center py-4 px-4
`

const IconContainer = tw.div`
  flex gap-4
`

export default function SubHeader({ title }: { title: string }) {
  return (
    <HeaderContainer>
      {/* NOTE - title은 각 페이지에 맞게 수정 */}
      <Text variant="title3" weight="bold" color="black">
        {title}
      </Text>
      {/* NOTE - 아이콘은 각 페이지에 맞게 수정하려면 컴포넌트화 필요 */}
      <IconContainer>
        <Star />
        <Bookmark />
        <Bell />
      </IconContainer>
    </HeaderContainer>
  )
}
