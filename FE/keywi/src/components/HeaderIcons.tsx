//SECTION - Header에 있는 아이콘 (찜, 북마크, 알림)
import tw from 'twin.macro'
import { Star, Bookmark, Bell } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'

const IconContainer = tw.div`
  flex gap-4
`

export default function HeaderIcons() {
  const navigate = useNavigate()
  return (
    <IconContainer>
      <Star
        onClick={() => {
          navigate('/product/zzim')
        }}
      />
      <Bookmark
        onClick={() => {
          navigate('/home/bookmark')
        }}
      />
      <Bell />
    </IconContainer>
  )
}
