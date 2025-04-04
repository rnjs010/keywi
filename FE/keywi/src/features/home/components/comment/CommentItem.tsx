import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { CommentProps } from '@/interfaces/HomeInterfaces'

const Container = tw.div`
  flex
  px-5
  py-3
  items-center
`

const ProfileImage = tw.img`
  w-11
  h-11
  rounded-full
  object-cover
  mr-3
  flex-shrink-0
`

const ContentWrapper = tw.div`
  flex-1
`

const UsernameRow = tw.div`
  flex
  items-center
  gap-2
`

export default function CommentItem({ comment }: CommentProps) {
  //TODO - 추후개발, 댓글 멘션
  // 멘션된 사용자가 있으면 해당 부분을 강조 표시 - 추후개발
  // const renderContent = () => {
  //   if (comment.mentionedUser) {
  //     const mentionText = `@${comment.mentionedUser}`
  //     if (comment.content.startsWith(mentionText)) {
  //       const remainingText = comment.content.substring(mentionText.length)
  //       return (
  //         <CommentText>
  //           <span className="mention">{mentionText}</span>
  //           {remainingText}
  //         </CommentText>
  //       )
  //     }
  //   }
  //   return <CommentText>{comment.content}</CommentText>
  // }

  // comment에서 필요한 속성 추출
  const { username, profileImage, content, timeAgo } = comment

  return (
    <Container>
      <ProfileImage src={profileImage} alt={`${username}의 프로필`} />
      <ContentWrapper>
        <UsernameRow>
          <Text variant="caption1" weight="bold">
            {username}
          </Text>
          <Text variant="caption1" color="gray">
            {timeAgo}
          </Text>
        </UsernameRow>
        <Text variant="body1">{content}</Text>
      </ContentWrapper>
    </Container>
  )
}
