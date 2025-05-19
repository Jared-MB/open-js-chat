export interface Contact {
    id: string;
    name: string;
    avatar?: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
    email: string;
}

export interface ContactRequest {
    user: string;
    email: string;
    avatar: string;
    id: string
}