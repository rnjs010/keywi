export default function ErrorMessage({ text }: { text?: string }) {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-full">
        <div>
          <img src="/spinner/error.gif" alt="에러발생" />
          <div>{text}</div>
        </div>
      </div>
    </>
  )
}
