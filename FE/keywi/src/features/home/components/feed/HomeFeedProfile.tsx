import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { HomeFeedProfileProps } from '@/interfaces/HomeInterfaces'
import { useFollowMutation } from '../../hooks/useFeedInteractions'
import { useNavigate } from 'react-router-dom'

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
  isFollowing,
  authorId,
}: HomeFeedProfileProps) {
  const navigate = useNavigate()
  const followMutation = useFollowMutation()

  const handleProfileClick = () => {
    navigate(`/profile/${authorId}`)
  }

  const handleFollowToggle = () => {
    followMutation.mutate(authorId)
  }

  return (
    <ProfileContainer>
      <ProfileInfo>
        <ProfileImage
          src={profileImage}
          alt={`${username}의 프로필 이미지`}
          onClick={handleProfileClick}
        />
        <UserInfo>
          <Text variant="caption1" weight="bold">
            {username}
          </Text>
          <Text variant="caption2" color="darkGray">
            {description}
          </Text>
        </UserInfo>
      </ProfileInfo>
      <FollowButton
        $isFollowing={isFollowing}
        onClick={handleFollowToggle}
        disabled={followMutation.isPending}
      >
        <Text color="kiwi" variant="body1" weight="bold">
          {isFollowing ? '팔로잉' : '팔로우'}
        </Text>
      </FollowButton>
    </ProfileContainer>
  )
}
