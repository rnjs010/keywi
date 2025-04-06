import { useState, useRef, useEffect } from 'react'
import apiRequester from '@/services/api'

export const useAutocomplete = () => {
  const [query, setQuery] = useState<string>('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // 검색어 입력 핸들러
  const handleInputChange = (
    valueOrEvent: string | React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value =
      typeof valueOrEvent === 'string'
        ? valueOrEvent
        : valueOrEvent.target.value
    setQuery(value)

    if (!value.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setShowSuggestions(true)
    fetchSuggestions(value)
  }

  // 검색어 자동완성 API 호출
  const fetchSuggestions = (value: string) => {
    if (debounceRef.current !== null) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await apiRequester.get<string[]>('/api/autocomplete', {
          params: { query: value },
        })
        setSuggestions(res.data)
      } catch (err) {
        console.error('api error - 자동완성 오류:', err)
        setSuggestions([])
      }
    }, 200) // 200ms 디바운스
  }

  // 검색어 선택
  const selectKeyword = (keyword: string) => {
    setQuery(keyword)
    setShowSuggestions(false)
  }

  // 검색창 닫기
  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return {
    query,
    suggestions,
    showSuggestions,
    handleInputChange,
    selectKeyword,
    clearSearch,
  }
}
