import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FeedData } from '@/interfaces/HomeInterfaces'
import { useFeedStore } from '@/stores/homeStore'
import { useEffect } from 'react'
import { getBookmarkedFeeds } from '../services/feedService'

export const BOOKMARKED_FEEDS_QUERY_KEY = ['feeds', 'bookmarked']

export function useBookmarkedFeedsQuery() {
  const { setFeeds } = useFeedStore()
  const queryClient = useQueryClient()

  const query = useQuery<FeedData[]>({
    queryKey: BOOKMARKED_FEEDS_QUERY_KEY,
    queryFn: getBookmarkedFeeds,
    staleTime: 0, // 5분
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  const { data: bookmarkedFeeds = [], isLoading, error } = query

  // 북마크 토글 후 목록 갱신
  const refreshBookmarks = () => {
    queryClient.invalidateQueries({ queryKey: BOOKMARKED_FEEDS_QUERY_KEY })
  }

  // 북마크 피드를 zustand 스토어에도 저장
  useEffect(() => {
    if (bookmarkedFeeds && bookmarkedFeeds.length > 0) {
      setFeeds(bookmarkedFeeds)
    }
  }, [bookmarkedFeeds, setFeeds])

  return {
    bookmarkedFeeds,
    isLoading,
    error,
    refreshBookmarks,
  }
}
