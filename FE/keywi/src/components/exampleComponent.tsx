// src/components/ExampleComponent.tsx
import tw from 'twin.macro'
// import styled from '@emotion/styled'
import { Text } from '../styles/typography' // 커스텀 된 텍스트 불러오기
import { Search } from 'iconoir-react'
import { colors } from '@/styles/colors'

const Container = tw.div`
  p-6 space-y-6
`
// const Container = styled.div`
//   ${tw`flex flex-col items-center justify-center h-screen bg-gray-100`}
// `
function ExampleComponent() {
  return (
    <Container>
      {/* Using the generic Text component with variant and weight props */}
      <div>
        <Text variant="body1" weight="bold">
          키위 하이하이
        </Text>
      </div>

      {/* Combining typography with other styles using twin.macro */}
      <div>
        <Text variant="caption1" weight="bold">
          테스트중
        </Text>
        {/* 아이콘 import */}
        <Search
          color={colors.darkKiwi}
          height={24}
          width={24}
          name="arrow-right"
        />
      </div>
    </Container>
  )
}

export default ExampleComponent
