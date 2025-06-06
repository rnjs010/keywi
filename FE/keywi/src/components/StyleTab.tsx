//SECTION - 마이페이지, 검색에서 사용하는 탭
import { ReactNode, useEffect, useRef } from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
// TabsContent
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
// 탭 목록 스크롤 컨테이너
const ScrollContainer = styled.div`
  ${tw`
    w-full
    overflow-x-auto
    overflow-y-hidden
    border-b
    border-white
  `}
  scroll-behavior: smooth;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }

  /* iOS 스크롤 부드럽게 */
  -webkit-overflow-scrolling: touch;
`
// 탭 목록 스타일링
const TabsListWrapper = styled(TabsList)`
  ${tw`
    bg-transparent 
    h-9
    shrink-0
    flex
    w-max
    min-w-full
    justify-items-start
  `}
`
// 탭 트리거 버튼 스타일링
const TabsTriggerWrapper = styled(TabsTrigger, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>`
  ${tw`
    flex-1 
    text-base 
    data-[state=active]:text-black 
    data-[state=active]:shadow-none
    data-[state=active]:border-b-2
    data-[state=active]:border-black
    data-[state=active]:rounded-none
    data-[state=active]:font-bold
  `}
`
// // 탭 내용 컨테이너
// const ContentWrapper = tw.div`
//   flex-1
//   relative
// `
// // 탭 내용 스타일링
// const TabsContentWrapper = styled(TabsContent)`
//   ${tw`
//     hidden
//     data-[state=active]:block
//     absolute
//     inset-0
//     overflow-y-auto
//     pb-16
//   `}

//   /* 스크롤바 숨기기 */
//   &::-webkit-scrollbar {
//     display: none;
//   }

//   /* iOS 스크롤 부드럽게 */
//   -webkit-overflow-scrolling: touch;
// `

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
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const currentValue =
    value || defaultValue || (tabs.length > 0 ? tabs[0].value : '')

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentValue && tabRefs.current[currentValue]) {
      // 약간의 지연 후 스크롤 실행 (DOM이 완전히 렌더링 된 후)
      setTimeout(() => {
        tabRefs.current[currentValue]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }, 100)
    }
  }, [currentValue])

  // useEffect(() => {
  //   if (value && tabRefs.current[value]) {
  //     tabRefs.current[value].scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'nearest',
  //       inline: 'center',
  //     })
  //   }
  // }, [value])

  return (
    <TabContainer>
      <TabsWrapper defaultValue={currentValue} onValueChange={onChange}>
        <ScrollContainer ref={scrollContainerRef}>
          <TabsListWrapper>
            {tabs.map((tab) => (
              <TabsTriggerWrapper
                key={tab.value}
                value={tab.value}
                ref={(el) => {
                  tabRefs.current[tab.value] = el
                }}
              >
                {tab.label}
              </TabsTriggerWrapper>
            ))}
          </TabsListWrapper>
        </ScrollContainer>

        {/* <ContentWrapper>
          {tabs.map((tab) => (
            <TabsContentWrapper key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContentWrapper>
          ))}
        </ContentWrapper> */}
      </TabsWrapper>
    </TabContainer>
  )
}
