import { useState } from 'react'
import tw from 'twin.macro'
import ProductSelector from './ProductSelector'
import { BoardItemUsingInfo } from '@/interfaces/BoardInterface'
import ProductSearchModal from './ProductSearchModal'
import { useDealRequestStore } from '@/stores/chatStore'
import ProductDirectModal from './ProductDirectModal'
import AddMethodModal from './AddMethodModal'
import { PlusCircleSolid } from 'iconoir-react'
import { colors } from '@/styles/colors'
import { useQueryClient } from '@tanstack/react-query'
import { getCategoryAllProducts } from '../../sevices/dealService'

const Form = tw.div`
  overflow-y-auto my-2 h-96
`

export default function ProductForm() {
  const categories = [
    { id: 1, name: '키보드' },
    { id: 2, name: '스위치' },
    { id: 3, name: '키캡' },
    { id: 4, name: '기판' },
    { id: 5, name: '보강판' },
    { id: 6, name: '스테빌라이저' },
    { id: 7, name: '흡음재' },
  ]

  // 선택된 상품들을 카테고리별로 저장하는 객체
  const setSelectedProducts = useDealRequestStore(
    (state) => state.setSelectedProducts,
  )
  const selectedProducts = useDealRequestStore(
    (state) => state.selectedProducts,
  )

  // 추가한 기타 카테고리
  const increaseCategory = useDealRequestStore(
    (state) => state.increaseCategory,
  )

  const etcCategoryCount = useDealRequestStore(
    (state) => state.etcCategoryCount,
  )

  // 현재 선택된 카테고리
  const [currentCategory, setCurrentCategory] = useState<string>('')
  const [currentCategoryId, setCurrentCategoryId] = useState<number>(0)

  // 현재 열려있는 Drawer를 추적
  const [openMethodModal, setOpenMethodModal] = useState<boolean>(false)
  const [openSearchModal, setOpenSearchModal] = useState<boolean>(false)
  const [openDirectModal, setOpenDirectModal] = useState<boolean>(false)

  // 카테고리 선택 시 Drawer를 열어 상품 선택 UI 표시
  const queryClient = useQueryClient()
  const { setCategoryAllProducts, categoryAllProducts } = useDealRequestStore()

  // Modal 상태 변경
  const handleAddProduct = (category: string, categoryId: number) => {
    if (!categoryAllProducts[category]) {
      queryClient.fetchQuery({
        queryKey: ['all-products', categoryId],
        queryFn: async () => {
          const data = await getCategoryAllProducts(categoryId)
          const formatted = data.map((p) => ({ ...p, categoryName: category }))
          setCategoryAllProducts(category, formatted)
          return formatted
        },
      })
    }

    setCurrentCategory(category)
    setCurrentCategoryId(categoryId)
    setOpenMethodModal(true)
  }

  const handleSelectDirectInput = () => {
    setOpenMethodModal(false)
    setOpenDirectModal(true)
  }

  const handleSelectSearchInput = () => {
    setOpenMethodModal(false)
    setOpenSearchModal(true)
  }

  // 하단 + 버튼 클릭 시 DirectModal 열기 (기타 카테고리 추가)
  const handleAddEtcCategory = () => {
    setCurrentCategory(`기타 ${etcCategoryCount}`)
    setCurrentCategoryId(currentCategoryId + etcCategoryCount)
    setOpenDirectModal(true)
  }

  // 상품 추가 (검색용, 직접 입력)
  const handleSelectProduct = (product: BoardItemUsingInfo) => {
    setSelectedProducts({
      ...selectedProducts,
      [product.categoryName]: product,
    })
    setOpenSearchModal(false)
  }

  const handleAddDirectProduct = (name: string, price: number) => {
    const directProduct: BoardItemUsingInfo = {
      productId: Date.now(), // 임시 ID 생성
      productName: name,
      price,
      categoryName: currentCategory,
      categoryId: currentCategoryId,
      imageUrl: '',
    }

    setSelectedProducts({
      ...selectedProducts,
      [currentCategory]: directProduct,
    })

    if (currentCategory.startsWith('기타')) {
      increaseCategory()
    }
    setOpenDirectModal(false)
  }

  // 선택된 상품 삭제
  const handleDeleteProduct = (category: string) => {
    const newSelectedProducts = { ...selectedProducts }
    delete newSelectedProducts[category]
    setSelectedProducts(newSelectedProducts)
  }

  // 선택된 상품 렌더링
  const renderSelectedProducts = () => {
    return Object.entries(selectedProducts).map(([category, product]) => (
      <div key={category}>
        <ProductSelector
          label={category}
          product={product}
          onDelete={() => handleDeleteProduct(category)}
        />
      </div>
    ))
  }

  // 미선택 카테고리 렌더링
  const renderUnselectedCategories = () => {
    return categories.map(
      (category) =>
        !selectedProducts[category.name] && (
          <div key={category.id}>
            <ProductSelector
              label={category.name}
              onAdd={() => handleAddProduct(category.name, category.id)}
            />
          </div>
        ),
    )
  }

  return (
    <>
      <Form>
        {renderSelectedProducts()}
        {renderUnselectedCategories()}

        {/* AddMethodModal */}
        <AddMethodModal
          isOpen={openMethodModal}
          onOpenChange={setOpenMethodModal}
          onSelectDirect={handleSelectDirectInput}
          onSelectSearch={handleSelectSearchInput}
        />

        {/* ProductSearchModal */}
        <ProductSearchModal
          isOpen={openSearchModal}
          onOpenChange={setOpenSearchModal}
          title={currentCategory}
          categoryId={currentCategoryId}
          products={categoryAllProducts[currentCategory] || []}
          onSelectProduct={handleSelectProduct}
        />

        {/* ProductDirectModal */}
        <ProductDirectModal
          isOpen={openDirectModal}
          onOpenChange={setOpenDirectModal}
          onAddProduct={handleAddDirectProduct}
        />
      </Form>

      {/* 카테고리 추가 버튼 */}
      <button
        onClick={handleAddEtcCategory}
        className="w-full flex justify-center focus:outline-none"
      >
        <PlusCircleSolid color={colors.darkKiwi} width="32px" height="32px" />
      </button>
    </>
  )
}
