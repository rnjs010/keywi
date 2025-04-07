//NOTE  -  날짜 형식 변환 함수 (ex: "2025-04-03T17:18:58" -> "5시간 전")
export default function getTimeDiff(time: string) {
  const createdAt = new Date(time)
  const now = new Date()
  const diffMs = now.getTime() - createdAt.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffMonths / 12)

  let timeAgo

  if (diffYears > 0) {
    timeAgo = `${diffYears}년 전`
  } else if (diffMonths > 0) {
    timeAgo = `${diffMonths}월 전`
  } else if (diffDays > 0) {
    timeAgo = `${diffDays}일 전`
  } else if (diffHours > 0) {
    timeAgo = `${diffHours}시간 전`
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    timeAgo = diffMinutes > 0 ? `${diffMinutes}분 전` : '방금 전'
  }

  return timeAgo
}
