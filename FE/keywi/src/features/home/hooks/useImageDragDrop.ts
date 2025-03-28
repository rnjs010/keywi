//SECTION - 이미지 업로드 관련 함수
import useImageStore from '@/stores/homeStore'
import { useState, useRef, useEffect } from 'react'

export default function useImageDragDrop(maxImages: number = 5) {
  const { images, setImages } = useImageStore()
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

    // 최대 이미지까지 제한
    const filesToProcess = Math.min(files.length, maxImages - images.length)

    // 파일이 없으면 함수 종료
    if (filesToProcess === 0) return

    let processedCount = 0

    // 최대 이미지까지 제한
    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i]
      const reader = new FileReader()

      reader.onloadend = () => {
        newImages.push(reader.result as string)
        processedCount++

        // 모든 이미지 로드 완료시 상태 업데이트 (zustand 스토어)
        if (processedCount === filesToProcess) {
          const updatedImages = [...images, ...newImages]
          setImages(updatedImages) // Zustand 스토어 업데이트
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
    setImages(updatedImages) // Zustand 스토어 업데이트
    setShowLimitWarning(false)
  }

  // 이미지 순서 변경 핸들러
  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const newImages = [...images]
    const draggedImage = newImages[dragIndex]

    newImages.splice(dragIndex, 1)
    newImages.splice(hoverIndex, 0, draggedImage)

    setImages(newImages) // Zustand 스토어 업데이트
  }

  return {
    images,
    setImages,
    showLimitWarning,
    fileInputRef,
    isMobile,
    handleImageUploadClick,
    handleFileChange,
    removeImage,
    moveImage,
  }
}
