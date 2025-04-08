import tw from 'twin.macro'
import { Camera } from 'iconoir-react'
import { colors } from '@/styles/colors'
import styled from '@emotion/styled'
import { useRef } from 'react'
import { compressImage } from '@/utils/imageCompression'

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

interface ProfileImageInputProps {
  imageUrl: string | null
  onImageChange: (imageUrl: string, file?: File) => void
}

export default function ProfileImageInput({
  imageUrl,
  onImageChange,
}: ProfileImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 프로필 이미지 버튼 클릭 핸들러
  const handleImageBtnClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // 파일 선택 핸들러
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        // 원본 파일 정보 저장
        const originalFileName = file.name
        const originalFileType = file.type

        // 이미지 압축 적용
        const compressedFile = await compressImage(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800, // 해상도
          initialQuality: 0.9, // 품질 유지
        })

        // 압축된 파일에 원본 이름 유지
        const fileWithOriginalName = new File(
          [compressedFile],
          originalFileName, // 원본 파일명 사용
          { type: originalFileType }, // 원본 타입 사용
        )

        console.log('원본 파일:', file.name, file.type, file.size)
        console.log(
          '압축 파일:',
          fileWithOriginalName.name,
          fileWithOriginalName.type,
          fileWithOriginalName.size,
        )

        // 압축된 이미지를 Data URL로 변환
        const reader = new FileReader()
        reader.onloadend = () => {
          onImageChange(reader.result as string, fileWithOriginalName)
        }
        reader.readAsDataURL(fileWithOriginalName)

        // 파일 input 초기화 (같은 파일 다시 선택 가능하도록)
        event.target.value = ''
      } catch (error) {
        console.error('이미지 처리 중 오류 발생:', error)
        // 오류 발생 시에도 원본 이미지 사용
        const reader = new FileReader()
        reader.onloadend = () => {
          onImageChange(reader.result as string, file)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  return (
    <ProfileImgSection>
      <ImageUploadBtn
        onClick={handleImageBtnClick}
        $hasImage={imageUrl !== null}
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
        }}
      >
        {!imageUrl && (
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
      />
    </ProfileImgSection>
  )
}
