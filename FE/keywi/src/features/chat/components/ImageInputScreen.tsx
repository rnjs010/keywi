import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { useRef, useState } from 'react'
import { useChatStore } from '@/stores/ChatStore'
import { colors } from '@/styles/colors'
import { Camera, Xmark } from 'iconoir-react'
import MainButton from '@/components/MainButton'

const Container = tw.div`
  fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col p-4
`

const HeaderContainer = tw.div`
  relative flex justify-center items-center
`

const Content = tw.div`
  flex-1 flex flex-col gap-4 my-4
`

const ImageContainer = tw.div`
  w-full aspect-square rounded-md bg-littleGray flex items-center justify-center overflow-hidden relative border border-gray
`

const DeleteImage = tw.button`
  absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center
`

const CameraButton = tw.button`
  flex flex-col items-center gap-2
`

const FileInput = tw.input`
  hidden
`
export default function ImageInputScreen() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resetState = useChatStore((state) => state.resetState)
  const selectedImage = useChatStore((state) => state.selectedImage)
  const setSelectedImage = useChatStore((state) => state.setSelectedImage)
  const [disabled, setDisabled] = useState(true)

  // 파일 선택 핸들러 (단일 선택)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSelectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }

    setDisabled(false)
  }

  const handleDeleteImage = () => {
    setSelectedImage(null)

    if (fileInputRef.current) {
      setDisabled(true)
      fileInputRef.current.value = ''
    }
  }

  // 이미지 전송 처리
  const handleSend = async () => {
    resetState()
  }

  const handleClose = () => {
    resetState()
  }

  return (
    <>
      <Container>
        <HeaderContainer>
          <div className="absolute left-0">
            <Xmark onClick={handleClose} />
          </div>
          <Text variant="title3" weight="bold" color="black">
            사진 선택
          </Text>
        </HeaderContainer>

        <Content>
          <ImageContainer>
            {selectedImage ? (
              <>
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
                <DeleteImage onClick={handleDeleteImage}>
                  <Xmark color={colors.white} />
                </DeleteImage>
              </>
            ) : (
              <CameraButton onClick={handleSelectImage}>
                <Camera height="3rem" width="3rem" color={colors.kiwi} />
                <Text variant="body1" weight="regular" color="darkGray">
                  사진을 선택하세요
                </Text>
              </CameraButton>
            )}
          </ImageContainer>
        </Content>

        <MainButton text="전송하기" onClick={handleSend} disabled={disabled} />

        <FileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Container>
    </>
  )
}
