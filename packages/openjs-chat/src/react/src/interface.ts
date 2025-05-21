export interface ChatMessage {
    userId: string
    to: string
    message: string
    isGroup: boolean
}

export interface ContactRequest {
    id: string
    username: string
}