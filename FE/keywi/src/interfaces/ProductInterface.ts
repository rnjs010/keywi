// 상품 리스트
export interface ProductProps {
  productId: number
  thumbnailUrl: string
  manufacturer: string
  productName: string
  price: number
  isFavorite?: boolean
}
