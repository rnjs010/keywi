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
import {
  FavoriteProduct,
  FeedSearchProduct,
  ProductItem,
} from '@/interfaces/HomeInterfaces'
import TagWriteModal from './TagWriteModal'
import { useFavoriteProducts } from '../../hooks/useFavoriteProducts'
import truncateText from '@/utils/truncateText'
import highlightSearchTerm from '@/utils/highlightSearchTerm'
import { useFeedProductSearch } from '../../hooks/useFeedProductSearch'

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
const LoadingContainer = tw.div`
  flex justify-center items-center py-8
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
  trigger,
  onSelectProduct,
  onWriteProduct,
}: ProductDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)

  // API 데이터 가져오기
  const { data: favoriteProducts, isLoading: isFavLoading } =
    useFavoriteProducts()
  const { data: searchResults, isLoading: isSearchLoading } =
    useFeedProductSearch(searchTerm, isOpen)

  // 현재 표시할 상품 목록 결정
  const showSearchResults = searchTerm.trim().length > 0
  const displayProducts = showSearchResults ? searchResults : favoriteProducts
  const isLoading = showSearchResults ? isSearchLoading : isFavLoading

  // 직접 입력 모달 핸들러
  const handleWriteModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onOpenChange(false)
    setTimeout(() => setIsWriteModalOpen(true), 300)
  }

  // 타입 가드 함수로 구분
  const isFavoriteProduct = (product: any): product is FavoriteProduct => {
    return 'productImage' in product
  }

  // 상품 선택 핸들러
  const handleSelectProduct = (
    product: FavoriteProduct | FeedSearchProduct,
  ) => {
    if (!onSelectProduct) return

    // FavoriteProduct 또는 FeedSearchProduct를 ProductItem으로 변환
    const productItem: ProductItem = {
      itemId: product.productId,
      itemName: product.productName,
      price: product.price,
      imageUrl: isFavoriteProduct(product)
        ? product.productImage
        : product.imageUrl,
      categoryId: isFavoriteProduct(product) ? product.categoryId : 0,
      categoryName: isFavoriteProduct(product)
        ? product.manufacturer || ''
        : '',
    }

    onSelectProduct(productItem)
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
          {/* SECTION - 검색창 */}
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
              {showSearchResults ? '검색 결과' : '찜한 목록'}
            </Text>
            <div className="flex flex-row items-center gap-0.5">
              <div
                className="flex items-center gap-1 cursor-pointer"
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
            {isLoading ? (
              <LoadingContainer>
                <Text color="darkGray">상품 목록을 불러오는 중...</Text>
              </LoadingContainer>
            ) : !displayProducts || displayProducts.length === 0 ? (
              <Text color="gray" className="text-center py-4">
                {showSearchResults
                  ? '검색 결과가 없습니다.'
                  : '찜한 상품이 없습니다.'}
              </Text>
            ) : (
              displayProducts.map((product) => (
                <CardContainer
                  key={product.productId}
                  onClick={() => handleSelectProduct(product)}
                >
                  {(isFavoriteProduct(product)
                    ? product.productImage
                    : product.imageUrl) && (
                    <ThumbnailImage
                      src={
                        isFavoriteProduct(product)
                          ? product.productImage
                          : product.imageUrl
                      }
                      alt="thumbnail"
                    />
                  )}
                  <div className="flex flex-col">
                    <Text variant="caption1" weight="regular">
                      {showSearchResults
                        ? highlightSearchTerm(
                            truncateText(product.productName, 30),
                            searchTerm,
                          )
                        : truncateText(product.productName, 35)}
                    </Text>
                    <Text variant="caption1" weight="bold">
                      {product.price.toLocaleString()}원
                    </Text>
                  </div>
                </CardContainer>
              ))
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* 직접 입력 모달 */}
      <TagWriteModal
        isOpen={isWriteModalOpen}
        onOpenChange={setIsWriteModalOpen}
        title="직접 입력"
        onConfirm={onWriteProduct || (() => {})}
      />
    </>
  )
}
