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
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  const queryClient = useQueryClient()

  // 초기 사용자 정보 로드
  useEffect(() => {
    if (userInfo) {
      setNickname(userInfo.userNickname || '')
      if (userInfo.profileUrl) {
        setProfileImage(userInfo.profileUrl)
      }
      setStatusMessage(userInfo.statusMessage || '')
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
        let imageFile: File | undefined = undefined

        if (profileImageFile) {
          // 직접 전달받은 File 객체가 있으면 사용
          imageFile = profileImageFile
        } else if (profileImage && profileImage !== userInfo?.profileUrl) {
          // URL에서 파일로 변환 시도
          if (profileImage.startsWith('data:')) {
            try {
              const response = await fetch(profileImage)
              const blob = await response.blob()
              // profile.jpg 파일명 대신 의미있는 파일명 사용
              imageFile = new File([blob], 'user_profile.jpg', {
                type: blob.type || 'image/jpeg',
              })
            } catch (error) {
              console.error('이미지 변환 오류:', error)
            }
          }
        }

        await updateProfile({
          userNickname: nickname,
          profileImage: imageFile,
          statusMessage: statusMessage,
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
        queryClient.invalidateQueries({ queryKey: ['mypage', 'profile'] })
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
    statusMessage,
    setStatusMessage,
    error,
    isLoading: isPending || userLoading,
    handleSave,
  }
}
