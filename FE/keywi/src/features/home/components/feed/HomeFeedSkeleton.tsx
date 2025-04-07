//NOTE - 홈 로딩중 skeleton 화면
import { Skeleton } from '@/components/ui/skeleton'
import tw from 'twin.macro'

const Container = tw.div`
  w-full
  mb-6
`

const ProfileContainer = tw.div`
  flex
  items-center
  justify-between
  w-full
  py-3
  px-4
`

const ProfileInfo = tw.div`
  flex
  items-center
  gap-3
`

const UserInfo = tw.div`
  flex
  flex-col
  gap-1
`

const ImageContainer = tw.div`
  w-full
  relative
  pb-[100%]
`

const InteractionContainer = tw.div`
  flex
  justify-between
  mx-4
  py-3
`

const ContentContainer = tw.div`
  px-4
  pt-3
`

// 피드 하나의 스켈레톤 컴포넌트
export default function HomeFeedSkeleton() {
  return (
    <Container>
      {/* 프로필 부분 스켈레톤 */}
      <ProfileContainer>
        <ProfileInfo>
          <Skeleton className="w-11 h-11 rounded-full" />
          <UserInfo>
            <Skeleton className="w-28 h-4" />
            <Skeleton className="w-20 h-3" />
          </UserInfo>
        </ProfileInfo>
        <Skeleton className="w-16 h-7" />
      </ProfileContainer>

      {/* 이미지 부분 스켈레톤 */}
      <ImageContainer>
        <Skeleton className="absolute inset-0 w-full h-full" />
      </ImageContainer>

      {/* 좋아요, 댓글 등 상호작용 부분 스켈레톤 */}
      <InteractionContainer>
        <div className="flex gap-3">
          <Skeleton className="w-16 h-6" />
          <Skeleton className="w-16 h-6" />
          <Skeleton className="w-6 h-6" />
        </div>
        <Skeleton className="w-6 h-6" />
      </InteractionContainer>

      {/* 본문 내용 스켈레톤 */}
      <ContentContainer>
        <Skeleton className="w-full h-10 mb-2" />
        <Skeleton className="w-24 h-4 mb-1" />
        <Skeleton className="w-16 h-3" />
      </ContentContainer>
    </Container>
  )
}
