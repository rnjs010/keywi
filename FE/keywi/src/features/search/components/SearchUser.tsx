import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Text } from '@/styles/typography'
import { Link } from 'react-router-dom'

const Container = tw.div`
  flex
  flex-col
  p-4
`

const UserItem = styled(Link)`
  ${tw`
    flex
    items-center
    py-3
  `}
`

const ProfileImage = tw.img`
  w-12
  h-12
  rounded-full
  bg-gray
  object-cover
  mr-4
`

const UserInfo = tw.div`
  flex
  flex-col
  flex-1
`

const Username = tw.div`
  font-medium
  text-base
`

const Description = tw.div`
  text-xs
  text-gray
  mt-1
`

const SubscriptionBadge = tw.span`
  bg-kiwi
  text-kiwi
  text-xs
  px-2
  py-0.5
  rounded
  ml-2
`

const EmptyContainer = tw.div`
  w-full 
  py-12
  flex 
  justify-center 
  items-center
`

// 사용자 타입 정의
export interface User {
  id: number
  username: string
  profileImage: string
  description: string
  subscription?: string
}

interface SearchUserProps {
  users: User[]
}

export default function SearchUser({ users }: SearchUserProps) {
  if (!users || users.length === 0) {
    return (
      <EmptyContainer>
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      </EmptyContainer>
    )
  }

  return (
    <Container>
      {users.map((user) => (
        <UserItem key={user.id} to={`/user/${user.id}`}>
          <ProfileImage src={user.profileImage} alt={user.username} />
          <UserInfo>
            <div className="flex items-center">
              <Username>{user.username}</Username>
              {user.subscription && (
                <SubscriptionBadge>{user.subscription}</SubscriptionBadge>
              )}
            </div>
            <Description>{user.description}</Description>
          </UserInfo>
        </UserItem>
      ))}
    </Container>
  )
}
