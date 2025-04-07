import { Text } from '@/styles/typography'

export default function ErrorMessage({ text }: { text?: string }) {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-full">
        <img src="/spinner/error.gif" alt="에러발생" />
        <Text variant="title3" weight="bold" color="gray">
          {text}
        </Text>
      </div>
    </>
  )
}
