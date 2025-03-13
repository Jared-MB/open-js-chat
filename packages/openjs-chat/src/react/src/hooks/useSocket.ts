"use client"

import { use } from 'react'

import { SocketContext } from '../providers/socket-provider.js'

export const useSocket = () => {

    const socket = use(SocketContext)

    return {
        socket,
        emit: (event: string, data: any) => socket?.emit(event, data),
        on: (event: string, callback: (data: any) => void) => socket?.on(event, callback),
        off: (event: string, callback: (data: any) => void) => socket?.off(event, callback),
    }
}