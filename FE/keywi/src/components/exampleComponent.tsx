// src/components/ExampleComponent.tsx
import tw from 'twin.macro'
// import styled from '@emotion/styled'
import { Text } from '../styles/typography'  // 커스텀 된 텍스트 불러오기 

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
        <Text variant="title1" weight="bold">
          This is Title 1 Bold using the generic Text component
        </Text>
      </div>

      {/* Combining typography with other styles using twin.macro */}
      <div>
        <Text variant="caption1" weight="bold">
          Customized caption with additional styles
        </Text>
      </div>
    </Container>
  )
}

export default ExampleComponent
