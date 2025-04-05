import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { HomeFeedProfileProps } from '@/interfaces/HomeInterfaces'
import { useEffect, useState } from 'react'
import { useFollowMutation } from '../../hooks/useFeedInteractions'

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
  authorId,
}: HomeFeedProfileProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const followMutation = useFollowMutation()

  // props 값이 변경되면 상태 업데이트
  useEffect(() => {
    setIsFollowing(initialIsFollowing)
  }, [initialIsFollowing])

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing)

    // API 호출
    followMutation.mutate(authorId, {
      onSuccess: (data) => {
        // API 응답으로 정확한 상태로 업데이트
        setIsFollowing(data.followed)
      },
      onError: () => {
        // 실패 시 원상복구
        setIsFollowing(isFollowing)
        console.error('팔로우 처리 중 오류가 발생했습니다.')
      },
    })
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
      <FollowButton
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
