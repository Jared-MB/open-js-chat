"use client";

import { ChatMessage } from "./chat-message";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import { useSocket } from "openjs-chat/react";
import { useParams } from "next/navigation";

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
	const [myId, setMyId] = useState<string>("");

	const ref = useRef<HTMLDivElement>(null);

	const { username } = useParams();

	useEffect(() => {
		if (!socket) {
			console.log("No socket");
			return;
		}

		if (ref.current) {
			ref.current.scrollTop = ref.current.scrollHeight;
		}

		const parsedUsername = username?.toString().replaceAll("%40", "@");

		emit("join", {
			userEmail: session?.user?.email,
			otherUserEmail: parsedUsername,
		});

		on(
			"join",
			({
				messages: incomingMessages,
				myId,
			}: { messages: Message[]; myId: string }) => {
				setMessages(incomingMessages);
				setMyId(myId);
			},
		);

		on("message", (message: Message) => {
			setMessages((prev) => {
				const lastMessage = prev.at(-1);
				if (lastMessage?.id === message.id) {
					return prev;
				}
				return [...prev, message];
			});
		});

		return () => {
			emit("leave", {
				userEmail: session?.user?.email,
				otherUserEmail: parsedUsername,
			});
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
					<ChatMessage key={message.id} {...message} email={myId} />
				))}
			</main>
		</ScrollArea>
	);
}
