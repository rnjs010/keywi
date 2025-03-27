import BoardProductCard from './BoardProductCard'
import { Text } from '@/styles/typography'
import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { EraseSolid } from 'iconoir-react'
import { useBoardProductStore } from '@/stores/boardStore'
import WriteImage from './WriteImage'

const Container = tw.div`
  flex flex-col px-4 gap-1
`

export default function WriteForm({ onEdit }: { onEdit: () => void }) {
  const selectedProducts = useBoardProductStore(
    (state) => state.selectedProducts,
  )
  const title = useBoardProductStore((state) => state.title)
  const content = useBoardProductStore((state) => state.content)
  const setTitle = useBoardProductStore((state) => state.setTitle)
  const setContent = useBoardProductStore((state) => state.setContent)

  return (
    <Container>
      <div className="flex justify-between items-center">
        <Text variant="body2" weight="bold" color="darkKiwi">
          견적 상품
        </Text>
        <div className="flex items-center gap-1" onClick={onEdit}>
          <EraseSolid color={colors.kiwi} height={`1rem`} width={`1rem`} />
          <Text variant="caption1" weight="bold" color="kiwi">
            상품 수정
          </Text>
        </div>
      </div>

      {/* 선택된 상품들 */}
      {Object.keys(selectedProducts).length > 0 ? (
        Object.entries(selectedProducts).map(([category, product]) => (
          <BoardProductCard key={category} data={product} mode="view" />
        ))
      ) : (
        <div className="bg-pay p-4 rounded-md my-2 text-center">
          <Text variant="body1" weight="regular" color="darkGray">
            선택된 상품이 없습니다.
          </Text>
        </div>
      )}

      {/* 제목 및 내용 입력 */}
      <input
        type="text"
        placeholder="제목을 입력해주세요. (필수)"
        className="w-full border p-2 rounded mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="내용을 입력해주세요. (필수)"
        className="w-full border p-2 rounded h-64"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      {/* 이미지 업로드 */}
      <WriteImage />
    </Container>
  )
}
