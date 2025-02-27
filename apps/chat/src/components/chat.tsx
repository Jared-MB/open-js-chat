"use client";

import { useChatStore, type ChatMessage as CM } from "@/store/chat";
import ChatMessage from "./chat-message";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useRef, useState } from "react";

const MESSAGES: CM[] = [
	{
		id: "1",
		sender: "Jane Doe",
		avatar: "/placeholder.svg?height=40&width=40",
		message: "Hey there! How's it going?",
		time: "10:30 AM",
		isUser: false,
	},
	{
		id: "2",
		sender: "You",
		message: "I'm doing great! Just working on a new project.",
		time: "10:32 AM",
		isUser: true,
	},
	{
		id: "3",
		sender: "Jane Doe",
		avatar: "/placeholder.svg?height=40&width=40",
		message: "That sounds interesting! What kind of project is it?",
		time: "10:33 AM",
		isUser: false,
	},
	{
		id: "4",
		sender: "You",
		message:
			"I'm building a chat application UI with Next.js and shadcn/ui components.",
		time: "10:35 AM",
		isUser: true,
	},
	{
		id: "5",
		sender: "Jane Doe",
		avatar: "/placeholder.svg?height=40&width=40",
		message:
			"Wow, that's exactly what we're looking at right now! Can you share a screenshot?",
		time: "10:36 AM",
		isUser: false,
	},
	{
		id: "6",
		sender: "You",
		message: "Sure, here's how it's looking so far:",
		time: "10:38 AM",
		isUser: true,
	},
	{
		id: "7",
		sender: "You",
		message: "Look at this beautiful image!",
		time: "10:38 AM",
		isUser: true,
		image: "/placeholder.svg?height=300&width=400",
	},
	{
		id: "8",
		sender: "Jane Doe",
		avatar: "/placeholder.svg?height=40&width=40",
		message: "That looks amazing! I love the clean design.",
		time: "10:40 AM",
		isUser: false,
	},
	{
		id: "9",
		sender: "Jane Doe",
		avatar: "/placeholder.svg?height=40&width=40",
		message: "I'm excited to see what you build next!",
		time: "10:41 AM",
		isUser: false,
	},
];

export function Chat() {
	const { messages, setMessages } = useChatStore();

	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setMessages(MESSAGES);
		if (ref.current) {
			ref.current.scrollTop = ref.current.scrollHeight;
		}

		return () => {
			setMessages([]);
		};
	}, []);

	useEffect(() => {
		if (ref.current) {
			ref.current.scrollTo({
				top: ref.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [messages]);

	return (
		<ScrollArea className="flex-1 p-4 h-[calc(100dvh-10rem)]" ref={ref}>
			<main className="space-y-4">
				{messages.map((message) => (
					<ChatMessage key={message.id} {...message} />
				))}
			</main>
		</ScrollArea>
	);
}
