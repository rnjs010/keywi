import { BoardItemUsingInfo } from '@/interfaces/BoardInterface'
import { ReceiptData } from '@/interfaces/ChatInterfaces'
import { Client } from '@stomp/stompjs'
import { create } from 'zustand'

// 채팅
interface ChatConnectStore {
  connected: boolean
  setConnected: (status: boolean) => void
  subscribedRooms: Record<string, boolean>
  subscribeToRoom: (
    roomId: string,
    client: Client,
    onMessage: (msg: any) => void,
  ) => void
}

export const useChatConnectStore = create<ChatConnectStore>((set, get) => ({
  connected: false,
  setConnected: (status) => set({ connected: status }),
  subscribedRooms: {},

  subscribeToRoom: (roomId, client, onMessage) => {
    const { subscribedRooms } = get()

    if (subscribedRooms[roomId]) return // 이미 구독 중이면 무시

    client.subscribe(`/topic/chat/${roomId}`, (message) => {
      if (onMessage) {
        const body = JSON.parse(message.body)
        console.log('채팅방 메시지 수신', body)
        onMessage(body)
      }
    })

    client.publish({
      destination: '/app/chat.enter',
      body: JSON.stringify({ roomId }),
    })

    set((state) => ({
      subscribedRooms: { ...state.subscribedRooms, [roomId]: true },
    }))
  },
}))

// 채팅 이미지 전송
interface ChatImageStore {
  showImage: boolean
  setShowImage: (showImage: boolean) => void
  selectedImage: string | null
  setSelectedImage: (image: string | null) => void
  resetState: () => void
}

export const useChatImageStore = create<ChatImageStore>((set) => ({
  showImage: false,
  setShowImage: (showImage) => set({ showImage }),
  selectedImage: null,
  setSelectedImage: (image) => set({ selectedImage: image }),
  resetState: () => set({ showImage: false, selectedImage: null }),
}))

// 거래 요청
interface DealRequestStore {
  step: number
  categoryAllProducts: Record<string, BoardItemUsingInfo[]>
  selectedProducts: Record<string, BoardItemUsingInfo>
  etcCategoryCount: number
  totalPrice: number
  setStep: (step: number) => void
  setCategoryAllProducts: (
    categoryName: string,
    products: BoardItemUsingInfo[],
  ) => void
  setSelectedProducts: (products: Record<string, BoardItemUsingInfo>) => void
  increaseCategory: () => void
  setTotalPrice: (total: number) => void
  resetState: () => void
}

export const useDealRequestStore = create<DealRequestStore>((set) => ({
  step: 1,
  categoryAllProducts: {},
  selectedProducts: {},
  etcCategoryCount: 1,
  totalPrice: 0,
  setStep: (step) => set({ step }),
  setCategoryAllProducts: (categoryName, products) =>
    set((state) => ({
      categoryAllProducts: {
        ...state.categoryAllProducts,
        [categoryName]: products,
      },
    })),
  setSelectedProducts: (products) => set({ selectedProducts: products }),
  increaseCategory: () =>
    set((state) => ({ etcCategoryCount: state.etcCategoryCount + 1 })),
  setTotalPrice: (total) => set({ totalPrice: total }),
  resetState: () =>
    set({ step: 1, selectedProducts: {}, etcCategoryCount: 1, totalPrice: 0 }),
}))

// 거래 수락
interface DealAcceptStore {
  step: number
  receipt: ReceiptData
  setStep: (step: number) => void
  setReceipt: (receipt: ReceiptData) => void
  resetState: () => void
}

export const useDealAcceptStore = create<DealAcceptStore>((set) => ({
  step: 1,
  receipt: {} as ReceiptData,
  setStep: (step) => set({ step }),
  setReceipt: (receipt) => set({ receipt }),
  resetState: () => set({ step: 1, receipt: {} as ReceiptData }),
}))
