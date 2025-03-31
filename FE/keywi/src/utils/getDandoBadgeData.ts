//NOTE - 당도에 따른 텍스트와 색상을 반환하는 함수
const getDangdoBadgeData = (reliability: number) => {
  // 20 이하 low 반환, 20 초과 35 이하 mid 반환, 35 초과 50이하 high 반환
  if (reliability <= 20) {
    return 'low'
  } else if (reliability > 20 && reliability <= 35) {
    return 'mid'
  } else if (reliability > 35) {
    return 'high'
  }
}

export default getDangdoBadgeData
