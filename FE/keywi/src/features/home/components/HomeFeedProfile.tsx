import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { HomeFeedProfileProps } from '@/interfaces/HomeInterfaces'
import { useEffect, useState } from 'react'

const ProfileContainer = tw.div`
  flex
  items-center
  justify-between
  w-full
  py-3
`

const ProfileInfo = tw.div`
  flex
  items-center
  gap-3
`

const ProfileImage = tw.img`
  w-11
  h-11
  rounded-full
  object-cover
`

const UserInfo = tw.div`
  flex
  flex-col
  gap-0.5
`

const FollowButton = tw.button`
  py-1
  px-1
`
export default function HomeFeedProfile({
  username,
  profileImage,
  description,
  isFollowing: initialIsFollowing,
  onFollowToggle,
}: HomeFeedProfileProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)

  // props 값이 변경되면 상태 업데이트
  useEffect(() => {
    setIsFollowing(initialIsFollowing)
  }, [initialIsFollowing])

  const handleFollowToggle = () => {
    const newFollowingState = !isFollowing
    setIsFollowing(newFollowingState)

    // 상위 컴포넌트에 상태 변경 알림 (백엔드 연동 시 사용 아마 zustand?)
    if (onFollowToggle) {
      onFollowToggle(newFollowingState)
    }
  }

  return (
    <ProfileContainer>
      <ProfileInfo>
        <ProfileImage src={profileImage} alt={`${username}의 프로필 이미지`} />
        <UserInfo>
          <Text variant="caption1" weight="bold">
            {username}
          </Text>
          <Text variant="caption2" color="darkGray">
            {description}
          </Text>
        </UserInfo>
      </ProfileInfo>
      <FollowButton onClick={handleFollowToggle}>
        <Text color="kiwi" variant="body1" weight="bold">
          {isFollowing ? '팔로잉' : '팔로우'}
        </Text>
      </FollowButton>
    </ProfileContainer>
  )
}
