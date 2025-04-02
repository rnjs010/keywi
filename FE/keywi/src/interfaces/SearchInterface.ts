// 인기 검색어
export interface KeywordRank {
  timeBlock: string
  keyword: string
  ranking: number
  changeStatus: 'NEW' | 'UP' | 'DOWN' | 'SAME' | 'NONE'
}
