import ProductForm from '@/features/board/components/ProductForm'
import WriteForm from '@/features/board/components/WriteForm'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { Xmark } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useBoardProductStore } from '@/stores/boardStore'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden
`

const HeaderContainer = tw.div`
  relative flex justify-center items-center p-4
`
export default function BoardWritePage() {
  const navigate = useNavigate()
  const { resetState, title, content } = useBoardProductStore()

  // 화면 상태 관리
  const [currentScreen, setCurrentScreen] = useState<'first' | 'second'>(
    'first',
  )

  // 글 작성 닫기
  const handleClose = () => {
    resetState()
    navigate('/board')
  }

  // 글 작성 완료
  const isCompleteEnabled = title.trim().length > 0 && content.trim().length > 0

  const handleCompleteForm = () => {
    console.log('Title:', title)
    console.log('Content:', content)
    handleClose()
  }

  return (
    <Container>
      <HeaderContainer>
        <div className="absolute left-4">
          <Xmark onClick={handleClose} />
        </div>
        <Text variant="title3" weight="bold" color="black">
          글쓰기
        </Text>
        {currentScreen === 'second' && (
          <div className="absolute right-4">
            <Text
              variant="title3"
              weight="bold"
              color={isCompleteEnabled ? 'kiwi' : 'gray'}
              onClick={isCompleteEnabled ? handleCompleteForm : undefined}
              className={`cursor-${isCompleteEnabled ? 'pointer' : 'not-allowed'}`}
            >
              완료
            </Text>
          </div>
        )}
      </HeaderContainer>

      {/* 화면 상태에 따라 컴포넌트 렌더링 */}
      {currentScreen === 'first' && (
        <ProductForm onConfirm={() => setCurrentScreen('second')} />
      )}
      {currentScreen === 'second' && (
        <WriteForm onEdit={() => setCurrentScreen('first')} />
      )}
    </Container>
  )
}
