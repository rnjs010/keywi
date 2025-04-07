import { create } from 'zustand'
import { FeedData, ProductTag } from '@/interfaces/HomeInterfaces'

//SECTION -   피드 작성시 임시저장하기 위한 store
interface ImageState {
  images: string[] // 이미지 미리보기 URL
  imageFiles: File[] // 실제 이미지 파일
  productTags: ProductTag[] // 상품 태그 관련
  hashtags: string[] // 해시태그 목록
  content: string // 글 내용

  setImages: (images: string[]) => void
  setImageFiles: (files: File[]) => void
  addProductTag: (tag: ProductTag) => void
  removeProductTag: (id: number) => void
  setProductTags: (tags: ProductTag[]) => void
  setHashtags: (hashtags: string[]) => void
  addHashtag: (hashtag: string) => void
  removeHashtag: (hashtag: string) => void
  setContent: (content: string) => void
  reset: () => void
}

const useImageStore = create<ImageState>((set) => ({
  images: [],
  imageFiles: [],
  productTags: [],
  hashtags: [],
  content: '',

  setImages: (images) => set({ images }),
  setImageFiles: (files) => set({ imageFiles: files }),
  addProductTag: (tag) =>
    set((state) => ({
      productTags: [...state.productTags, tag],
    })),
  removeProductTag: (id) =>
    set((state) => ({
      productTags: state.productTags.filter((tag) => tag.id !== id),
    })),
  setProductTags: (tags) => set({ productTags: tags }),
  setHashtags: (hashtags) => set({ hashtags }),
  addHashtag: (hashtag) =>
    set((state) => ({
      hashtags: [...state.hashtags, hashtag],
    })),
  removeHashtag: (hashtag) =>
    set((state) => ({
      hashtags: state.hashtags.filter((tag) => tag !== hashtag),
    })),
  setContent: (content) => set({ content }),
  reset: () =>
    set({
      images: [],
      imageFiles: [],
      productTags: [],
      hashtags: [],
      content: '',
    }),
}))

export default useImageStore

//SECTION - 피드 조회 store
interface FeedState {
  feeds: Record<number, FeedData> // 캐시된 피드 목록 (ID를 키로 사용)
  setFeed: (feed: FeedData) => void // 피드 추가/업데이트
  setFeeds: (feeds: FeedData[]) => void // 여러 피드 추가/업데이트
  toggleLike: (feedId: number) => void // 피드 좋아요 토글
  toggleBookmark: (feedId: number) => void // 피드 북마크 토글
  toggleFollow: (authorId: number) => void // 피드 작성자 팔로우 토글
}

export const useFeedStore = create<FeedState>((set) => ({
  feeds: {},

  setFeed: (feed) =>
    set((state) => ({
      feeds: { ...state.feeds, [feed.id]: feed },
    })),
  setFeeds: (feeds) =>
    set((state) => {
      const newFeeds = { ...state.feeds }
      feeds.forEach((feed) => {
        newFeeds[feed.id] = feed
      })
      return { feeds: newFeeds }
    }),
  toggleLike: (feedId) =>
    set((state) => {
      const feed = state.feeds[feedId]
      if (!feed) return state
      const updatedFeed = {
        ...feed,
        isLiked: !feed.isLiked,
        likeCount: feed.isLiked ? feed.likeCount - 1 : feed.likeCount + 1,
      }
      return {
        feeds: { ...state.feeds, [feedId]: updatedFeed },
      }
    }),
  toggleBookmark: (feedId) =>
    set((state) => {
      const feed = state.feeds[feedId]
      if (!feed) return state
      const updatedFeed = {
        ...feed,
        isBookmarked: !feed.isBookmarked,
      }
      return {
        feeds: { ...state.feeds, [feedId]: updatedFeed },
      }
    }),

  toggleFollow: (authorId) =>
    set((state) => {
      // 작성자 ID가 같은 모든 피드 업데이트
      const updatedFeeds = { ...state.feeds }
      let targetFollowingStatus = false

      // 먼저 현재 팔로우 상태 확인
      Object.values(updatedFeeds).forEach((feed) => {
        if (feed.authorId === authorId && targetFollowingStatus === null) {
          targetFollowingStatus = !feed.isFollowing
        }
      })

      if (targetFollowingStatus === null) {
        console.log('작성자 ID에 해당하는 피드를 찾을 수 없음:', authorId)
        return state // 변경하지 않음
      }

      // 모든 관련 피드 업데이트
      Object.keys(updatedFeeds).forEach((feedId) => {
        const feed = updatedFeeds[Number(feedId)]
        if (feed.authorId === authorId) {
          updatedFeeds[Number(feedId)] = {
            ...feed,
            isFollowing: targetFollowingStatus,
          }
          console.log(
            `피드 ${feedId} 팔로우 상태 업데이트: ${!targetFollowingStatus} → ${targetFollowingStatus}`,
          )
        }
      })

      console.log('팔로우 토글 완료')
      return { feeds: updatedFeeds }
    }),
}))
