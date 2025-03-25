import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { BoardItem } from '@/interfaces/BoardInterface'
import { HelpCircle, Search } from 'iconoir-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer'
import React, { useState } from 'react'
import { colors } from '@/styles/colors'

const CardContainer = tw.div`
  flex items-center gap-3 cursor-pointer my-2
`

const ThumbnailImage = tw.img`
  w-[3rem] h-[3rem] rounded-md object-cover self-start
`

const SearchContainer = tw.div`
  relative mx-4 my-2
`

const SearchInput = tw.input`
  w-full p-2 pl-8 rounded-md text-sm bg-input
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
  products?: BoardItem[]
  onSelectProduct?: (product: BoardItem) => void
}

export default function ProductModal({
  isOpen,
  onOpenChange,
  title,
  children,
  trigger,
  products,
  onSelectProduct,
}: ProductDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleRecommendClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지

    if (onSelectProduct) {
      // 조립자 추천 요청을 위한 특별한 BoardItem 객체 생성
      const recommendItem: BoardItem = {
        categoryId: 0,
        categoryName: title,
        itemId: -1,
        itemName: '조립자 추천 요청',
        price: 0,
        imageUrl: '',
      }

      onSelectProduct(recommendItem)
      onOpenChange(false)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <Text variant="body2" weight="bold" color="darkKiwi">
            {title} 선택
          </Text>
        </DrawerHeader>
        {/* SECTION - 검색창 추가 */}
        <SearchContainer>
          <SearchIconWrapper>
            <Search color={colors.darkGray} height="16px" width="16px" />
          </SearchIconWrapper>
          <SearchInput placeholder="상품명을 검색하세요." value={searchTerm} />
        </SearchContainer>
        {/* SECTION - 목록 title, 조립자 추천 버튼 */}
        <div className="flex flex-row justify-between items-center mx-4 py-2 border-b border-[#EEEEEE]">
          <Text variant="caption1" weight="regular" color="darkGray">
            찜한 목록
          </Text>
          <div className="flex flex-row items-center gap-0.5">
            <HelpCircle color={colors.kiwi} height={`1rem`} width={`1rem`} />
            <div onClick={handleRecommendClick}>
              <Text variant="caption1" weight="bold" color="kiwi">
                조립자 추천 요청
              </Text>
            </div>
          </div>
        </div>
        {/* SECTION - 상품 리스트 */}
        <div className="px-4 py-2">
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
  )
}
