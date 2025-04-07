import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { HomeFeedProfileProps } from '@/interfaces/HomeInterfaces'
import { useFollowMutation } from '../../hooks/useFeedInteractions'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useFeedStore } from '@/stores/homeStore'
import { useUserStore } from '@/stores/userStore'

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
const FollowButton = styled.button`
  ${tw`
  py-1 
  px-1
  text-kiwi
  `}
`

export default function HomeFeedProfile({
  username,
  profileImage,
  description,
  isFollowing: initialIsFollowing,
  authorId,
}: HomeFeedProfileProps) {
  const navigate = useNavigate()
  const { toggleFollow } = useFeedStore()
  const followMutation = useFollowMutation()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const currentUserId = useUserStore((state) => state.userId)

  // 내 피드인지 확인
  const isOwnFeed = currentUserId === authorId

  const handleProfileClick = () => {
    navigate(`/profile/${authorId}`)
  }

  // 팔로우 토글 관련
  useEffect(() => {
    setIsFollowing(initialIsFollowing)
  }, [initialIsFollowing])

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing) // ui 업뎃
    toggleFollow(authorId) // zustand 상태 변경
    followMutation.mutate(authorId) // api 호출 및 피드 업데이트
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
      {!isOwnFeed && (
        <FollowButton
          onClick={handleFollowToggle}
          disabled={followMutation.isPending}
        >
          <Text color="kiwi" variant="body1" weight="bold">
            {isFollowing ? '팔로잉' : '팔로우'}
          </Text>
        </FollowButton>
      )}
    </ProfileContainer>
  )
}
