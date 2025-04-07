//SECTION - 이미지 업로드 관련 함수
import useImageStore from '@/stores/homeStore'
import { compressImage, fileToBase64 } from '@/utils/imageCompression'
import { useState, useRef, useEffect } from 'react'

export default function useImageDragDrop(maxImages: number = 5) {
  const { images, imageFiles, setImages, setImageFiles } = useImageStore()
  const [showLimitWarning, setShowLimitWarning] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 모바일 환경 감지
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  }

  // 기본 브라우저 드래그 방지
  useEffect(() => {
    const preventDefaultDragOver = (e: DragEvent) => {
      e.preventDefault()
    }

    document.addEventListener('dragover', preventDefaultDragOver)
    return () => {
      document.removeEventListener('dragover', preventDefaultDragOver)
    }
  }, [])

  // 이미지 업로드 버튼 클릭 핸들러
  const handleImageUploadClick = () => {
    if (images.length >= maxImages) {
      setShowLimitWarning(true)
      return
    }

    setShowLimitWarning(false)
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // 이미지 파일 선택 핸들러 (다중 선택)
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files
    if (!files) return

    const newImages: string[] = []
    const newFiles: File[] = []

    // 최대 이미지까지 제한
    const filesToProcess = Math.min(files.length, maxImages - images.length)

    // 파일이 없으면 함수 종료
    if (filesToProcess === 0) return

    setIsCompressing(true)
    let processedCount = 0

    try {
      // 모든 이미지를 압축하고 처리하는 과정
      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i]

        try {
          // 이미지 압축 - 모바일인 경우 더 많이 압축
          const maxSizeMB = isMobile() ? 0.8 : 1.2
          const compressedFile = await compressImage(file, {
            maxSizeMB,
            maxWidthOrHeight: 1920,
            initialQuality: 0.8,
          })

          // 압축된 파일 추가
          newFiles.push(compressedFile)

          // Base64로 변환하여 미리보기 생성
          const base64 = await fileToBase64(compressedFile)
          newImages.push(base64)

          processedCount++
        } catch (err) {
          console.error(`이미지 ${i + 1} 처리 중 오류:`, err)
        }
      }

      // 모든 이미지 처리 완료 후 상태 업데이트
      if (processedCount > 0) {
        const updatedImages = [...images, ...newImages]
        const updatedFiles = [...imageFiles, ...newFiles]
        setImages(updatedImages)
        setImageFiles(updatedFiles)
      }
    } catch (error) {
      console.error('이미지 처리 중 오류 발생:', error)
    } finally {
      setIsCompressing(false)
      // 파일 입력 필드 초기화
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  // 이미지 제거 핸들러
  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove)
    const updatedFiles = imageFiles.filter(
      (_, index) => index !== indexToRemove,
    )
    setImages(updatedImages) // Zustand 스토어 업데이트
    setImageFiles(updatedFiles)
    setShowLimitWarning(false)
  }

  // 이미지 순서 변경 핸들러
  const moveImage = (dragIndex: number, hoverIndex: number) => {
    // 이미지 미리보기 URL 순서 변경
    const newImages = [...images]
    const draggedImage = newImages[dragIndex]
    newImages.splice(dragIndex, 1)
    newImages.splice(hoverIndex, 0, draggedImage)

    // 이미지 파일 순서도 동일하게 변경
    const newFiles = [...imageFiles]
    const draggedFile = newFiles[dragIndex]
    newFiles.splice(dragIndex, 1)
    newFiles.splice(hoverIndex, 0, draggedFile)

    setImages(newImages) // Zustand 스토어 업데이트
    setImageFiles(newFiles)
  }

  return {
    isCompressing,
    images,
    setImages,
    imageFiles,
    showLimitWarning,
    fileInputRef,
    isMobile,
    handleImageUploadClick,
    handleFileChange,
    removeImage,
    moveImage,
  }
}
