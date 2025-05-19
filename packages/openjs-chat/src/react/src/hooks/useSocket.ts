"use client"

import { use } from 'react'

import { SocketContext } from '../providers/socket-provider.js'

/**
 * Raw socket hook
 * 
 * If you want to interact with /chat or /contacts websockets,
 * use **useChat** or **useContacts** instead.
 * 
 */
export const useSocket = () => {

    const context = use(SocketContext)

    if (!context) {
        throw new Error('useSocket must be used within SocketProvider')
    }

    return {
        socket: context.socket,
        uri: context.uri,
        emit: (event: string, data: any) => context.socket?.emit(event, data),
        on: (event: string, callback: (data: any) => void) => context.socket?.on(event, callback),
        off: (event: string, callback: (data: any) => void) => context.socket?.off(event, callback),
    }
}

