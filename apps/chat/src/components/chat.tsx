"use client";

import { ChatMessage } from "./chat-message";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useSession } from "next-auth/react";

export interface Message {
	id: string;
	text: string;
	from: string;
	to: string;
	date: Date;
	read: boolean;
}

export function Chat() {
	const { emit, socket, on } = useSocket();
	const { data: session } = useSession();

	const [messages, setMessages] = useState<Message[]>([]);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!socket) {
			console.log("No socket");
			return;
		}

		if (ref.current) {
			ref.current.scrollTop = ref.current.scrollHeight;
		}

		emit("join", {
			userEmail: session?.user?.email,
			otherUserEmail: window.localStorage.getItem("otherUserEmail"),
		});

		on("message", (message: Message) => {
			setMessages((prev) => [...prev, message]);
		});

		on("join", ({ messages: incomingMessages }: { messages: Message[] }) => {
			setMessages((prev) => [...prev, ...incomingMessages]);
		});

		return () => {
			setMessages([]);
		};
	}, [socket]);

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
