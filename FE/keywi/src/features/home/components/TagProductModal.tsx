import { Text } from '@/styles/typography'
import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { EditPencil, Search } from 'iconoir-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
} from '@/components/ui/drawer'
import React, { useState } from 'react'
import { ProductItem } from '@/interfaces/HomeInterfaces'
import TagWriteModal from './TagWriteModal'

const CardContainer = tw.div`
  flex items-center gap-4 cursor-pointer my-3
`
const ThumbnailImage = tw.img`
  w-[3rem] h-[3rem] rounded-md object-cover self-start
`
const SearchContainer = tw.div`
  relative mx-4 my-1
`
const SearchInput = tw.input`
  w-full p-2 pl-8 rounded-md bg-input text-base
  focus:outline-none
  [caret-color: #70C400]
`
const SearchIconWrapper = tw.div`
  absolute left-2 top-1/2 transform -translate-y-1/2
`

interface ProductDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children?: React.ReactNode
  trigger: React.ReactNode
  products?: ProductItem[]
  onSelectProduct?: (product: ProductItem) => void
  onWriteProduct?: (productName: string) => void
}

export default function TagProductModal({
  isOpen,
  onOpenChange,
  title,
  children,
  trigger,
  products,
  onSelectProduct,
  onWriteProduct,
}: ProductDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)

  // 직접 입력 핸들링
  const handleWriteModalClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지

    // 현재 모달 닫기
    onOpenChange(false)

    // 직접 입력 모달 열기
    setTimeout(() => {
      setIsWriteModalOpen(true)
    }, 300) // Drawer closing animation 이후에 열기
  }

  // 직접 입력 모달에서 확인 버튼 클릭 핸들러
  const handleWriteConfirm = (productName: string) => {
    if (onWriteProduct) {
      onWriteProduct(productName)
    }
  }

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              <Text variant="body2" weight="bold" color="darkKiwi">
                {title}
              </Text>
            </DrawerTitle>
          </DrawerHeader>
          {/* SECTION - 검색창 추가 */}
          <SearchContainer>
            <SearchIconWrapper>
              <Search color={colors.darkGray} height="16px" width="16px" />
            </SearchIconWrapper>
            <SearchInput
              placeholder="상품명을 검색하세요."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
            />
          </SearchContainer>
          {/* SECTION - 목록 title, 직접 입력 버튼 */}
          <div className="flex flex-row justify-between items-center mt-2 mx-4 py-2 border-b border-[#EEEEEE]">
            <Text variant="caption1" weight="regular" color="darkGray">
              찜한 목록
            </Text>
            <div className="flex flex-row items-center gap-0.5">
              <div
                className="flex items-center gap-1"
                onClick={handleWriteModalClick}
              >
                <EditPencil
                  color={colors.kiwi}
                  width={'1rem'}
                  height={'1rem'}
                />
                <Text variant="caption1" weight="bold" color="kiwi">
                  직접 입력
                </Text>
              </div>
            </div>
          </div>
          {/* SECTION - 상품 리스트 */}
          <div className="px-4 py-2 mb-4">
            {products
              ? products.map((product) => (
                  <CardContainer
                    key={product.itemId}
                    onClick={() => onSelectProduct && onSelectProduct(product)}
                  >
                    {product.imageUrl && (
                      <ThumbnailImage src={product.imageUrl} alt="thumbnail" />
                    )}
                    <div className="flex flex-col">
                      <Text variant="caption1" weight="regular">
                        {product.itemName}
                      </Text>
                      <Text variant="caption1" weight="bold">
                        {product.price.toLocaleString()}원
                      </Text>
                    </div>
                  </CardContainer>
                ))
              : children}
          </div>
        </DrawerContent>
      </Drawer>

      {/* 직접 입력 모달 */}
      <TagWriteModal
        isOpen={isWriteModalOpen}
        onOpenChange={setIsWriteModalOpen}
        title="직접 입력"
        onConfirm={handleWriteConfirm}
      />
    </>
  )
}
