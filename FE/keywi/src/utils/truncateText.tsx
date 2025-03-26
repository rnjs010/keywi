// 텍스트 자르고 말줄임표 추가하는 함수
export default function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
