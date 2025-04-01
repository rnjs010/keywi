import { useState } from 'react'
import tw from 'twin.macro'
import ProductSelector from './ProductSelector'
import { BoardItem } from '@/interfaces/BoardInterface'
import ProductSearchModal from './ProductSearchModal'
import { useDealProductStore } from '@/stores/ChatStore'
import ProductDirectModal from './ProductDirectModal'
import AddMethodModal from './AddMethodModal'
import { PlusCircleSolid } from 'iconoir-react'
import { colors } from '@/styles/colors'

const Form = tw.div`
  overflow-y-auto my-2 h-80
`

export default function ProductForm() {
  const categories = [
    { id: 1, name: '하우징' },
    { id: 2, name: '키캡' },
    { id: 3, name: '스위치' },
    { id: 4, name: '스테빌라이저' },
    { id: 5, name: '흡음재' },
    { id: 6, name: '보강판' },
    { id: 7, name: '기판' },
  ]

  // 선택된 상품들을 카테고리별로 저장하는 객체
  const setSelectedProducts = useDealProductStore(
    (state) => state.setSelectedProducts,
  )
  const selectedProducts = useDealProductStore(
    (state) => state.selectedProducts,
  )
  const [selectedProductsLocal, setSelectedProductsLocal] =
    useState<Record<string, BoardItem>>(selectedProducts)

  // 추가한 기타 카테고리
  const increaseCategory = useDealProductStore(
    (state) => state.increaseCategory,
  )

  const etcCategoryCount = useDealProductStore(
    (state) => state.etcCategoryCount,
  )

  // 현재 선택된 카테고리
  const [currentCategory, setCurrentCategory] = useState<string>('')
  const [currentCategoryId, setCurrentCategoryId] = useState<number>(0)

  // 현재 열려있는 Drawer를 추적
  const [openMethodModal, setOpenMethodModal] = useState<boolean>(false)
  const [openSearchModal, setOpenSearchModal] = useState<boolean>(false)
  const [openDirectModal, setOpenDirectModal] = useState<boolean>(false)

  // Modal 상태 변경
  const handleAddProduct = (category: string, categoryId: number) => {
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
    const etcCategoryName = '기타'
    setCurrentCategory(etcCategoryName)
    setCurrentCategoryId(currentCategoryId + etcCategoryCount)
    setOpenDirectModal(true)
  }

  // 상품 추가 (검색용, 직접 입력)
  const handleSelectProduct = (product: BoardItem) => {
    setSelectedProductsLocal({
      ...selectedProductsLocal,
      [product.categoryName]: product,
    })
    setOpenSearchModal(false)
  }

  const handleAddDirectProduct = (name: string, price: number) => {
    const directProduct: BoardItem = {
      itemId: Date.now(), // 임시 ID 생성
      itemName: name,
      price,
      categoryName: currentCategory,
      categoryId: currentCategoryId,
      imageUrl: '',
    }

    setSelectedProductsLocal({
      ...selectedProductsLocal,
      [currentCategory]: directProduct,
    })

    if (currentCategory === '기타') {
      increaseCategory()
    }
    setOpenDirectModal(false)
  }

  // 선택된 상품 삭제
  const handleDeleteProduct = (category: string) => {
    const newSelectedProducts = { ...selectedProductsLocal }
    delete newSelectedProducts[category]
    setSelectedProductsLocal(newSelectedProducts)
  }

  // 선택된 상품 렌더링
  const renderSelectedProducts = () => {
    return Object.entries(selectedProductsLocal).map(([category, product]) => (
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
        !selectedProductsLocal[category.name] && (
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
          products={initialProducts.filter(
            (p) => p.categoryName === currentCategory,
          )}
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

// 더미 데이터
const initialProducts: BoardItem[] = [
  {
    categoryId: 1,
    categoryName: '하우징',
    itemId: 1,
    itemName: 'Qwertykeys QK80MK2 WK PINK',
    price: 241000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 1,
    categoryName: '하우징',
    itemId: 2,
    itemName: '하우징2',
    price: 140000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 2,
    categoryName: '키캡',
    itemId: 3,
    itemName: '오스메 사쿠라 키캡',
    price: 140000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 2,
    categoryName: '키캡',
    itemId: 4,
    itemName: '세라키 세라믹 V2 키캡 Blue Crazed',
    price: 217000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 2,
    categoryName: '키캡',
    itemId: 5,
    itemName: '스웨그키 측각 그라데이션 키캡 Purple',
    price: 149000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 3,
    categoryName: '스위치',
    itemId: 6,
    itemName: '오스틴 샤지 키드',
    price: 140000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 4,
    categoryName: '스테빌라이저',
    itemId: 7,
    itemName: 'Durock V2 스테빌라이저',
    price: 25000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 4,
    categoryName: '스테빌라이저',
    itemId: 8,
    itemName: 'TX AP 스테빌라이저',
    price: 28000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 5,
    categoryName: '흡음재',
    itemId: 9,
    itemName: 'PORON PCB 흡음재',
    price: 18000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 5,
    categoryName: '흡음재',
    itemId: 10,
    itemName: 'PE Foam 흡음재',
    price: 15000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 6,
    categoryName: '보강판',
    itemId: 11,
    itemName: 'FR4 보강판',
    price: 30000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 6,
    categoryName: '보강판',
    itemId: 12,
    itemName: 'PC 보강판',
    price: 32000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 7,
    categoryName: '기판',
    itemId: 13,
    itemName: 'Hotswap 기판',
    price: 95000,
    imageUrl: 'https://picsum.photos/200',
  },
  {
    categoryId: 7,
    categoryName: '기판',
    itemId: 14,
    itemName: 'Solder 기판',
    price: 85000,
    imageUrl: 'https://picsum.photos/200',
  },
]
