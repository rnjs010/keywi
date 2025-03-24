import { createContext, useState, useContext, ReactNode } from 'react'
import { LoginContextType } from '@/interfaces/LoginInterfaces'

const LoginContext = createContext<LoginContextType | undefined>(undefined)

export function LoginProvider({ children }: { children: ReactNode }) {
  const [nickname, setNickname] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)

  return (
    <LoginContext.Provider
      value={{
        nickname,
        setNickname,
        profileImage,
        setProfileImage,
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}

export function useLogin() {
  const context = useContext(LoginContext)
  if (context === undefined) {
    throw new Error('useLogin must be used within a LoginProvider')
  }
  return context
}
