import { Text } from '@/styles/typography'

interface NoDataMessageProps {
  text: string
}

export default function NoDataMessage({ text }: NoDataMessageProps) {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-full">
        <div>
          <img src="/spinner/noData.gif" alt="데이터없음" />
          <Text variant="title3" weight="bold" color="gray">
            {text}
          </Text>
        </div>
      </div>
    </>
  )
}
