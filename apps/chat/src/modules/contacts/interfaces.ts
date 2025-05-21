export interface Contact {
    id: string;
    name: string;
    avatar?: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
    email: string;
    isGroup?: boolean
}

export interface ContactRequest {
    user: string;
    email: string;
    avatar: string;
    id: string
}