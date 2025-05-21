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
import { useSession } from "@/modules/auth/context/session-provider";
import { isUUID } from "@/lib/utils";

const MessagesContext = createContext<{
	messages: Message[];
	addMessage: (message: string) => void;
	viewportRef: React.RefObject<HTMLDivElement | null>;
	myId: string;
} | null>(null);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
	const session = useSession();
	const viewportRef = useRef<HTMLDivElement>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const { username } = useParams();
	const [myId, setMyId] = useState<string>("");
	const id = useId();

	const { emit, socket } = useSocket();

	const [optimisticMessages, addOptimisticMessage] = useOptimistic(
		messages,
		(state, newMessage: string) => [
			...state,
			{
				fromUserId: myId,
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

		if (!session) {
			console.log("No session");
			return;
		}

		if (!username) {
			console.log("No username");
			return;
		}

		if (viewportRef?.current) {
			viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
		}

		let target = "";
		const isGroup = isUUID.safeParse(username?.toString());
		if (isGroup.success) {
			target = username?.toString();
		} else {
			target = username?.toString().replaceAll("%40", "@");
		}

		socket.emit("join", {
			userId: session?.user?.id,
			otherUserEmail: target,
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
							msg.fromUserId === message.fromUserId &&
							msg.targetId === message.targetId &&
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
				userId: session?.user?.id,
				otherUserEmail: target,
			});
		};
	}, [socket, session]);

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
