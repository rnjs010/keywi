import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile } from '@/features/login/services/authServices'
import { USER_INFO_QUERY_KEY } from '@/features/login/hooks/useUserInfo'
import { useUserInfo } from '@/features/login/hooks/useUserInfo'

export const useProfileEdit = () => {
  const { userInfo, isLoading: userLoading } = useUserInfo()
  const [nickname, setNickname] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const queryClient = useQueryClient()

  // 초기 사용자 정보 로드
  useEffect(() => {
    if (userInfo) {
      setNickname(userInfo.userNickname || '')
      if (userInfo.profileUrl) {
        setProfileImage(userInfo.profileUrl)
      }
    }
  }, [userInfo])

  // 프로필 이미지를 설정하는 함수 (Data URL과 File 모두 저장)
  const handleProfileImageChange = (imageUrl: string, file?: File) => {
    setProfileImage(imageUrl)
    if (file) {
      setProfileImageFile(file)
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (nickname.length < 2) {
        setError('닉네임은 2자 이상이어야 합니다')
        return false
      }
      try {
        // 프로필 이미지 파일이 있으면 사용, 없고 Data URL만 있으면 변환
        let imageFile: File | undefined = undefined

        if (profileImageFile) {
          // 직접 전달받은 File 객체가 있으면 사용
          imageFile = profileImageFile
        } else if (profileImage && profileImage !== userInfo?.profileUrl) {
          // URL만 있고 기존 이미지와 다른 경우 File로 변환
          if (profileImage.startsWith('data:')) {
            const response = await fetch(profileImage)
            const blob = await response.blob()
            imageFile = new File([blob], 'profile.jpg', { type: blob.type })
          }
        }

        await updateProfile({
          userNickname: nickname,
          profileImage: imageFile,
        })
        return true
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            '프로필 업데이트 중 오류가 발생했습니다',
        )
        return false
      }
    },
    onSuccess: (result) => {
      if (result) {
        queryClient.invalidateQueries({ queryKey: USER_INFO_QUERY_KEY })
      }
    },
  })

  const handleSave = async () => {
    setError(null)
    mutate()
  }

  return {
    nickname,
    setNickname,
    profileImage,
    setProfileImage: handleProfileImageChange,
    error,
    isLoading: isPending || userLoading,
    handleSave,
  }
}
