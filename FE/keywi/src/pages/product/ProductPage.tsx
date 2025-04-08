import NavBar from '@/components/NavBar'
import StyledTabs, { TabItem } from '@/components/StyleTab'
import HomeHeader from '@/features/home/components/feed/HomeHeader'
import ProductList from '@/features/product/component/ProductList'
import apiRequester from '@/services/api'
import { ProductProps } from '@/interfaces/ProductInterface'
import { useEffect, useState } from 'react'
import tw from 'twin.macro'
import { ApiResponse } from '@/interfaces/ApiResponse'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

type CategoryKey = '1' | '2' | '3' | '4' | '5' | '6' | '7'
type SubCategory = { id: string; label: string }

const Container = tw.div`
  w-full
  max-w-screen-sm
  mx-auto
  flex
  flex-col
  h-screen
  box-border
  overflow-x-hidden
`

const HeaderContainer = tw.div`
  z-10
`

const NavBarContainer = tw.div`
  fixed
  bottom-0
  left-0
  right-0
  bg-white
  z-10
  max-w-screen-sm
  mx-auto
  w-full
`

const TabsContainer = tw.div`
  flex
  flex-col
  gap-1
`

export default function ProductPage() {
  const { categoryId = 'all', subCategoryId = 'all' } = useParams<{
    categoryId?: string
    subCategoryId?: string
  }>()

  const navigate = useNavigate()
  const location = useLocation()

  // 상품 상태 관리
  const [products, setProducts] = useState<ProductProps[]>([])
  const [loading, setLoading] = useState(true)

  // 카테고리 필터링 상태
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | 'all'>(
    categoryId as CategoryKey | 'all',
  )
  const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryId)

  // 카테고리 데이터 정의
  const categories = [
    { id: 'all', value: 'all', label: '통합' },
    { id: '1', value: 'keyboard', label: '키보드' },
    { id: '2', value: 'switch', label: '스위치' },
    { id: '3', value: 'keycap', label: '키캡' },
    { id: '4', value: 'pcb', label: '기판' },
    { id: '5', value: 'plate', label: '보강판' },
    { id: '6', value: 'stabilizer', label: '스테빌라이저' },
    { id: '7', value: 'foam', label: '흡음재' },
  ]

  type SubCategoryMap = {
    [key in CategoryKey]?: SubCategory[]
  }

  // 하위 카테고리 데이터 정의
  const subCategories: SubCategoryMap = {
    '1': [
      { id: 'all', label: '전체' },
      { id: '8', label: '60%' },
      { id: '9', label: '65%' },
      { id: '10', label: '75%' },
      { id: '11', label: '80%' },
      { id: '12', label: '100%' },
      { id: '13', label: '기타 배열' },
    ],
    '2': [
      { id: 'all', label: '전체' },
      { id: '14', label: '리니어' },
      { id: '15', label: '텍타일' },
      { id: '16', label: '저소음' },
      { id: '17', label: '자석축' },
    ],
    '3': [
      { id: 'all', label: '전체' },
      { id: '18', label: '이중사출' },
      { id: '19', label: '염료승화' },
      { id: '20', label: '아티산' },
      { id: '21', label: '기타 키캡' },
    ],
    '6': [
      { id: 'all', label: '전체' },
      { id: '22', label: '무보강용(PCB)' },
      { id: '23', label: '보강용(Plate)' },
    ],
  }

  const hasSubCategories = (category: string): category is CategoryKey => {
    return (
      Object.keys(subCategories).includes(category) &&
      !!subCategories[category as CategoryKey]?.length
    )
  }

  const [showSubCategories, setShowSubCategories] = useState(
    hasSubCategories(categoryId),
  )

  // URL 매개변수 변경 시 상태 업데이트
  useEffect(() => {
    const category = categoryId as CategoryKey | 'all'
    setSelectedCategory(category)
    setSelectedSubCategory(subCategoryId)
    setShowSubCategories(hasSubCategories(categoryId))

    // URL 매개변수 변경 시 직접 fetchProducts 호출
    fetchProducts(category, subCategoryId)
  }, [location.pathname])

  // 상위 카테고리 탭 아이템 생성
  const categoryTabItems: TabItem[] = categories.map((category) => ({
    value: category.id,
    label: category.label,
    content: <></>,
  }))

  // 현재 선택된 카테고리에 따른 하위 카테고리 탭 아이템 생성
  const getSubCategoryTabItems = () => {
    if (!hasSubCategories(selectedCategory)) return []

    return (
      subCategories[selectedCategory as CategoryKey]?.map((sub) => ({
        value: sub.id,
        label: sub.label,
        content: <></>,
      })) || []
    )
  }
  // 상품 데이터 가져오기
  const fetchProducts = async (
    category: CategoryKey | 'all',
    subCategory: string,
  ) => {
    setLoading(true)
    setProducts([])
    try {
      let endpoint = '/api/product'

      if (category !== 'all') {
        if (subCategory !== 'all' && hasSubCategories(category)) {
          endpoint += `/${subCategory}`
        } else {
          endpoint += `/${category}`
        }
      }

      const response =
        await apiRequester.get<ApiResponse<ProductProps[]>>(endpoint)

      if (response.data.status === 'success') {
        console.log(response.data.data)
        setProducts(response.data.data)
      } else {
        console.error(response.data.message)
        setProducts([])
      }
    } catch (error) {
      console.error('상품 데이터를 가져오는 중 오류 발생:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // 상위 카테고리 변경 핸들러
  const handleCategoryChange = (value: string) => {
    const newCategory = value === 'all' ? '' : value
    navigate(`/product/${newCategory}`)
  }

  // 하위 카테고리 변경 핸들러
  const handleSubCategoryChange = (value: string) => {
    const newSubCategory = value === 'all' ? '' : value
    navigate(`/product/${categoryId}/${newSubCategory}`)
  }

  return (
    <Container>
      <HeaderContainer>
        <HomeHeader />
      </HeaderContainer>

      <TabsContainer>
        {/* 상위 카테고리 탭 */}
        <StyledTabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          tabs={categoryTabItems}
        />
      </TabsContainer>

      {/* 하위 카테고리 탭 (조건부 렌더링) */}
      {showSubCategories && hasSubCategories(selectedCategory) && (
        <TabsContainer>
          <StyledTabs
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
            tabs={getSubCategoryTabItems()}
          />
        </TabsContainer>
      )}

      {loading ? (
        <div className="flex justify-center items-center flex-1">
          로딩 중...
        </div>
      ) : (
        <ProductList products={products} />
      )}

      <NavBarContainer>
        <NavBar />
      </NavBarContainer>
    </Container>
  )
}
