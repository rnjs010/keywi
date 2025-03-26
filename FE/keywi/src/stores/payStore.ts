import { create } from 'zustand'

interface PayState {
  step: number
  accountNumber: string
  bank: string
  password: string
  setStep: (step: number) => void
  setAccountInfo: (accountNumber: string, bank: string) => void
  setPassword: (password: string) => void
  resetState: () => void
}

export const usePayStore = create<PayState>((set) => ({
  step: 1,
  accountNumber: '',
  bank: '',
  password: '',
  setStep: (step) => set({ step }),
  setAccountInfo: (accountNumber, bank) => set({ accountNumber, bank }),
  setPassword: (password) => set({ password }),
  resetState: () => set({ step: 1, accountNumber: '', bank: '', password: '' }),
}))
