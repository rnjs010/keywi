import { useQuery } from '@tanstack/react-query'
import { getHashtags } from '../services/feedService'

export function useHashtags() {
  return useQuery({
    queryKey: ['hashtags'],
    queryFn: getHashtags,
    staleTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
  })
}
