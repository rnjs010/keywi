import BoardProductCard from './BoardProductCard'
import { Text } from '@/styles/typography'
import { BoardDetailData } from '@/interfaces/BoardInterface'
import { useNavigate } from 'react-router-dom'

export default function BoardDetailMain({ data }: { data: BoardDetailData }) {
  const navigate = useNavigate()

  return (
    <div className="py-4 pb-16">
      {/* 상품 리스트 */}
      <Text variant="body2" weight="bold" color="darkKiwi">
        견적 상품 내역
      </Text>
      {data.products.map((item) => (
        <div
          key={item.productId}
          onClick={() => {
            if (item.categoryId !== 0) {
              navigate(`/product/detail/${item.productId}`)
            }
          }}
          className="cursor-pointer"
        >
          <BoardProductCard data={item} mode="move" />
        </div>
      ))}
      {/* 게시글 내용 및 사진 */}
      <p className="my-4">{data.content}</p>
      {data.imageUrls.map((item) => (
        <img src={item} className="my-2" />
      ))}
    </div>
  )
}
