import type { ChatMessageProps } from "@/components/chat-message";
import { create } from "zustand";

export interface ChatMessage extends ChatMessageProps {
	id: string;
}

interface ChatState {
	messages: ChatMessage[];
	addMessage: (message: ChatMessage) => void;
	setMessages: (messages: ChatMessage[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
	messages: [],
	addMessage: (message) => {
		set((state) => ({
			messages: [...state.messages, message],
		}));
	},
	setMessages: (messages) => {
		set({ messages });
	},
}));
