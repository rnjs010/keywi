import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { ShopFourTilesWindow, ChatBubble, ProfileCircle } from 'iconoir-react'
import { PiClipboardText } from 'react-icons/pi'
import { IoHomeOutline } from 'react-icons/io5'
import { NavLink, useNavigate } from 'react-router-dom'
import { useUserStore } from '@/stores/userStore'
import { useUserInfo } from '@/features/login/hooks/useUserInfo'
import { useEffect } from 'react'

const NavContainer = tw.div`
  flex justify-between items-center px-7 pt-3 pb-9 border-t border-t-[#EEEEEE]
`

export default function NavBar() {
  const { userId, setUserId } = useUserStore()
  const { userInfo } = useUserInfo()
  const navigate = useNavigate()

  // userId가 없을 때 userInfo에서 가져오기
  useEffect(() => {
    if (!userId && userInfo?.userId) {
      setUserId(userInfo.userId)
    }
  }, [userId, userInfo, setUserId])

  const navActiveStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? colors.default : colors.darkGray,
  })

  // 프로필 클릭 핸들러
  const handleProfileClick = (e: React.MouseEvent) => {
    if (!userId) {
      e.preventDefault()
      // userInfo가 있으면 해당 ID로 이동, 없으면 기본 마이페이지 경로로 이동
      if (userInfo?.userId) {
        navigate(`/profile/${userInfo.userId}`)
      } else {
        // 혹은 로그인 페이지로 리다이렉트하거나 다른 처리
        navigate('/home') // 또는 다른 적절한 페이지
      }
    }
  }

  return (
    <NavContainer>
      {/* Home */}
      <NavLink to="/home" style={navActiveStyle}>
        <IoHomeOutline size="1.7rem" />
      </NavLink>

      {/* Product */}
      <NavLink to="/product" style={navActiveStyle}>
        <ShopFourTilesWindow width="1.7rem" height="1.7rem" />
      </NavLink>

      {/* Board */}
      <NavLink to="/board" style={navActiveStyle}>
        <PiClipboardText size="1.7rem" />
      </NavLink>

      {/* Chat */}
      <NavLink to="/chat" style={navActiveStyle}>
        <ChatBubble width="1.7rem" height="1.7rem" />
      </NavLink>

      {/* Profile */}
      <NavLink
        to={userId ? `/profile/${userId}` : '/'}
        style={navActiveStyle}
        onClick={handleProfileClick}
      >
        <ProfileCircle width="1.7rem" height="1.7rem" />
      </NavLink>
    </NavContainer>
  )
}
