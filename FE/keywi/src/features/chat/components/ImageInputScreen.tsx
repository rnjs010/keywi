import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { useRef, useState } from 'react'
import { useChatStore } from '@/stores/ChatStore'

const ImagesContainer = tw.div`
  flex flex-row items-center gap-2 pt-3
`

const ImagePreviewWrapper = tw.div`
  inline-flex gap-2 overflow-x-auto px-2 py-3
`

const ImagePreviewContainer = tw.div`
  relative w-20 h-20 rounded-md object-cover shrink-0
`

const FileInput = tw.input`
  hidden
`

const FullscreenPreview = tw.div`
  fixed inset-0 bg-black flex flex-col
`

const PreviewImage = tw.img`
  flex-1 object-contain max-w-full max-h-[calc(100vh-60px)] mx-auto
`

const SendButton = tw.button`
  fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg
`

export default function ImageInputScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const setShowImage = useChatStore((state) => state.setShowImage)

  // 파일 선택 핸들러 (단일 선택)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setSelectedFile(file)
      }
      reader.readAsDataURL(file)
    }
  }

  // 이미지 전송 처리
  const handleUpload = async () => {
    // if (!selectedFile) return

    setShowImage(false)

    // const formData = new FormData()
    // formData.append('image', selectedFile)

    // try {
    //   const response = await fetch('/api/upload', {
    //     method: 'POST',
    //     body: formData,
    //   })
    //   // 전송 성공 처리
    // } catch (error) {
    //   console.error('Upload failed:', error)
    // }
  }

  return (
    <>
      <FullscreenPreview>
        <SendButton onClick={handleUpload}>전송</SendButton>

        <PreviewImage src={selectedImage} alt="Selected preview" />

        <button
          className="fixed top-4 left-4 text-white"
          onClick={() => setSelectedImage(null)}
        >
          ← 다시 선택
        </button>

        {!selectedImage && (
          <div className="flex justify-center items-center min-h-screen">
            <FileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        )}
      </FullscreenPreview>
    </>
  )
}
