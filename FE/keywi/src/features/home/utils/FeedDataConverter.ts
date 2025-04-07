//SECTION - api 받은 값이랑 interface 랑 변수, 형식 맞춰주는 함수....
import { FeedData } from '@/interfaces/HomeInterfaces'
import getTimeDiff from '@/utils/getTimeDiff'

// API 응답 데이터를 컴포넌트에서 사용하는 형식으로 변환
export const transformFeedData = (feedData: any): FeedData => {
  // 이미지 배열 추출
  const images = feedData.images.map((img: any) => img.imageUrl).filter(Boolean)

  // 상품 태그 변환
  const productTags = feedData.products.map((product: any) => ({
    id: product.productId,
    name: product.productName,
    price: `${product.price.toLocaleString()}원`,
    x: product.positionX,
    y: product.positionY,
    thumbnail: product.productImage,
  }))

  // 해시태그 배열 추출
  const hashtags = feedData.hashtags.map((tag: any) => tag.name)

  // 시간 변환
  const timeAgo = getTimeDiff(feedData.createdAt)

  return {
    id: feedData.id,
    username: feedData.author.nickname,
    profileImage:
      feedData.author.profileImageUrl || '/default/default_profile_image.png',
    description: feedData.author.bio || '',
    isFollowing: feedData.author.followed,
    authorId: feedData.authorId,
    images,
    productTags,
    likeCount: feedData.likeCount,
    commentCount: feedData.commentCount,
    content: feedData.content,
    hashtags,
    timeAgo,
    isLiked: feedData.liked,
    isBookmarked: feedData.bookmarked,
  }
}
