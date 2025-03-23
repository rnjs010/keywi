//SECTION - Header에 있는 아이콘 (찜, 북마크, 알림)
import tw from 'twin.macro'
import { Star, Bookmark, Bell } from 'iconoir-react'

const IconContainer = tw.div`
  flex gap-4
`

export default function HeaderIcons() {
  return (
    <IconContainer>
      <Star />
      <Bookmark />
      <Bell />
    </IconContainer>
  )
}
