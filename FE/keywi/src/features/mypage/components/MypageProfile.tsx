import { Text } from '@/styles/typography'
import tw from 'twin.macro'

const ProfileContainer = tw.div`
  flex flex-col px-4 py-4
`

const ProfileSection = tw.div`
  flex flex-row items-center gap-6
`

const ProfileImageContainer = tw.div`
  relative w-20 h-20 rounded-full overflow-hidden
`

const ProfileImage = tw.img`
  w-full h-full object-cover
`

const ProfileInfoContainer = tw.div`
  flex flex-col justify-center
`

const NicknameContainer = tw.div`
  flex flex-row items-center gap-2 mb-1
`

const StatsContainer = tw.div`
  flex gap-4 mt-1
`

const StatItem = tw.div`
  flex items-center gap-1
`

const DescriptionContainer = tw.div`
  mt-3 ml-2
`

const ButtonsContainer = tw.div`
  flex w-full gap-2 mt-4
`

const ProfileButton = tw.button`
  py-2 rounded-md flex-1 flex justify-center items-center bg-input
`

interface MypageProfileProps {
  nickname: string
  profileImage: string
  // levelBadgeText: string
  followers: number
  following: number
  posts: number
  description?: string
}

export default function MypageProfile({
  nickname,
  profileImage,
  // levelBadgeText,
  followers,
  following,
  posts,
  description,
}: MypageProfileProps) {
  return (
    <ProfileContainer>
      <ProfileSection>
        <ProfileImageContainer>
          <ProfileImage
            src={profileImage}
            alt={`${nickname}의 프로필 이미지`}
          />
        </ProfileImageContainer>

        <ProfileInfoContainer>
          <NicknameContainer>
            <Text variant="body2" weight="bold">
              {nickname}
            </Text>
            {/* <BadgeContainer>{levelBadgeText}</BadgeContainer> */}
          </NicknameContainer>

          <StatsContainer>
            <StatItem>
              <Text variant="caption1" color="darkGray">
                팔로워
              </Text>
              <Text variant="caption1" weight="bold">
                {followers}
              </Text>
            </StatItem>
            <StatItem>
              <Text variant="caption1" color="darkGray">
                팔로잉
              </Text>
              <Text variant="caption1" weight="bold">
                {following}
              </Text>
            </StatItem>
            <StatItem>
              <Text variant="caption1" color="darkGray">
                조립
              </Text>
              <Text variant="caption1" weight="bold">
                {posts}
              </Text>
            </StatItem>
          </StatsContainer>
        </ProfileInfoContainer>
      </ProfileSection>

      {description && (
        <DescriptionContainer>
          <Text variant="caption1">{description}</Text>
        </DescriptionContainer>
      )}

      <ButtonsContainer>
        <ProfileButton>
          <Text variant="caption2" color="darkGray">
            프로필 편집
          </Text>
        </ProfileButton>
        <ProfileButton>
          <Text variant="caption2" color="darkGray">
            프로필 공유
          </Text>
        </ProfileButton>
      </ButtonsContainer>
    </ProfileContainer>
  )
}
