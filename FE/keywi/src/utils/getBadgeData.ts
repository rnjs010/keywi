//NOTE - 상태에 따른 텍스트와 색상을 반환하는 함수
const getBadgeData = (status: string | null) => {
  const normalizedStatus = status ?? 'REQUEST'

  switch (normalizedStatus) {
    case 'REQUEST':
      return { title: '조립요청', color: 'red' } as const
    case 'IN_PROGRESS':
      return { title: '진행중', color: 'blue' } as const
    case 'COMPLETED':
      return { title: '조립완료', color: 'gray' } as const
    default:
      return { title: '', color: 'red' } as const
  }
}

export default getBadgeData
