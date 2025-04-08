import { Text } from '@/styles/typography'
import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { Search } from 'iconoir-react'
import { Drawer, DrawerContent, DrawerHeader } from '@/components/ui/drawer'
import { BoardItemUsingInfo } from '@/interfaces/BoardInterface'
import React, { useEffect, useState } from 'react'
import { useProductSearchDeal } from '../../hooks/useProductsSearchDeal'
import truncateText from '@/utils/truncateText'
import highlightSearchTerm from '@/utils/highlightSearchTerm'

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

interface ProductDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  categoryId: number
  children?: React.ReactNode
  products?: BoardItemUsingInfo[]
  onSelectProduct?: (product: BoardItemUsingInfo) => void
}

export default function ProductSearchModal({
  isOpen,
  onOpenChange,
  title,
  categoryId,
  children,
  products,
  onSelectProduct,
}: ProductDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: searchResults } = useProductSearchDeal(
    categoryId,
    searchTerm,
    isOpen, // 모달 열려있을 때만 요청
  )
  const [suggestions, setSuggestions] = useState<BoardItemUsingInfo[]>([])
  const displayedProducts = searchTerm ? suggestions : products

  // 검색 결과 업데이트
  useEffect(() => {
    if (searchResults) {
      setSuggestions(searchResults)
    }
  }, [searchResults])

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
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

        {/* SECTION - 상품 리스트 */}
        <div className="px-4 py-2 mb-4 max-h-60 overflow-y-auto">
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
                      {highlightSearchTerm(
                        truncateText(product.productName, 30),
                        searchTerm,
                      )}
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
