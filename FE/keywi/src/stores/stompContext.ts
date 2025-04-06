import { createContext } from 'react'
import { Client } from '@stomp/stompjs'

export const StompContext = createContext<Client | null>(null)
