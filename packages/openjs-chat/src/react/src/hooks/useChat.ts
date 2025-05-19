"use client";

import type { ChatMessage } from '../interface.js';
import { useSocket } from './useSocket.js'

export const useChat = () => {

    const { emit, uri } = useSocket()

    const sendMessage = (message: ChatMessage) => {
        emit('message', message)
    }

    if (!uri.includes('/chat')) {
        throw new Error('useChat must be used within SocketProvider with a chat uri')
    }

    return {
        sendMessage,
    }
}