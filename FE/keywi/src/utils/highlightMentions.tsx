//NOTE -  텍스트에서 @로 시작하는 멘션을 찾아 하이라이트 처리해주는 유틸 함수
import React, { ReactNode } from 'react'
import { Text } from '@/styles/typography'

export const highlightMentions = (content: string): ReactNode[] => {
  if (!content) return []

  // @로 시작하는 단어를 찾는 정규식 (한글, 영문, 숫자, 언더스코어 포함)
  const mentionRegex = /(@[\w가-힣]+)/g

  // 텍스트를 분할할 배열
  const parts: string[] = []

  // 마지막으로 처리한 인덱스
  let lastIndex = 0

  // 정규식 매치 결과
  let match

  // 정규식으로 모든 멘션 찾기
  while ((match = mentionRegex.exec(content)) !== null) {
    // 멘션 이전 부분이 있으면 추가
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index))
    }

    // 멘션 부분 추가
    parts.push(match[0])

    // 마지막 처리 위치 업데이트
    lastIndex = match.index + match[0].length
  }

  // 마지막 멘션 이후 남은 텍스트가 있으면 추가
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex))
  }

  // 각 부분을 React 엘리먼트로 변환
  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      // 멘션은 키위색으로 표시
      return (
        <Text key={`mention-${index}`} color="kiwi" as="span">
          {part}
        </Text>
      )
    }
    // 일반 텍스트
    return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>
  })
}
