import { useState } from 'react'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import ProductSelector from './ProductSelector'
import { BoardItemUsingInfo } from '@/interfaces/BoardInterface'
import ProductModal from './ProductModal'
import MainButton from '@/components/MainButton'
import { useBoardProductStore } from '@/stores/boardStore'
import { getFavoriteProducts } from '../services/boardService'
import { useQueryClient } from '@tanstack/react-query'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden
`

const Form = tw.div`
  overflow-y-auto px-4 py-2 flex-1 
`

export default function ProductForm({ onConfirm }: { onConfirm: () => void }) {
  const categories = [
    { id: 1, name: '하우징' },
    { id: 2, name: '키캡' },
    { id: 3, name: '스위치' },
    { id: 4, name: '스테빌라이저' },
    { id: 5, name: '흡음재' },
    { id: 6, name: '보강판' },
    { id: 7, name: '기판' },
  ]

  const queryClient = useQueryClient()
  const { setFavoriteProducts, favoriteProducts } = useBoardProductStore()
  const [openDrawer, setOpenDrawer] = useState<string | null>(null)
  const setSelectedProducts = useBoardProductStore(
    (state) => state.setSelectedProducts,
  )
  const selectedProducts = useBoardProductStore(
    (state) => state.selectedProducts,
  )

  // 카테고리 선택 시 Drawer를 열어 상품 선택 UI 표시
  const handleAddProduct = (category: string, categoryId: number) => {
    if (!favoriteProducts[category]) {
      queryClient.fetchQuery({
        queryKey: ['favorite-products', categoryId],
        queryFn: async () => {
          const data = await getFavoriteProducts(categoryId)
          const formatted = data.map((p) => ({ ...p, categoryName: category }))
          setFavoriteProducts(category, formatted)
          return formatted
        },
      })
    }

    setOpenDrawer(category)
  }

  // 상품 선택 시 해당 카테고리에 상품 저장 및 Drawer 닫기
  const handleSelectProduct = (product: BoardItemUsingInfo) => {
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
        products={favoriteProducts[category] || []}
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
                onAdd={() => handleAddProduct(category.name, category.id)}
              />
            }
            // api로 get한 찜한 상품 목록 우선 보이기
            products={favoriteProducts[category.name] || []}
            onSelectProduct={handleSelectProduct}
          />
        ),
    )
  }

  // Zustand store에 선택된 상품 저장 후 두 번째 화면으로 이동
  const handleConfirm = () => {
    setSelectedProducts(selectedProducts)
    onConfirm()
  }

  return (
    <Container>
      <Form>
        <Text variant="body2" weight="bold">
          상품 선택
        </Text>
        <div>
          {renderSelectedProducts()}
          {renderUnselectedCategories()}
        </div>
      </Form>
      <div className="px-4 mt-4 mb-12">
        <MainButton text="확인" onClick={handleConfirm} />
      </div>
    </Container>
  )
}
