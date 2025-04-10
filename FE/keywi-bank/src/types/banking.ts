export type UserType = 'assembler' | 'buyer' | 'corporation'

export interface Transaction {
  id: number
  date: string
  name: string
  amount: number
  type: 'deposit' | 'withdrawal'
}
