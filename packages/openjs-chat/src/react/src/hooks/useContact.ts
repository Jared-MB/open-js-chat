"use client"

import { useContext } from "react"
import { useSocket } from "./useSocket.js"
import { ContactsContext } from "../providers/contacts-provider.js"

export const useContact = () => {

    const { uri, socket } = useSocket()
    const context = useContext(ContactsContext)

    const sendContactRequest = ({ userEmail, otherUserEmail }: { userEmail: string, otherUserEmail: string }) => {
        socket?.emit('contact-request', {
            userEmail,
            otherUserEmail
        })
    }

    if (!context) {
        throw new Error('useContact must be used within ContactsProvider')
    }

    if (!uri.includes('/contacts')) {
        throw new Error('useContact must be used within SocketProvider with a contacts uri')
    }

    return {
        socket,
        sendContactRequest,
        ...context,
    }
}