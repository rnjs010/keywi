import tw from 'twin.macro'
import { ShopFourTilesWindow, ChatBubble, ProfileCircle } from 'iconoir-react'
import { PiClipboardText } from 'react-icons/pi'
import { IoHomeOutline } from 'react-icons/io5'
import { colors } from '@/styles/colors'
import { NavLink } from 'react-router-dom'

const NavContainer = tw.div`
  flex justify-between items-center px-4 pt-3 pb-8 border-t border-t-gray
`

export default function NavBar() {
  return (
    <NavContainer>
      {/* Home */}
      <NavLink
        to="/"
        style={({ isActive }) => ({
          color: isActive ? colors.default : colors.darkGray,
        })}
      >
        <IoHomeOutline size="2rem" />
      </NavLink>

      {/* Product */}
      <NavLink
        to="/"
        style={({ isActive }) => ({
          color: isActive ? colors.default : colors.darkGray,
        })}
      >
        <ShopFourTilesWindow width="2rem" height="2rem" />
      </NavLink>

      {/* Board */}
      <NavLink
        to="/board"
        style={({ isActive }) => ({
          color: isActive ? colors.default : colors.darkGray,
        })}
      >
        <PiClipboardText size="2rem" />
      </NavLink>

      {/* Chat */}
      <NavLink
        to="/"
        style={({ isActive }) => ({
          color: isActive ? colors.default : colors.darkGray,
        })}
      >
        <ChatBubble width="2rem" height="2rem" />
      </NavLink>

      {/* Profile */}
      <NavLink
        to="/"
        style={({ isActive }) => ({
          color: isActive ? colors.default : colors.darkGray,
        })}
      >
        <ProfileCircle width="2rem" height="2rem" />
      </NavLink>
    </NavContainer>
  )
}
