"use client";

import {
	createContext,
	startTransition,
	useContext,
	useEffect,
	useId,
	useOptimistic,
	useRef,
	useState,
} from "react";
import type { Message } from "../interfaces";
import { useParams } from "next/navigation";
import { useSocket } from "openjs-chat/react";
import { useSession } from "next-auth/react";

const MessagesContext = createContext<{
	messages: Message[];
	addMessage: (message: string) => void;
	viewportRef: React.RefObject<HTMLDivElement | null>;
	myId: string;
} | null>(null);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
	const viewportRef = useRef<HTMLDivElement>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const { username } = useParams();
	const [myId, setMyId] = useState<string>("");
	const id = useId();

	const { emit, socket } = useSocket();
	const { data: session } = useSession();

	const [optimisticMessages, addOptimisticMessage] = useOptimistic(
		messages,
		(state, newMessage: string) => [
			...state,
			{
				from: myId,
				text: newMessage,
				id: `optimistic-${id}`,
			} as Message,
		],
	);

	useEffect(() => {
		if (!socket) {
			console.log("No socket");
			return;
		}

		if (viewportRef?.current) {
			viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
		}

		const parsedUsername = username?.toString().replaceAll("%40", "@");

		socket.emit("join", {
			userEmail: session?.user?.email,
			otherUserEmail: parsedUsername,
		});

		socket.on(
			"join",
			({
				messages: incomingMessages,
				myId,
			}: { messages: Message[]; myId: string }) => {
				console.log("incomingMessages", incomingMessages);
				setMessages(incomingMessages);
				setMyId(myId);
			},
		);

		socket.on("message", (message: Message) => {
			console.log("message", message);
			startTransition(() => {
				setMessages((prev) => {
					// Verificar si ya existe un mensaje optimista con el mismo contenido
					const existingOptimisticMsg = prev.find(
						(msg) =>
							msg.from === message.from &&
							msg.to === message.to &&
							msg.text === message.text &&
							msg.id.startsWith("optimistic-"),
					);

					// Si encontramos un mensaje optimista, lo reemplazamos
					if (existingOptimisticMsg) {
						return prev.map((msg) =>
							msg.id === existingOptimisticMsg.id ? message : msg,
						);
					}

					// Verificamos duplicados por ID
					const isDuplicate = prev.some((msg) => msg.id === message.id);
					if (isDuplicate) {
						return prev;
					}

					return [...prev, message];
				});
			});
		});

		return () => {
			emit("leave", {
				userEmail: session?.user?.email,
				otherUserEmail: parsedUsername,
			});
		};
	}, [socket]);

	return (
		<MessagesContext
			value={{
				messages: optimisticMessages,
				addMessage: addOptimisticMessage,
				viewportRef,
				myId,
			}}
		>
			{children}
		</MessagesContext>
	);
}

export function useMessages() {
	const context = useContext(MessagesContext);

	if (!context) {
		throw new Error("useMessages must be used within MessagesProvider");
	}

	return context;
}
