import { Text } from '@/styles/typography'

export default function NoDataMessage({ text }: { text: string }) {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-full">
        <img src="/default/default_product.png" alt="데이터없음" />
        <Text variant="title3" weight="bold" color="gray">
          {text}
        </Text>
      </div>
    </>
  )
}
