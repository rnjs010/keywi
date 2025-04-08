import Badge from '@/components/Badge'
import { Text } from '@/styles/typography'
import getDangdoBadgeData from '@/utils/getDandoBadgeData'
import tw from 'twin.macro'
import { useMypageProfile } from '../hooks/useMypageProfile'
import ProfileEditModal from './ProfileEditModal'
import { useState } from 'react'

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
  mt-3 ml-1
`

const ButtonsContainer = tw.div`
  flex w-full gap-2 mt-4
`

const ProfileButton = tw.button`
  py-2 rounded-md flex-1 flex justify-center items-center bg-input
`

interface MypageProfileProps {
  userId: number
  isMyProfile: boolean
}

export default function MypageProfile({
  userId,
  isMyProfile,
}: MypageProfileProps) {
  const { data: profileInfo, isLoading, error } = useMypageProfile(userId)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // 로딩 중이면 로딩 메시지 표시
  if (isLoading) {
    console.log('isLoading')
    // return <LoadingMessage />
  }

  // 데이터가 없거나 오류가 발생했을 때 처리
  if (!profileInfo || error) {
    return <Text variant="caption1">데이터를 찾을 수 없어요</Text>
  }

  const {
    nickname,
    profileImageUrl,
    brix,
    profileContent,
    followerCount,
    followingCount,
    buildCount,
  } = profileInfo

  return (
    <>
      <ProfileContainer>
        <ProfileSection>
          <ProfileImageContainer>
            <ProfileImage
              src={profileImageUrl}
              alt={`${nickname}의 프로필 이미지`}
            />
          </ProfileImageContainer>

          <ProfileInfoContainer>
            <NicknameContainer>
              <Text variant="body2" weight="bold">
                {nickname}
              </Text>
              <Badge
                title={`당도 ${brix}`}
                color={getDangdoBadgeData(brix) || 'low'}
              />
            </NicknameContainer>

            <StatsContainer>
              <StatItem>
                <Text variant="caption1" color="darkGray">
                  팔로워
                </Text>
                <Text variant="caption1" weight="bold">
                  {followerCount}
                </Text>
              </StatItem>
              <StatItem>
                <Text variant="caption1" color="darkGray">
                  팔로잉
                </Text>
                <Text variant="caption1" weight="bold">
                  {followingCount}
                </Text>
              </StatItem>
              <StatItem>
                <Text variant="caption1" color="darkGray">
                  조립
                </Text>
                <Text variant="caption1" weight="bold">
                  {buildCount}
                </Text>
              </StatItem>
            </StatsContainer>
          </ProfileInfoContainer>
        </ProfileSection>

        <DescriptionContainer>
          <Text variant="caption1">{profileContent}</Text>
        </DescriptionContainer>
        {isMyProfile && (
          <ButtonsContainer>
            <ProfileButton onClick={() => setIsEditModalOpen(true)}>
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
        )}
      </ProfileContainer>

      {/* 프로필 수정 모달 */}
      {isEditModalOpen && (
        <ProfileEditModal onClose={() => setIsEditModalOpen(false)} />
      )}
    </>
  )
}
