import BoardProductCard from './BoardProductCard'
import { Text } from '@/styles/typography'
import { BoardDetailData } from '@/interfaces/BoardInterface'

export default function BoardDetailMain({ data }: { data: BoardDetailData }) {
  return (
    <div className="py-4">
      {/* 상품 리스트 */}
      <Text variant="body2" weight="bold" color="darkKiwi">
        견적 상품 내역
      </Text>
      {data.items.map((item) => (
        <BoardProductCard key={item.itemId} data={item} mode="move" />
      ))}
      {/* 게시글 내용 및 사진 */}
      <p className="my-4">{data.content}</p>
      {data.images.map((item) => (
        <img src={item} />
      ))}
    </div>
  )
}
