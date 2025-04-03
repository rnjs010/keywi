import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Text } from '@/styles/typography'
import { Link } from 'react-router-dom'
import Badge from '@/components/Badge'
import getDangdoBadgeData from '@/utils/getDandoBadgeData'
import { UserSearchResult } from '@/interfaces/SearchInterface'

const Container = tw.div`
  flex
  flex-col
  px-4
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
  mr-3
`
const UserInfo = tw.div`
  flex
  flex-col
  flex-1
`
const EmptyContainer = tw.div`
  w-full 
  py-12
  flex 
  justify-center 
  items-center
`

// 사용자 타입 정의
interface SearchUserProps {
  users: UserSearchResult[]
}

export default function SearchUser({ users }: SearchUserProps) {
  if (!users || users.length === 0) {
    return (
      <EmptyContainer>
        <p className="text-gray">검색 결과가 없습니다.</p>
      </EmptyContainer>
    )
  }

  return (
    <Container>
      {users.map((user) => (
        <UserItem key={user.userId} to={`/user/${user.userId}`}>
          <ProfileImage src={user.profileImageUrl} alt={user.nickname} />
          <UserInfo>
            <div className="flex items-center gap-2">
              <Text variant="body1">{user.nickname}</Text>
              <Badge
                title={`당도 ${user.brix}`}
                color={getDangdoBadgeData(user.brix || 16) || 'gray'}
                size="small"
              />
            </div>
            <Text variant="caption1" color="gray">
              {user.profileContent}
            </Text>
          </UserInfo>
        </UserItem>
      ))}
    </Container>
  )
}
