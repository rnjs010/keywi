import DetailHeader from '@/components/DetailHeader'
import TwoBtnModal from '@/components/TwoBtnModal'
import { deleteAccount, logout } from '@/features/login/services/authServices'
import ProfileEditModal from '@/features/mypage/components/ProfileEditModal'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { Text } from '@/styles/typography'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import tw from 'twin.macro'

const Container = tw.div`
  w-full 
  max-w-screen-sm 
  mx-auto 
  flex 
  flex-col 
  h-screen
  pb-4
`
const HeaderWrapper = tw.div`
  sticky
  top-0
  z-10
  bg-white
  w-full
`
const ContentContainer = tw.div`
  flex-1
  overflow-auto
  px-4
  pt-2
`
const SectionWrapper = tw.div`
  mt-3
`
const SectionTitle = tw.div`
  ml-2
  mb-2
`
const MenuItem = tw.div`
  flex
  justify-between
  items-center
  py-3
  px-2
`
// const AccountBadge = tw.div`
//   flex
//   items-center
//   gap-2
//   bg-pay
//   rounded-lg
//   px-2
//   py-1
// `
// const BankLogo = tw.img`
//   w-4
//   h-4
// `

export function SettingPage() {
  const navigate = useNavigate()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { logout: localLogout } = useAuthStore()
  const { reset: resetUser } = useUserStore()

  const handleMenuClick = (path: string) => {
    navigate(path)
  }

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await logout() // 서버 로그아웃 API 호출
      localLogout() // 로컬 상태 초기화
      resetUser() // 사용자 정보 초기화
      navigate('/', { replace: true })
    } catch (error) {
      console.error('로그아웃 실패:', error)
      // 오류가 발생해도 로컬에서는 로그아웃 처리
      localLogout()
      resetUser()
      navigate('/', { replace: true })
    } finally {
      setIsLogoutModalOpen(false)
    }
  }

  // 회원탈퇴 처리
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount() // 서버 회원탈퇴 API 호출
      localLogout() // 로컬 상태 초기화
      resetUser() // 사용자 정보 초기화
      navigate('/', { replace: true })
    } catch (error) {
      console.error('회원탈퇴 실패:', error)
    } finally {
      setIsDeleteAccountModalOpen(false)
    }
  }

  return (
    <>
      <Container>
        <HeaderWrapper>
          <DetailHeader title="설정" />
        </HeaderWrapper>
        <ContentContainer>
          {/* 내 정보 관리 */}
          <SectionWrapper>
            <SectionTitle>
              <Text variant="caption1" weight="bold" color="kiwi">
                내 정보 관리
              </Text>
            </SectionTitle>
            <MenuItem onClick={() => setIsEditModalOpen(true)}>
              <Text variant="body1">내 정보 수정</Text>
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/setting/account')}>
              <Text variant="body1">계좌 관리</Text>
              {/* <AccountBadge>
                <BankLogo src="/banks/우리.png"></BankLogo>
                <Text variant="caption1">우리 1002039482304</Text>
              </AccountBadge> */}
            </MenuItem>
          </SectionWrapper>
          {/* 설정 - 구색맞추기용 */}
          <SectionWrapper>
            <SectionTitle>
              <Text variant="caption1" weight="bold" color="kiwi">
                설정
              </Text>
            </SectionTitle>
            <MenuItem>
              <Text variant="body1">알림 설정</Text>
            </MenuItem>
            <MenuItem>
              <Text variant="body1">다크 모드</Text>
            </MenuItem>
          </SectionWrapper>
          {/* 기타 - 구색맞추기용 */}
          <SectionWrapper>
            <SectionTitle>
              <Text variant="caption1" weight="bold" color="kiwi">
                기타
              </Text>
            </SectionTitle>
            <MenuItem>
              <Text variant="body1">키위가 궁금해요</Text>
            </MenuItem>
            <MenuItem>
              <Text variant="body1">고객센터</Text>
            </MenuItem>
            <MenuItem>
              <Text variant="body1">서비스 이용약관</Text>
            </MenuItem>
            <MenuItem>
              <Text variant="body1">개인정보처리 방침</Text>
            </MenuItem>
            <MenuItem>
              <Text variant="body1">버전 정보</Text>
              <Text variant="body1" color="darkGray">
                0.0.1
              </Text>
            </MenuItem>
          </SectionWrapper>
          <div className="border-t border-pay mt-4 py-4">
            <MenuItem onClick={() => setIsLogoutModalOpen(true)}>
              <Text variant="body1">로그아웃</Text>
            </MenuItem>
            <MenuItem onClick={() => setIsDeleteAccountModalOpen(true)}>
              <Text variant="body1">탈퇴하기</Text>
            </MenuItem>
          </div>
        </ContentContainer>

        {/* 로그아웃 확인 모달 */}
        <TwoBtnModal
          isOpen={isLogoutModalOpen}
          onOpenChange={setIsLogoutModalOpen}
          title="로그아웃"
          content="키위랑 또 만나요!"
          cancleText="취소"
          confirmText="로그아웃"
          onCancle={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />

        {/* 회원탈퇴 확인 모달 */}
        <TwoBtnModal
          isOpen={isDeleteAccountModalOpen}
          onOpenChange={setIsDeleteAccountModalOpen}
          title="회원탈퇴"
          content="모든 정보가 삭제되며 복구할 수 없어요. 키위를 떠나시나요?"
          cancleText="취소"
          confirmText="탈퇴하기"
          onCancle={() => setIsDeleteAccountModalOpen(false)}
          onConfirm={handleDeleteAccount}
        />
      </Container>

      {/* 프로필 수정 모달 */}
      {isEditModalOpen && (
        <ProfileEditModal onClose={() => setIsEditModalOpen(false)} />
      )}
    </>
  )
}
