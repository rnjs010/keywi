import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import useImageStore from '@/stores/homeStore'
import TagProductModal from './TagProductModal'
import useProductTag from '../../hooks/useProductTag'
import useTagDragDrop from '../../hooks/useTagDragDrop'
import TagPointInfo from './TagPointInfo'
import TagProductList from './TagProductList'

const Container = tw.div`
  flex
  flex-col
  h-full
  overflow-hidden
`
const MainImgContainer = tw.div`
  w-full
  relative 
  overflow-hidden
  mt-3
  aspect-square
  touch-none
`
const MainImg = tw.img`
  w-full
  h-full
  object-cover
`
const TagButton = tw.button`
  w-full
  flex
  items-center
  justify-center
  py-2
  px-4
  rounded-md
  border
  border-littleGray
  mt-4
`

const ContentContainer = tw.div`
  px-4
  flex
  flex-col
  flex-1
  overflow-hidden
`

export default function TagProductImg() {
  const { images } = useImageStore()

  // 커스텀 훅 사용
  const {
    productTags,
    isModalOpen,
    setIsModalOpen,
    handleTagButtonClick,
    handleSelectProduct,
    handleWriteProduct,
    handleRemoveTag,
  } = useProductTag()

  // 드래그 드롭 커스텀 훅 사용
  const {
    draggedTag,
    imageRef,
    handleDragStart,
    handleMouseMove,
    handleTouchMove,
    handleMouseLeave,
    handleTouchStart,
  } = useTagDragDrop()

  return (
    <Container>
      <MainImgContainer
        ref={imageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
      >
        <MainImg src={images[0]} alt="상품 태그 추가할 메인 이미지" />

        {/* 태그 포인트와 정보 박스 */}
        {productTags.map((tag) => {
          const isBeingDragged = draggedTag?.id === tag.id
          // 드래그 중인 태그는 draggedTag 위치를 사용, 아니면 원래 태그 위치 사용
          const tagX = isBeingDragged ? draggedTag.x : tag.x
          const tagY = isBeingDragged ? draggedTag.y : tag.y

          return (
            <TagPointInfo
              key={tag.id}
              tag={tag}
              isBeingDragged={isBeingDragged}
              tagX={tagX}
              tagY={tagY}
              onDragStart={handleDragStart}
              onTouchStart={handleTouchStart}
            />
          )
        })}
      </MainImgContainer>

      <ContentContainer>
        {/* 태그 추가 버튼 */}
        <TagButton onClick={handleTagButtonClick}>
          <Text>상품태그 추가</Text>
        </TagButton>

        {/* 태그된 상품 목록 */}
        <TagProductList
          productTags={productTags}
          onRemoveTag={handleRemoveTag}
        />
      </ContentContainer>

      {/* 상품 선택 모달 */}
      <TagProductModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="상품태그 추가"
        trigger={<div></div>}
        onSelectProduct={handleSelectProduct}
        onWriteProduct={handleWriteProduct}
      />
    </Container>
  )
}
