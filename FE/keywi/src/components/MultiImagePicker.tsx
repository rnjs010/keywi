import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import tw from 'twin.macro'

interface MultiImagePickerProps {
  visible: boolean
  onPickerClose: () => void
}

const HiddenInput = tw.input`
  hidden
`

const MultiImagePicker: React.FC<MultiImagePickerProps> = ({
  visible,
  onPickerClose,
}) => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 컴포넌트가 마운트되거나 visible 상태가 변경될 때 파일 선택 창 열기
  React.useEffect(() => {
    if (visible && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [visible])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    // 파일 선택 후 처리
    if (files && files.length > 0) {
      // 선택한 이미지 정보를 state로 관리하는 대신
      // 라우터의 state로 전달하여 HomeWritePage에서 사용
      const selectedFiles = Array.from(files).slice(0, 5) // 최대 5개까지 제한

      // 파일 객체는 직접 전달할 수 없으므로 URL로 변환
      const imageUrls = selectedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
        size: file.size,
      }))

      // 이미지 선택 후 HomeWritePage로 이동
      navigate('/home/write', { state: { images: imageUrls } })
    } else {
      // 선택을 취소한 경우
      onPickerClose()
    }

    // 입력 요소 초기화 (같은 파일을 다시 선택할 수 있도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <HiddenInput
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      accept="image/*"
      multiple
    />
  )
}

export default MultiImagePicker
