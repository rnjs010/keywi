import { Text } from '@/styles/typography'
import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { HelpCircle, Search } from 'iconoir-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { BoardItemUsingInfo } from '@/interfaces/BoardInterface'
import React, { useEffect, useState } from 'react'

const CardContainer = tw.div`
  flex items-center gap-3 cursor-pointer my-2 pb-2
`

const ThumbnailImage = tw.img`
  w-[3rem] h-[3rem] rounded-md object-cover self-start
`

const SearchContainer = tw.div`
  relative mx-4 mb-2
`

const SearchInput = tw.input`
  w-full p-2 pl-8 rounded-md bg-input text-base
  focus:outline-none
  [caret-color: #70C400]
`

const SearchIconWrapper = tw.div`
  absolute left-2 top-1/2 transform -translate-y-1/2
`

const Tooltip = tw.div`
  fixed top-40 right-32 px-3 py-2 bg-info rounded shadow-lg z-50 leading-none
`

interface ProductDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children?: React.ReactNode
  trigger: React.ReactNode
  products?: BoardItemUsingInfo[]
  onSelectProduct?: (product: BoardItemUsingInfo) => void
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
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [suggestions, setSuggestions] = useState<BoardItemUsingInfo[]>([])
  const displayedProducts = searchTerm ? suggestions : products

  // 조립자 추천 요청 (특별한 BoardItem 객체 생성)
  const handleRecommendClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지

    if (onSelectProduct) {
      const recommendItem: BoardItemUsingInfo = {
        categoryId: 0,
        categoryName: title,
        productId: 0,
        productName: '조립자 추천 요청',
        price: 0,
        imageUrl: '',
      }

      onSelectProduct(recommendItem)
      onOpenChange(false)
    }
  }

  // 도움말 클릭 시 툴팁 보이기
  const handleHelpClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsTooltipVisible(true)

    setTimeout(() => {
      setIsTooltipVisible(false)
    }, 3000)
  }

  // 툴팁 바깥 클릭 감지
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isTooltipVisible &&
        !(event.target as HTMLElement).closest('.recommend-button')
      ) {
        setIsTooltipVisible(false)
      }
    }

    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [isTooltipVisible])

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
          <SearchInput
            placeholder="상품명을 검색하세요."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
        </SearchContainer>
        {/* SECTION - 목록 title, 조립자 추천 버튼 */}
        <div className="flex flex-row justify-between items-center mx-4 py-2 border-b border-[#EEEEEE]">
          <Text variant="caption1" weight="regular" color="darkGray">
            {searchTerm ? '검색 목록' : '찜한 목록'}
          </Text>
          <div className="flex flex-row items-center gap-1">
            <HelpCircle
              color={colors.kiwi}
              height={`1rem`}
              width={`1rem`}
              strokeWidth={2}
              onClick={handleHelpClick}
            />
            {isTooltipVisible && (
              <Tooltip>
                <Text variant="caption2" weight="regular" color="darkKiwi">
                  상품이 고민된다면, <br />
                  조립자 추천 상품을 요청해보세요!
                </Text>
              </Tooltip>
            )}
            <div onClick={handleRecommendClick}>
              <Text
                variant="caption1"
                weight="bold"
                color="kiwi"
                className="align-text-top"
              >
                조립자 추천 요청
              </Text>
            </div>
          </div>
        </div>
        {/* SECTION - 상품 리스트 */}
        <div className="px-4 py-2 mb-4">
          {displayedProducts
            ? displayedProducts.map((product) => (
                <CardContainer
                  key={product.productId}
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                >
                  {product.imageUrl && (
                    <ThumbnailImage src={product.imageUrl} alt="thumbnail" />
                  )}
                  <div className="flex flex-col">
                    <Text variant="caption1" weight="regular">
                      {product.productName}
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
