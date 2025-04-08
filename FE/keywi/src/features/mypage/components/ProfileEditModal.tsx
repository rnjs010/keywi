import tw from 'twin.macro'
import LoadingMessage from '@/components/message/LoadingMessage'
import { useProfileEdit } from '../hooks/useProfileEdit'
import ProfileForm from '@/features/login/components/ProfileForm'
import HeaderText from '@/features/login/components/ProfileHeaderText'
import ProfileImageInput from '@/features/login/components/ProfileImageInput'
import ProfileNameInput from '@/features/login/components/ProfileNameInput'
import ProfileNextBtn from '@/features/login/components/ProfileNextBtn'

const ModalContainer = tw.div`
  fixed inset-0 bg-white flex items-center justify-center z-50
`

const ModalContent = tw.div`
  bg-white w-full max-w-md rounded-lg overflow-hidden
`

interface ProfileEditModalProps {
  onClose: () => void
}

export default function ProfileEditModal({ onClose }: ProfileEditModalProps) {
  const {
    nickname,
    setNickname,
    profileImage,
    setProfileImage,
    error,
    isLoading,
    handleSave,
  } = useProfileEdit()

  if (isLoading && !nickname && !profileImage) {
    return <LoadingMessage />
  }

  const handleSubmit = async () => {
    await handleSave()
    onClose()
  }

  return (
    <ModalContainer onClick={onClose}>
      <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <ProfileForm
          header={<HeaderText title="프로필 수정" />}
          imageInput={
            <ProfileImageInput
              imageUrl={profileImage}
              onImageChange={setProfileImage}
            />
          }
          nameInput={
            <ProfileNameInput
              nickname={nickname}
              onNicknameChange={setNickname}
            />
          }
          actionButton={
            <ProfileNextBtn
              text="저장하기"
              onClick={handleSubmit}
              disabled={nickname.length < 2}
              error={error}
              isLoading={isLoading}
            />
          }
        />
      </ModalContent>
    </ModalContainer>
  )
}
