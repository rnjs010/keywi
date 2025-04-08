export const formatChatTime = (isoTime: string): string => {
  const date = new Date(isoTime)

  const hours = date.getHours()
  const minutes = date.getMinutes()

  const ampm = hours < 12 ? '오전' : '오후'
  const displayHours = hours % 12 === 0 ? 12 : hours % 12
  const displayMinutes = minutes.toString().padStart(2, '0')

  return `${ampm} ${displayHours}:${displayMinutes}`
}
