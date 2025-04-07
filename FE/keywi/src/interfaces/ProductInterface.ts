// 상품 리스트
export interface ProductProps {
  productId: number
  categoryId: string
  subCategoryId?: string | null
  categoryName?: string | null
  productName: string
  price: number
  productUrl: string
  productImage: string
  manufacturer: string
  descriptions?: string | null
  isFavorite?: boolean
}
