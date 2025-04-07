import { useQuery } from '@tanstack/react-query'
import { FeedData } from '@/interfaces/HomeInterfaces'
import { getMyFeeds, getUserFeeds } from '../services/mypageFeedService'
import { useFeedStore } from '@/stores/homeStore'
import { useEffect, useState } from 'react'
import { transformFeedData } from '@/features/home/utils/FeedDataConverter'

// 마이페이지 피드 쿼리 훅: isMyProfile이 true면 내 피드, false면 다른 유저 피드를 가져옴

export const useMypageFeedQuery = (isMyProfile: boolean, userId?: number) => {
  const { setFeeds } = useFeedStore()
  const [virtualPage, setVirtualPage] = useState(0)
  const [displayedFeeds, setDisplayedFeeds] = useState<FeedData[]>([])

  // 한 페이지당 보여줄 피드 수 (가상 페이지네이션)
  const PAGE_SIZE = 2

  // 쿼리 키와 함수 결정
  const queryKey = isMyProfile ? ['feeds', 'my'] : ['feeds', 'user', userId]

  const fetchFn = async () => {
    const apiFeeds = isMyProfile
      ? await getMyFeeds()
      : await getUserFeeds(userId!)

    // API 응답을 앱에서 사용하는 형식으로 변환
    return apiFeeds.map((feed) => transformFeedData(feed))
  }

  const query = useQuery<FeedData[], Error>({
    queryKey,
    queryFn: fetchFn,
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
    enabled: isMyProfile || !!userId, // 내 프로필이거나 userId가 있을 때만 쿼리 활성화
  })

  // 피드 데이터가 변경되면 Zustand 스토어에 저장
  useEffect(() => {
    if (query.data) {
      setFeeds(query.data)
    }
  }, [query.data, setFeeds])

  // 가상 페이지네이션 처리
  useEffect(() => {
    if (query.data) {
      const end = (virtualPage + 1) * PAGE_SIZE
      setDisplayedFeeds(query.data.slice(0, end))
    }
  }, [query.data, virtualPage])

  // 더 보기 로드 함수
  const fetchNextPage = () => {
    if (query.data && (virtualPage + 1) * PAGE_SIZE < query.data.length) {
      setVirtualPage((prev) => prev + 1)
      return true
    }
    return false
  }

  return {
    ...query,
    displayedFeeds,
    fetchNextPage,
    hasNextPage: query.data
      ? (virtualPage + 1) * PAGE_SIZE < query.data.length
      : false,
    isFetchingNextPage: false,
  }
}
