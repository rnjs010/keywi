import { createBoardPost } from '@/features/board/services/boardService'
import { useBoardProductStore } from '@/stores/boardStore'
import { useState } from 'react'

export function useBoardWrite() {
  const { title, content, images, selectedProducts, resetState } =
    useBoardProductStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 게시글 작성 요청
  const submitBoard = async () => {
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 입력해주세요.')
      return
    }

    // 카테고리 ID와 상품 ID 추출
    const categoryIds: number[] = []
    const productIds: number[] = []

    Object.values(selectedProducts).forEach((product) => {
      categoryIds.push(product.categoryId)
      productIds.push(product.productId)
    })

    // formData 생성 (multipart/form-data 형식으로 데이터를 전송할 때 사용)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    categoryIds.forEach((id) => formData.append('categoryIds', id.toString()))
    productIds.forEach((id) => formData.append('productIds', id.toString()))
    images.forEach((file) => formData.append('images', file)) // File[]

    try {
      setIsLoading(true)
      setError(null)

      await createBoardPost(formData)
      resetState()
      return true
    } catch (err) {
      setError('게시글 등록에 실패했습니다.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { submitBoard, isLoading, error }
}
