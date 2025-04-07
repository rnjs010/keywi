import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { HomeFeedProfileProps } from '@/interfaces/HomeInterfaces'
import { useFollowMutation } from '../../hooks/useFeedInteractions'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useFeedStore } from '@/stores/homeStore'
import styled from '@emotion/styled'

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
const FollowButton = styled.button<{ $isFollowing: boolean }>`
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
  const followMutation = useFollowMutation()
  const { toggleFollow, feeds } = useFeedStore()

  const currentFollowStatus =
    Object.values(feeds).find((feed) => feed.authorId === authorId)
      ?.isFollowing ?? initialIsFollowing

  const handleProfileClick = () => {
    navigate(`/profile/${authorId}`)
  }

  const handleFollowToggle = () => {
    toggleFollow(authorId)
    // 즉시 상태 확인
    setTimeout(() => {
      const state = useFeedStore.getState()
      console.log('팔로우 토글 후:', {
        authorId,
        storeFollowStatus: Object.values(state.feeds).find(
          (f) => f.authorId === authorId,
        )?.isFollowing,
      })
    }, 0)
    followMutation.mutate(authorId)
  }

  useEffect(() => {
    console.log('currentFollowStatus 변경됨:', currentFollowStatus)
  }, [currentFollowStatus])

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
        $isFollowing={currentFollowStatus}
        onClick={handleFollowToggle}
        disabled={followMutation.isPending}
      >
        <Text color="kiwi" variant="body1" weight="bold">
          {currentFollowStatus ? '팔로잉' : '팔로우'}
        </Text>
      </FollowButton>
    </ProfileContainer>
  )
}
