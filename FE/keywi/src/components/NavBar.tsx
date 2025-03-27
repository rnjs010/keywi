import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { ShopFourTilesWindow, ChatBubble, ProfileCircle } from 'iconoir-react'
import { PiClipboardText } from 'react-icons/pi'
import { IoHomeOutline } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'

const NavContainer = tw.div`
  flex justify-between items-center px-7 pt-3 pb-9 border-t border-t-[#EEEEEE]
`

export default function NavBar() {
  const navActiveStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? colors.default : colors.darkGray,
  })

  return (
    <NavContainer>
      {/* Home */}
      <NavLink to="/home" style={navActiveStyle}>
        <IoHomeOutline size="1.7rem" />
      </NavLink>

      {/* Product */}
      <NavLink to="/" style={navActiveStyle}>
        <ShopFourTilesWindow width="1.7rem" height="1.7rem" />
      </NavLink>

      {/* Board */}
      <NavLink to="/board" style={navActiveStyle}>
        <PiClipboardText size="1.7rem" />
      </NavLink>

      {/* Chat */}
      <NavLink to="/pay" style={navActiveStyle}>
        <ChatBubble width="1.7rem" height="1.7rem" />
      </NavLink>

      {/* Profile */}
      <NavLink to="/" style={navActiveStyle}>
        <ProfileCircle width="1.7rem" height="1.7rem" />
      </NavLink>
    </NavContainer>
  )
}
