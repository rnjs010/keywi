import tw from 'twin.macro'
import { Text } from '@/styles/typography'
// import { HomeFeedProfileProps } from '@/interfaces/HomeInterfaces'

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
//TODO - 백 연결 후 tanstackquery 사용해서 불러오기
const profileImage = 'https://cataas.com/cat'
const username = '옹시미키위러버얍'
const description = '키보드와 고양이를 사랑하는 중'
const isFollowing = false

export default function HomeFeedProfile() {
  return (
    <ProfileContainer>
      <ProfileInfo>
        <ProfileImage src={profileImage} alt={'프로필 이미지'} />
        <UserInfo>
          <Text variant="caption1" weight="bold">
            {username}
          </Text>
          <Text variant="caption2" color="darkGray">
            {description}
          </Text>
        </UserInfo>
      </ProfileInfo>
      <FollowButton>
        <Text color="kiwi" variant="body1" weight="bold">
          {isFollowing ? '팔로잉' : '팔로우'}
        </Text>
      </FollowButton>
    </ProfileContainer>
  )
}
