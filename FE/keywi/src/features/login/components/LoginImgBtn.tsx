import tw from 'twin.macro'
import { Camera } from 'iconoir-react'
import { colors } from '@/styles/colors'
import styled from '@emotion/styled'
import { useRef } from 'react'
import { useSignupStore } from '@/stores/signupStore'

// 프로필 이미지 섹션
const ProfileImgSection = tw.div`
  flex
  items-center
  justify-center
  pt-20
  `

// 프로필 이미지 업로드 버튼
const ImageUploadBtn = styled.div<{ $hasImage: boolean }>`
  ${tw`
    flex
    items-center
    justify-center
    w-40
    h-40
    rounded-full
    overflow-hidden
    cursor-pointer
  `}
  background-color: ${(props) =>
    props.$hasImage ? 'transparent' : colors.default};
  background-size: cover;
  background-position: center;
`

// 파일 입력 필드 (숨김)
const FileInput = tw.input`
  hidden
`

export default function LoginImgBtn() {
  const { profileImage, setProfileImage } = useSignupStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 프로필 이미지 버튼 클릭 핸들러
  const handleImageBtnClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // 파일 선택 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 선택된 이미지를 Data URL로 변환
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <ProfileImgSection>
      <ImageUploadBtn
        onClick={handleImageBtnClick}
        $hasImage={profileImage !== null}
        style={{
          backgroundImage: profileImage ? `url(${profileImage})` : 'none',
        }}
      >
        {!profileImage && (
          <Camera
            width={'5rem'}
            height={'5rem'}
            strokeWidth={1}
            color={colors.white}
            name="camera"
          />
        )}
      </ImageUploadBtn>
      <FileInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        // capture="environment" // 모바일에서 카메라 접근 허용 (optional)
      />
    </ProfileImgSection>
  )
}
