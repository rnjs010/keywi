import { useState } from 'react'
import tw from 'twin.macro'
import ProductSelector from './ProductSelector'
import { BoardItem } from '@/interfaces/BoardInterface'
import ProductModal from './ProductModal'
import MainButton from '@/components/MainButton'

const Form = tw.div`
  flex flex-col p-4 flex-1
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
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, BoardItem>
  >({})

  // 현재 선택된 카테고리
  const [currentCategory, setCurrentCategory] = useState<string>('')

  // 현재 열려있는 Drawer를 추적
  const [openDrawer, setOpenDrawer] = useState<string | null>(null)

  // 카테고리 선택 시 Drawer를 열어 상품 선택 UI 표시
  const handleAddProduct = (category: string) => {
    setCurrentCategory(category)
    setOpenDrawer(category)
  }

  // 상품 선택 시 해당 카테고리에 상품 저장 및 Drawer 닫기
  const handleSelectProduct = (product: BoardItem) => {
    setSelectedProducts({
      ...selectedProducts,
      [product.categoryName]: product,
    })
    setOpenDrawer(null)
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
      <ProductModal
        key={category}
        isOpen={openDrawer === category}
        onOpenChange={(open) => {
          if (open) setOpenDrawer(category)
          else setOpenDrawer(null)
        }}
        title={category}
        trigger={
          <ProductSelector
            label={category}
            product={product}
            onDelete={() => handleDeleteProduct(category)}
          />
        }
        products={initialProducts.filter((p) => p.categoryName === category)}
        onSelectProduct={handleSelectProduct}
      />
    ))
  }

  // 미선택 카테고리 렌더링
  const renderUnselectedCategories = () => {
    return categories.map(
      (category) =>
        !selectedProducts[category.name] && (
          <ProductModal
            key={category.id}
            isOpen={openDrawer === category.name}
            onOpenChange={(open) => {
              if (open) setOpenDrawer(category.name)
              else setOpenDrawer(null)
            }}
            title={category.name}
            trigger={
              <ProductSelector
                label={category.name}
                onAdd={() => handleAddProduct(category.name)}
              />
            }
            products={initialProducts.filter(
              (p) => p.categoryName === category.name,
            )}
            onSelectProduct={handleSelectProduct}
          />
        ),
    )
  }

  return (
    <>
      <Form>
        <div>
          {renderSelectedProducts()}
          {renderUnselectedCategories()}
        </div>
      </Form>
      <div className="w-full px-4 fixed bottom-12">
        <MainButton text="확인" />
      </div>
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
