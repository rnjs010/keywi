import apiRequester from '@/services/api'
import { BoardItemUsingInfo } from '@/interfaces/BoardInterface'
import {
  CategoryAllProductResponse,
  ReceiptData,
} from '@/interfaces/ChatInterfaces'

// 카테고리 별 전체 상품 조회 함수
export const getCategoryAllProducts = async (
  categoryId: number,
): Promise<BoardItemUsingInfo[]> => {
  const response = await apiRequester.get<CategoryAllProductResponse>(
    `/api/product/${categoryId}`,
  )

  return response.data.data.map((item) => ({
    categoryId: item.categoryId,
    categoryName: '',
    productId: item.productId,
    productName: item.productName,
    price: item.price,
    imageUrl: item.productImage,
  }))
}

// 카테고리별 검색 상품 조회 함수
interface ProductSearchResponse {
  productId: number
  productName: string
  categoryId: number
  categoryName: string
  price: number
  imageUrl: string | null
  createdAt: string
  searchCount: number | null
}

export const searchProductsDeal = async (
  categoryId: number,
  query: string,
): Promise<BoardItemUsingInfo[]> => {
  const response = await apiRequester.get<ProductSearchResponse[]>(
    '/api/search/board/products/search',
    {
      params: {
        categoryId,
        query,
      },
    },
  )

  return response.data.map((item) => ({
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    productId: item.productId,
    productName: item.productName,
    price: item.price,
    imageUrl: item.imageUrl ?? '',
  }))
}

// 거래 영수증 조회 함수
interface DealReceiptResponse {
  status: string
  message: string
  data: ReceiptData
}

export const getDealReceipt = async (
  messageId: string,
): Promise<ReceiptData> => {
  const response = await apiRequester.get<DealReceiptResponse>(
    `/api/chat/message/${messageId}`,
  )
  console.log('거래 영수증 조회 응답:', response.data)
  return response.data.data
}

// 간편 비밀번호 검증 함수
interface VerifyPasswordRequest {
  userId: number
  rawPassword: string
}

interface VerifyPasswordResponse {
  matched: boolean
}

export const verifyPaymentPassword = async (
  payload: VerifyPasswordRequest,
): Promise<VerifyPasswordResponse> => {
  const response = await apiRequester.post<VerifyPasswordResponse>(
    '/api/payment/payment-password/verify',
    payload,
  )
  return response.data
}

// 계좌 정보 조회 함수
export interface PaymentAccountResponse {
  accountNo: string
  bankCode: string
}

export const getPaymentAccount =
  async (): Promise<PaymentAccountResponse | null> => {
    const response = await apiRequester.get<PaymentAccountResponse | null>(
      '/api/payment/account',
    )
    return response.data
  }
