import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { Drawer, DrawerContent, DrawerHeader } from '@/components/ui/drawer'
import React, { useState } from 'react'
import MainButton from '@/components/MainButton'

const InputContainer = tw.div`
  relative mx-4 mb-2
`

const InputBox = tw.input`
  w-full px-4 py-2 rounded-md bg-input text-base
  focus:outline-none
  [caret-color: #70C400]
`

interface ProductDirectProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddProduct: (name: string, price: number) => void
}

export default function ProductDirectModal({
  isOpen,
  onOpenChange,
  onAddProduct,
}: ProductDirectProps) {
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')

  const handleSubmit = () => {
    // 입력값 검증
    if (!productName.trim() || !productPrice.trim()) {
      alert('상품명과 가격을 모두 입력해주세요.')
      return
    }

    const price = parseFloat(productPrice.replace(/,/g, ''))
    if (isNaN(price)) {
      alert('유효한 가격을 입력해주세요.')
      return
    }

    onAddProduct(productName.trim(), price)

    // 입력 필드 초기화
    setProductName('')
    setProductPrice('')
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <Text variant="body2" weight="bold" color="darkKiwi">
            직접 입력
          </Text>
        </DrawerHeader>

        {/* SECTION - 상품명 입력 */}
        <InputContainer>
          <InputBox
            placeholder="상품명을 입력해주세요."
            value={productName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProductName(e.target.value)
            }
          />
        </InputContainer>

        {/* SECTION - 가격 입력 */}
        <InputContainer>
          <InputBox
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="가격을 입력해주세요."
            value={productPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProductPrice(e.target.value)
            }
          />
        </InputContainer>

        <div className="px-4 my-4">
          <MainButton text="추가하기" onClick={handleSubmit} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
