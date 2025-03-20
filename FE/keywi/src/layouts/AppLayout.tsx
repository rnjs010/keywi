import React, { ReactNode } from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled'

interface AppLayoutProps {
  children: React.ReactNode
}

// 모바일 컨테이너 - 반응형으로 최대높이/최소넓이 설정
const MobileContainer = styled.div`
  ${tw`relative w-full h-full overflow-hidden`}
  max-width: 480px;
  min-height: 100vh;
`

// 안전 영역(Safe Area) 대응
const SafeAreaContainer = styled.div`
  ${tw`flex flex-col w-full h-full`}
  /* iOS에서 안전 영역 대응 */
  padding-top: env(safe-area-inset-top, 0);
  padding-bottom: env(safe-area-inset-bottom, 0);
`

// 여백 포함 컨테이너
const ContentContainer = styled.div`
  ${tw`flex-1`}
  /* 기본 여백 설정 */
  padding: min(4vh, 1rem) min(5vw, 1.5rem);
`

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <MobileContainer>
      <SafeAreaContainer>
        <ContentContainer>{children}</ContentContainer>
      </SafeAreaContainer>
    </MobileContainer>
  )
}
