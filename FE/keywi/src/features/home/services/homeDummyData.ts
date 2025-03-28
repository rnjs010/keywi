import {
  CommentData,
  FeedData,
  ProductTag,
  ProductItem,
} from '@/interfaces/HomeInterfaces'

// 홈 피드 리스트 용 더미 데이터
export const dummyFeeds: FeedData[] = [
  {
    id: 1,
    username: '옹시미키위러버얍',
    profileImage: 'https://cataas.com/cat/says/1',
    description: '키보드와 고양이를 사랑하는 중',
    isFollowing: false,
    images: [
      'https://picsum.photos/500?random=1',
      'https://picsum.photos/500?random=2',
      'https://picsum.photos/500?random=3',
    ],
    productTags: [
      {
        id: 1,
        name: '하이무 바다소금축',
        price: '13,000원',
        x: 30,
        y: 50,
        thumbnail: 'https://picsum.photos/50?random=101',
      },
      {
        id: 2,
        name: '라이프팩 키캡',
        price: '23,500원',
        x: 75,
        y: 30,
        thumbnail: 'https://picsum.photos/50?random=102',
      },
    ],
    likeCount: 39,
    commentCount: 3,
    content:
      '키위에서 이번에 새로 맞춘 키보드랑 한 컷\n고수님이 상세하게 견적 주셔서 원하는 키보드 겟 해버려따~',
    hashtags: ['바다소금축'],
    timeAgo: '3일 전',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 2,
    username: '메카닉스마스터',
    profileImage: 'https://cataas.com/cat/says/2',
    description: '키보드 제작 전문가',
    isFollowing: true,
    images: [
      'https://picsum.photos/500?random=4',
      'https://picsum.photos/500?random=5',
    ],
    productTags: [
      {
        id: 3,
        name: '체리MX 스위치',
        price: '69,000원',
        x: 25,
        y: 40,
        thumbnail: 'https://picsum.photos/50?random=103',
      },
    ],
    likeCount: 152,
    commentCount: 12,
    content:
      '오늘 완성한 커스텀 키보드입니다. 체리 축 사용, 케이스는 직접 디자인했습니다.\n관심 있으신 분들은 문의주세요!',
    hashtags: ['커스텀키보드', '체리축', '키캡'],
    timeAgo: '7시간 전',
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: 3,
    username: '타건마법사',
    profileImage: 'https://cataas.com/cat/says/3',
    description: '타건 ASMR 전문',
    isFollowing: false,
    images: ['https://picsum.photos/500?random=6'],
    productTags: [
      {
        id: 4,
        name: '홀리팬다 저소음 적축',
        price: '88,000원',
        x: 40,
        y: 35,
        thumbnail: 'https://picsum.photos/50?random=104',
      },
      {
        id: 5,
        name: '키보드 손목 받침대',
        price: '19,900원',
        x: 55,
        y: 70,
        thumbnail: 'https://picsum.photos/50?random=105',
      },
    ],
    likeCount: 87,
    commentCount: 5,
    content:
      '새로운 타건 영상 촬영 중! 오늘은 홀리팬다 저소음 적축을 사용했어요.\n소리가 정말 일품입니다. 내일 영상으로 만나요~',
    hashtags: ['저소음', '적축', 'ASMR'],
    timeAgo: '1일 전',
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 4,
    username: '키보드덕후',
    profileImage: 'https://cataas.com/cat/says/4',
    description: '키보드 리뷰 & 언박싱',
    isFollowing: true,
    images: [
      'https://picsum.photos/500?random=7',
      'https://picsum.photos/500?random=8',
      'https://picsum.photos/500?random=9',
      'https://picsum.photos/500?random=10',
    ],
    productTags: [
      {
        id: 6,
        name: '그루비 키보드 v2',
        price: '329,000원',
        x: 45,
        y: 50,
        thumbnail: 'https://picsum.photos/50?random=106',
      },
    ],
    likeCount: 204,
    commentCount: 23,
    content:
      '드디어 도착한 그 키보드! 언박싱 하자마자 찍었어요.\n대기 리스트에 있던 것 6개월 만에 받았네요. 행복합니다 ㅠㅠ',
    hashtags: ['언박싱', '리미티드에디션', '그루비키보드'],
    timeAgo: '2일 전',
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: 5,
    username: '키캡컬렉터',
    profileImage: 'https://cataas.com/cat/says/5',
    description: '키캡만 500개 보유',
    isFollowing: false,
    images: [
      'https://picsum.photos/500?random=11',
      'https://picsum.photos/500?random=12',
    ],
    likeCount: 63,
    commentCount: 7,
    content:
      '오늘 도착한 한정판 키캡! 색감이 정말 예술이에요.\n이걸로 컬렉션이 더 풍성해졌네요. 다음엔 어떤 키캡을 사야할지 고민중...',
    hashtags: ['키캡', '아트', '컬렉션'],
    timeAgo: '5시간 전',
    isLiked: false,
    isBookmarked: true,
  },
]

