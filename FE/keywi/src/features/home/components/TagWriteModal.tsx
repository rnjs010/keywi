import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer'
import React, { useEffect, useState, useRef } from 'react'
import MainButton from '@/components/MainButton'
import styled from '@emotion/styled'

// 스크롤 가능한 컨텐츠 영역
const ScrollableContent = styled.div`
  ${tw`
    flex
    flex-col
    flex-1
    overflow-y-auto
    pb-16
  `}
  -webkit-overflow-scrolling: touch; // iOS 스크롤 부드럽게
`
const InputContainer = tw.div`
  relative mx-4 my-1 
`
const WriteInput = tw.input`
  w-full p-2 pl-4 rounded-md bg-input text-base
  focus:outline-none
  [caret-color: #70C400]
`
interface WriteDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onConfirm: (productName: string) => void
}

export default function TagWriteModal({
  isOpen,
  onOpenChange,
  title,
  onConfirm,
}: WriteDrawerProps) {
  const [productName, setProductName] = useState('')
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 입력값 유효성 검사 - 상품명 2글자 이상일 때 활성화
  useEffect(() => {
    setIsButtonEnabled(productName.length >= 2)
  }, [productName])

  // 모달이 열리면 자동으로 입력 필드에 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // 약간의 지연 후 포커스 (모달 애니메이션 완료 후)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  // 확인 버튼 누를시
  const handleConfirm = () => {
    if (isButtonEnabled) {
      onConfirm(productName)

      // 입력 필드 초기화
      setProductName('')

      // 모달 닫기
      onOpenChange(false)
    }
  }

  // 엔터키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isButtonEnabled) {
      handleConfirm()
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <Text variant="body2" weight="bold" color="darkKiwi">
              {title}
            </Text>
          </DrawerTitle>
        </DrawerHeader>
        <ScrollableContent>
          {/* SECTION - 상품명 입력 */}
          <InputContainer>
            <WriteInput
              ref={inputRef}
              placeholder="상품명을 입력해주세요."
              value={productName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProductName(e.target.value)
              }
              onKeyDown={handleKeyDown}
              maxLength={20}
              autoFocus
            />
            <Text variant="caption3" color="darkGray">
              예시) MAS 푸딩 크레용 헬로키티 키캡(122키)
            </Text>
          </InputContainer>
        </ScrollableContent>
        {/* SECTION - 확인 버튼 */}
        <DrawerFooter className="mb-6">
          <MainButton
            disabled={!isButtonEnabled}
            onClick={handleConfirm}
            text={'확인'}
          ></MainButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
