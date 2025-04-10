import tw from 'twin.macro'
import { parseOpenGraph } from '@/utils/parseOpenGraph'

const PreviewContainer = tw.div`
  my-4 p-4 border rounded-lg border-gray hover:border-blue-400 transition-colors
`

const PreviewContent = tw.a`
  flex gap-4 items-start no-underline
`

const PreviewImage = tw.img`
  w-24 h-24 object-cover rounded-md
`

const PreviewText = tw.div`
  flex-1 flex flex-col gap-1
`

interface LinkPreviewProps {
  description: string // JSON 문자열 형태의 Open Graph 데이터
  hyperlink: string // 링크 URL
}

export default function LinkPreview({
  description,
  hyperlink,
}: LinkPreviewProps) {
  const ogData = parseOpenGraph(description)

  if (!ogData) {
    return (
      <PreviewContainer>
        <div>미리보기를 로드할 수 없습니다.</div>
      </PreviewContainer>
    )
  }

  return (
    <PreviewContainer>
      <PreviewContent
        href={hyperlink}
        target="_blank"
        rel="noopener noreferrer"
      >
        {ogData.image && (
          <PreviewImage
            src={ogData.image}
            alt={ogData.title || '미리보기 이미지'}
          />
        )}
        <PreviewText>
          <div>{ogData.title}</div>
        </PreviewText>
      </PreviewContent>
    </PreviewContainer>
  )
}
