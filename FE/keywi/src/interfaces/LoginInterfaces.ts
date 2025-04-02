export interface LoginContextType {
  nickname: string
  setNickname: (name: string) => void
  profileImage: string | null
  setProfileImage: (image: string | null) => void
}
