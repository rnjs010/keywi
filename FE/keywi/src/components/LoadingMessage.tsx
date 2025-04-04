import { Text } from '@/styles/typography'

export default function LoadingMessage() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-full">
        <div>
          <img
            src="/spinner/loading.gif"
            alt="로딩 중..."
            className="w-16 h-16"
          />
          <Text variant="title3" weight="bold" color="darkKiwi">
            로딩 중...
          </Text>
        </div>
      </div>
    </>
  )
}
