// 피드 데이터 타입 정의
export interface FeedData {
  id: number
  username: string
  profileImage: string
  description: string
  isFollowing: boolean
  images: string[]
  productTags?: ProductTag[] // 첫 번째 이미지에 대한 상품 태그
  likeCount: number
  commentCount: number
  content: string
  hashtags: string[]
  timeAgo: string
  isLiked: boolean
  isBookmarked: boolean
}

// 피드 상태
export interface HomeFeedListProps {
  feeds: FeedData[]
  isLoading?: boolean
}

// 피드 데이터
export interface HomeFeedProps {
  feed: FeedData
}

export interface HomeFeedImgProps {
  mainImages?: string[]
  productTags?: ProductTag[]
}

export interface HomeFeedTextProps {
  content: string
  hashtags: string[]
  timeAgo: string
}

export interface HomeFeedInteractionProps {
  likeCount: number
  commentCount: number
  isLiked?: boolean
  isBookmarked?: boolean
  feedId: number
}

export interface HomeFeedProfileProps {
  username: string
  profileImage: string
  description: string
  isFollowing: boolean
  onFollowToggle?: (newFollowingState: boolean) => void
}

export interface HomeFeedTagProps {
  productTags?: ProductTag[]
  showTags: boolean // 태그 표시 여부 상태 추가
}

export interface TagToggleButtonProps {
  onClick: () => void
}

// 상품 태그 데이터 모델
export interface ProductTag {
  id: number
  name: string
  price: string
  x: number // 이미지 내 x 좌표 (0~100 범위의 퍼센트 값)
  y: number // 이미지 내 y 좌표 (0~100 범위의 퍼센트 값)
  thumbnail?: string
}

// 태그된 상품 리스트
export interface HomeTagListModalProps {
  productTags?: ProductTag[]
  triggerComponent?: React.ReactNode
}

// 댓글 데이터 모델
export interface CommentData {
  id: number
  username: string
  profileImage: string
  content: string
  timeAgo: string
  // mentionedUser?: string // @ 멘션된 사용자 - 추후개발발
}

// 댓글 컴포넌트 Props
export interface CommentProps {
  comment: CommentData
}

// 댓글 목록 Props
export interface CommentListProps {
  comments: CommentData[]
  // isLoading?: boolean
}

// 댓글 입력 Props
export interface CommentInputProps {
  feedId: number
  onCommentSubmit: (content: string) => void
}

// 피드 작성 드래그 이미지 Props
export interface DraggableImageItemProps {
  image: string
  index: number
  moveImage: (dragIndex: number, hoverIndex: number) => void
  removeImage: (index: number) => void
}

// 드래그 아이템
export interface DragItem {
  index: number
  id: string
  type: string
}

// 사진 추가
export interface WriteSelectImageProps {
  onImagesChange?: (images: string[]) => void
}

export interface ProductItem {
  categoryId: number
  categoryName: string
  itemId: number
  itemName: string
  price: number
  imageUrl: string
}

// 태그 포인트 박스
export interface TagPointAndInfoProps {
  tag: ProductTag
  isBeingDragged: boolean
  tagX: number
  tagY: number
  onDragStart: (e: React.MouseEvent<HTMLDivElement>, tag: ProductTag) => void
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>, tag: ProductTag) => void
}

// 피드 작성
export interface CreateFeedDTO {
  content: string
  products: ProductPosition[]
  hashtags: string[]
}

// 상품 태그 위치
export interface ProductPosition {
  productId: number
  imageOrder: number
  positionX: number
  positionY: number
  productName?: string
}

// 상품 찜 목록
export interface FavoriteProduct {
  productId: number
  categoryId: number
  productName: string
  price: number
  productUrl: string
  productImage: string
  manufacturer: string
  descriptions: string | null
}

// 검색 상품 목록
export interface FeedSearchProduct {
  productId: number
  productName: string
  imageUrl: string
  price: number
}
