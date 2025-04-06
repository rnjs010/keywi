// 한국 시간(KST) 기준으로 현재 시간 가져오기
export const getCurrentKoreanHour = () => {
  // 한국 시간은 UTC+9
  const now = new Date()
  const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return koreanTime.getUTCHours()
}
