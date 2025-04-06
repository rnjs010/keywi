import { useState } from 'react'
import tw from 'twin.macro'
import ProductSelector from './ProductSelector'
import { BoardItem } from '@/interfaces/BoardInterface'
import ProductSearchModal from './ProductSearchModal'
import { useDealRequestStore } from '@/stores/chatStore'
import ProductDirectModal from './ProductDirectModal'
import AddMethodModal from './AddMethodModal'
import { PlusCircleSolid } from 'iconoir-react'
import { colors } from '@/styles/colors'

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
  // const [selectedProductsLocal, setSelectedProductsLocal] =
  //   useState<Record<string, BoardItem>>(selectedProducts)

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
    setSelectedProducts({
      ...selectedProducts,
      [product.categoryName]: product,
    })
    setOpenSearchModal(false)
  }

  const handleAddDirectProduct = (name: string, price: number) => {
    const directProduct: BoardItem = {
      productId: Date.now(), // 임시 ID 생성
      productName: name,
      price,
      categoryName: currentCategory,
      categoryId: currentCategoryId,
      imageUrl: '',
      manufacturer: null,
      createdAt: null,
    }

    setSelectedProducts({
      ...selectedProducts,
      [currentCategory]: directProduct,
    })

    if (currentCategory === '기타') {
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
    productId: 1,
    productName: 'Qwertykeys QK80MK2 WK PINK',
    price: 241000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 1,
    categoryName: '하우징',
    productId: 2,
    productName: '하우징2',
    price: 140000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 2,
    categoryName: '키캡',
    productId: 3,
    productName: '오스메 사쿠라 키캡',
    price: 140000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 2,
    categoryName: '키캡',
    productId: 4,
    productName: '세라키 세라믹 V2 키캡 Blue Crazed',
    price: 217000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 2,
    categoryName: '키캡',
    productId: 5,
    productName: '스웨그키 측각 그라데이션 키캡 Purple',
    price: 149000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 3,
    categoryName: '스위치',
    productId: 6,
    productName: '오스틴 샤지 키드',
    price: 140000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 4,
    categoryName: '스테빌라이저',
    productId: 7,
    productName: 'Durock V2 스테빌라이저',
    price: 25000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 4,
    categoryName: '스테빌라이저',
    productId: 8,
    productName: 'TX AP 스테빌라이저',
    price: 28000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 5,
    categoryName: '흡음재',
    productId: 9,
    productName: 'PORON PCB 흡음재',
    price: 18000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 5,
    categoryName: '흡음재',
    productId: 10,
    productName: 'PE Foam 흡음재',
    price: 15000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 6,
    categoryName: '보강판',
    productId: 11,
    productName: 'FR4 보강판',
    price: 30000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 6,
    categoryName: '보강판',
    productId: 12,
    productName: 'PC 보강판',
    price: 32000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 7,
    categoryName: '기판',
    productId: 13,
    productName: 'Hotswap 기판',
    price: 95000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
  {
    categoryId: 7,
    categoryName: '기판',
    productId: 14,
    productName: 'Solder 기판',
    price: 85000,
    imageUrl: 'https://picsum.photos/200',
    manufacturer: null,
    createdAt: null,
  },
]
