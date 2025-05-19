"use client";

import { startTransition, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useChat } from "openjs-chat/react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useMessages } from "../context/messages-context";

export function InputMessage() {
	const { addMessage } = useMessages();
	const { sendMessage } = useChat();
	const { data: session } = useSession();

	const [input, setInput] = useState("");
	const { username } = useParams();

	const handleSubmit = (e: React.FormEvent) =>
		startTransition(() => {
			e.preventDefault();

			if (!session) {
				console.log("No session");
				return;
			}

			if (!session.user?.email) {
				console.log("No user email");
				return;
			}

			const parsedUsername = username?.toString().replaceAll("%40", "@");

			if (!parsedUsername) {
				console.log("No username");
				return;
			}

			addMessage(input);
			setInput("");

			sendMessage({
				userEmail: session.user?.email,
				to: parsedUsername,
				message: input,
			});
		});

	return (
		<form
			onSubmit={handleSubmit}
			className="border-t p-4 flex items-center gap-2 h-20"
		>
			<Input
				className="flex-1"
				autoFocus
				placeholder="Escribe un mensaje..."
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>
			<Button type="submit" size="icon" disabled={!input.trim()}>
				<Send className="h-5 w-5" />
			</Button>
		</form>
	);
}
