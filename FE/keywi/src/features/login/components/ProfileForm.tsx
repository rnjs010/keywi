import tw from 'twin.macro'
import styled from '@emotion/styled'
import { ReactNode } from 'react'

const Container = styled.div`
  ${tw`
    w-full 
    max-w-screen-sm 
    mx-auto 
    flex 
    flex-col 
    h-screen 
    p-4 
    box-border 
    overflow-x-hidden
  `}
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`

interface ProfileFormProps {
  header: ReactNode
  imageInput: ReactNode
  nameInput: ReactNode
  actionButton: ReactNode
}

export default function ProfileForm({
  header,
  imageInput,
  nameInput,
  actionButton,
}: ProfileFormProps) {
  return (
    <Container>
      {header}
      {imageInput}
      {nameInput}
      {actionButton}
    </Container>
  )
}
