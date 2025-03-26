import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { ShopFourTilesWindow, ChatBubble, ProfileCircle } from 'iconoir-react'
import { PiClipboardText } from 'react-icons/pi'
import { IoHomeOutline } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'

const NavContainer = tw.div`
  flex justify-between items-center px-4 pt-3 pb-8 border-t border-t-[#EEEEEE]
`

export default function NavBar() {
  const navActiveStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? colors.default : colors.darkGray,
  })

  return (
    <NavContainer>
      {/* Home */}
      <NavLink to="/" style={navActiveStyle}>
        <IoHomeOutline size="2rem" />
      </NavLink>

      {/* Product */}
      <NavLink to="/" style={navActiveStyle}>
        <ShopFourTilesWindow width="2rem" height="2rem" />
      </NavLink>

      {/* Board */}
      <NavLink to="/board" style={navActiveStyle}>
        <PiClipboardText size="2rem" />
      </NavLink>

      {/* Chat */}
      <NavLink to="/" style={navActiveStyle}>
        <ChatBubble width="2rem" height="2rem" />
      </NavLink>

      {/* Profile */}
      <NavLink to="/pay" style={navActiveStyle}>
        <ProfileCircle width="2rem" height="2rem" />
      </NavLink>
    </NavContainer>
  )
}
