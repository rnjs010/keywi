import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { Camera, XmarkCircleSolid } from 'iconoir-react'
import { colors } from '@/styles/colors'
import { useRef, useState } from 'react'
import { useBoardProductStore } from '@/stores/boardStore'

const ImagesContainer = tw.div`
  flex flex-row items-center gap-2 pt-3
`
const ImageUploadBtn = tw.div`
  flex items-center justify-center min-w-[5rem] min-h-[5rem] rounded-md bg-pay cursor-pointer
`

const ImagePreviewWrapper = tw.div`
  inline-flex gap-2 overflow-x-auto px-2 py-3
`

const ImagePreviewContainer = tw.div`
  relative w-20 h-20 rounded-md object-cover shrink-0
`

const RemoveImageBtn = tw.div`
  absolute -top-2 -right-2 z-50 cursor-pointer bg-white rounded-full
`

// 파일 입력 필드 (숨김)
const FileInput = tw.input`
  hidden
`

export default function WriteImage() {
  const { images, setImages } = useBoardProductStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showLimitText, setShowLimitText] = useState(false)

  // 이미지 업로드 버튼 클릭 핸들러
  const handleImageBtnClick = () => {
    if (images.length >= 5) {
      setShowLimitText(true)
      return
    } else {
      setShowLimitText(false)
    }

    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // 파일 선택 핸들러 (다중 선택)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages: string[] = []

      // 최대 5개 이미지까지 제한
      for (let i = 0; i < Math.min(files.length, 5 - images.length); i++) {
        const file = files[i]
        const reader = new FileReader()

        reader.onloadend = () => {
          newImages.push(reader.result as string)

          // 모든 이미지 로드 완료 시 상태 업데이트
          if (newImages.length === files.length) {
            setImages([...images, ...newImages])
          }
        }

        reader.readAsDataURL(file)
      }
    }
  }

  // 이미지 제거 핸들러
  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove)
    setImages(updatedImages)
  }

  return (
    <>
      <ImagesContainer>
        {/* 이미지 추가 버튼 (5개 미만일 때만 표시) */}
        <ImageUploadBtn
          onClick={handleImageBtnClick}
          disabled={images.length >= 5}
        >
          <Camera
            width={'2rem'}
            height={'2rem'}
            strokeWidth={1.5}
            color={colors.kiwi}
          />
        </ImageUploadBtn>

        {/* 이미지 프리뷰 */}
        <ImagePreviewWrapper>
          {images.map((image, index) => (
            <ImagePreviewContainer key={index}>
              <img
                src={image}
                alt={`uploaded-${index}`}
                className="w-full h-full object-cover rounded-md"
              />
              <RemoveImageBtn onClick={() => handleRemoveImage(index)}>
                <XmarkCircleSolid
                  width="1.5rem"
                  height="1.5rem"
                  color={colors.darkGray}
                />
              </RemoveImageBtn>
            </ImagePreviewContainer>
          ))}
        </ImagePreviewWrapper>

        <FileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
      </ImagesContainer>

      {showLimitText && images.length >= 5 && (
        <Text variant="body2" weight="bold" color="darkKiwi">
          더 이상 이미지를 추가할 수 없습니다.
        </Text>
      )}
    </>
  )
}
