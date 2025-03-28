//SECTION - 커스텀 DnD 프로바이더
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'

interface DndWrapperProps {
  children: React.ReactNode
  isMobile: boolean
}

export default function SelectDndWrapper({
  children,
  isMobile,
}: DndWrapperProps) {
  return isMobile ? (
    <DndProvider
      backend={TouchBackend}
      options={{
        enableMouseEvents: true,
        delayTouchStart: 0,
      }}
    >
      {children}
    </DndProvider>
  ) : (
    <DndProvider backend={HTML5Backend}>{children}</DndProvider>
  )
}
