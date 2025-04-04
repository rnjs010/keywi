//SECTION - 상품 태그 관련 함수
import { useState } from 'react'
import { ProductItem, ProductTag } from '@/interfaces/HomeInterfaces'
import useImageStore from '@/stores/homeStore'

export default function useProductTag() {
  const { productTags, addProductTag, removeProductTag } = useImageStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 상품태그 추가 버튼 클릭
  const handleTagButtonClick = () => {
    setIsModalOpen(true)
  }

  // 상품 선택 핸들러
  const handleSelectProduct = (product: ProductItem) => {
    // 중앙에 새 태그 추가
    const newTag: ProductTag = {
      id: product.itemId,
      name: product.itemName,
      price: `${product.price.toLocaleString()}원`,
      x: 50, // 중앙에 위치
      y: 50, // 중앙에 위치
      thumbnail: product.imageUrl,
    }

    addProductTag(newTag)
    setIsModalOpen(false)
  }

  // 직접 입력 상품 추가 핸들러
  const handleWriteProduct = (productName: string) => {
    // 중앙에 새 태그 추가
    const newTag: ProductTag = {
      id: -1,
      name: productName,
      price: '-원', // 가격 없이 "-원"으로 표시
      x: 50, // 중앙에 위치
      y: 50, // 중앙에 위치
      thumbnail: '/default/default_product.png', // 기본 이미지 사용
    }

    addProductTag(newTag)
  }

  // 태그 제거 핸들러
  const handleRemoveTag = (tagId: number) => removeProductTag(tagId)

  return {
    productTags,
    isModalOpen,
    setIsModalOpen,
    handleTagButtonClick,
    handleSelectProduct,
    handleRemoveTag,
    handleWriteProduct,
  }
}
