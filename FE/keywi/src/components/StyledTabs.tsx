//SECTION - 마이페이지, 검색에서 사용하는 탭
import { ReactNode } from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

// 탭 컨테이너
const TabContainer = tw.div`
  mt-1
  flex 
  flex-col
  flex-1
`

// 스타일링된 탭 컴포넌트
const TabsWrapper = styled(Tabs)`
  ${tw`
    w-full
    flex
    flex-col
    h-full
  `}
`

// 탭 목록 스타일링
const TabsListWrapper = styled(TabsList)`
  ${tw`
    w-full 
    bg-transparent 
    border-b
    border-white
    justify-center
    h-9
    shrink-0
  `}
`

// 탭 트리거 버튼 스타일링
const TabsTriggerWrapper = styled(TabsTrigger)`
  ${tw`
    flex-1 
    text-base 
    data-[state=active]:text-black 
    data-[state=active]:shadow-none
    data-[state=active]:border-b-2
    data-[state=active]:border-black
    data-[state=active]:rounded-none
    data-[state=active]:font-bold
    py-3
  `}
`

// 탭 내용 컨테이너
const ContentWrapper = tw.div`
  flex-1
  relative
`

// 탭 내용 스타일링
const TabsContentWrapper = styled(TabsContent)`
  ${tw`
    hidden
    data-[state=active]:block
    absolute
    inset-0
    overflow-y-auto 
    pb-16
  `}

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }

  /* iOS 스크롤 부드럽게 */
  -webkit-overflow-scrolling: touch;
`

// 탭 아이템 타입 정의
export interface TabItem {
  value: string
  label: string
  content: ReactNode
}

// 스타일 탭 컴포넌트 props 타입 정의
export interface StyledTabsProps {
  tabs: TabItem[]
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
}

export default function StyledTabs({
  tabs,
  defaultValue,
  value,
  onChange,
}: StyledTabsProps) {
  // 기본값이 없을 경우 첫 번째 탭의 값을 기본값으로 사용
  const defaultTab =
    value !== undefined
      ? value
      : defaultValue || (tabs.length > 0 ? tabs[0].value : '')

  return (
    <TabContainer>
      <TabsWrapper defaultValue={defaultTab} onValueChange={onChange}>
        <TabsListWrapper>
          {tabs.map((tab) => (
            <TabsTriggerWrapper key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTriggerWrapper>
          ))}
        </TabsListWrapper>

        <ContentWrapper>
          {tabs.map((tab) => (
            <TabsContentWrapper
              key={tab.value}
              value={tab.value}
              // 커스텀 데이터 속성 추가
              data-tab-value={tab.value}
              id={`tab-content-${tab.value}`}
            >
              {tab.content}
            </TabsContentWrapper>
          ))}
        </ContentWrapper>
      </TabsWrapper>
    </TabContainer>
  )
}
