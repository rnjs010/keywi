import { useEffect, useState } from 'react'
import tw from 'twin.macro'
import { BASE_URL } from '@/config'
import { OpenGraphData } from '@/interfaces/OpenGraphData'
import LoadingMessage from '@/components/message/LoadingMessage'

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
  url: string
}

export default function LinkPreview({ url }: LinkPreviewProps) {
  const [ogData, setOgData] = useState<{
    title?: string
    description?: string
    image?: string
    hostname?: string
  }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // LinkPreview.tsx
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/product/og?url=${encodeURIComponent(url)}`,
        )

        if (!response.ok) throw new Error('Request failed')

        const data = (await response.json()) as OpenGraphData
        setOgData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  if (error) {
    return (
      <PreviewContainer>
        <div>
          <span className="url-container">{url}</span>
        </div>
      </PreviewContainer>
    )
  }

  if (loading) {
    return <LoadingMessage />
  }

  return (
    <PreviewContainer>
      <PreviewContent href={url} target="_blank" rel="noopener noreferrer">
        {ogData.image && (
          <PreviewImage
            src={ogData.image}
            alt={ogData.title || '미리보기 이미지'}
          />
        )}
        <PreviewText>
          <div>{ogData.title || '제목 없음'}</div>
          <div>{ogData.description || '설명 없음'}</div>
          <div>{ogData.hostname}</div>
        </PreviewText>
      </PreviewContent>
    </PreviewContainer>
  )
}
