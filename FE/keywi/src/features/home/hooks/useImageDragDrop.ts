//SECTION - 이미지 업로드 관련 함수
import useImageStore from '@/stores/homeStore'
import { useState, useRef, useEffect } from 'react'

export default function useImageDragDrop(maxImages: number = 5) {
  const { images, imageFiles, setImages, setImageFiles } = useImageStore()
  const [showLimitWarning, setShowLimitWarning] = useState(false)
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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newImages: string[] = []
    const newFiles: File[] = []

    // 최대 이미지까지 제한
    const filesToProcess = Math.min(files.length, maxImages - images.length)

    // 파일이 없으면 함수 종료
    if (filesToProcess === 0) return

    let processedCount = 0

    // 최대 이미지까지 제한
    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i]
      newFiles.push(file)

      const reader = new FileReader()

      reader.onloadend = () => {
        newImages.push(reader.result as string)
        processedCount++

        // 모든 이미지 로드 완료시 상태 업데이트 (zustand 스토어)
        if (processedCount === filesToProcess) {
          const updatedImages = [...images, ...newImages]
          const updatedFiles = [...imageFiles, ...newFiles]
          setImages(updatedImages) // Zustand 스토어 업데이트
          setImageFiles(updatedFiles)
        }
      }

      reader.readAsDataURL(file)
    }

    // 파일 입력 필드 초기화 (같은 파일 다시 선택 가능)
    if (event.target) {
      event.target.value = ''
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