export const sampleProductTags: ProductTag[] = [
  {
    id: 1,
    name: '하이무 바다소금축',
    price: '13,000원',
    x: 30,
    y: 45,
    thumbnail: '/images/product1.jpg',
  },
  {
    id: 2,
    name: '라이프팩 키캡',
    price: '23,500원',
    x: 65,
    y: 60,
    thumbnail: '/images/product2.jpg',
  },
]

// 피드별 댓글 더미 데이터
export const dummyComments: Record<number, CommentData[]> = {
  // 피드 ID 1의 댓글
  1: [
    {
      id: 101,
      username: '키보드매니아',
      profileImage: 'https://cataas.com/cat/says/6',
      content: '바다소금축 정말 좋죠! 저도 사용 중인데 타건감이 일품이에요.',
      timeAgo: '2일 전',
    },
    {
      id: 102,
      username: '키보드초보자',
      profileImage: 'https://cataas.com/cat/says/7',
      content: '키캡이 예쁘네요! 어디서 구매하셨나요?',
      timeAgo: '1일 전',
    },
    {
      id: 103,
      username: '기계식러버',
      profileImage: 'https://cataas.com/cat/says/8',
      content: '설명 좀 더 자세히 부탁드려요! 소리는 어떤가요?',
      timeAgo: '12시간 전',
    },
  ],

  // 피드 ID 2의 댓글
  2: [
    {
      id: 201,
      username: '스피드케이',
      profileImage: 'https://cataas.com/cat/says/9',
      content: '이거 어떤 스위치 사용하셨나요?',
      timeAgo: '5시간 전',
    },
    {
      id: 202,
      username: '키위덕후',
      profileImage: 'https://cataas.com/cat/says/10',
      content: '키 배열이 독특하네요, 직접 디자인하신 건가요?',
      timeAgo: '4시간 전',
    },
    {
      id: 203,
      username: '적축러버',
      profileImage: 'https://cataas.com/cat/says/11',
      content: '케이스 디자인 정말 멋지네요! 케이스만 따로 판매하시나요?',
      timeAgo: '3시간 전',
    },
    {
      id: 204,
      username: '나눔해주세요',
      profileImage: 'https://cataas.com/cat/says/12',
      content: '혹시 키보드 만드는 방법 좀 알려주실 수 있나요?',
      timeAgo: '2시간 전',
    },
    {
      id: 205,
      username: '키캡모아',
      profileImage: 'https://cataas.com/cat/says/13',
      content: '키캡 정보 공유 부탁드려요~',
      timeAgo: '1시간 전',
    },
  ],
}

// 예시 상품 데이터
export const dummyProducts: ProductItem[] = [
  {
    categoryId: 1,
    categoryName: '키보드',
    itemId: 1,
    itemName: '하이무 바다소금축 공장윤활',
    price: 130000,
    imageUrl: 'https://picsum.photos/100?random=1',
  },
  {
    categoryId: 2,
    categoryName: '키캡',
    itemId: 2,
    itemName: '라이프팩 키캡',
    price: 45000,
    imageUrl: 'https://picsum.photos/100?random=2',
  },
  {
    categoryId: 3,
    categoryName: '케이스',
    itemId: 3,
    itemName: 'TX120 알루미늄 케이스',
    price: 85000,
    imageUrl: 'https://picsum.photos/100?random=3',
  },
  {
    categoryId: 4,
    categoryName: '스위치',
    itemId: 4,
    itemName: '홀리판다 저소음축',
    price: 15000,
    imageUrl: 'https://picsum.photos/100?random=4',
  },
]
