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

    const requestData = {
      title,
      content,
      dealState: 'REQUEST',
      productIds,
      categoryIds,
      images,
    }

    try {
      setIsLoading(true)
      setError(null)

      console.log('📦 게시글 작성 requestData:', requestData)

      await createBoardPost(requestData)
      resetState()
      return true // 성공
    } catch (err) {
      setError('게시글 등록에 실패했습니다.')
      return false // 실패
    } finally {
      setIsLoading(false)
    }
  }

  return { submitBoard, isLoading, error }
}
