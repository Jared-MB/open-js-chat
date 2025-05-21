"use client";

import { startTransition, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useChat } from "openjs-chat/react";
import { useParams } from "next/navigation";
import { useMessages } from "../context/messages-context";
import { useSession } from "@/modules/auth/context/session-provider";
import { isUUID } from "@/lib/utils";

export function InputMessage() {
	const { addMessage } = useMessages();
	const { sendMessage } = useChat();
	const session = useSession();

	const [input, setInput] = useState("");
	const { username } = useParams();

	const handleSubmit = (e: React.FormEvent) =>
		startTransition(() => {
			e.preventDefault();

			if (!session) {
				console.log("No session");
				return;
			}

			if (!session.user?.id) {
				console.log("No user email");
				return;
			}

			if (!username) {
				console.log("No username");
				return;
			}

			let target = "";
			const isGroup = isUUID.safeParse(username?.toString());
			if (isGroup.success) {
				target = username?.toString();
			} else {
				target = username?.toString().replaceAll("%40", "@");
			}

			addMessage(input);
			setInput("");

			sendMessage({
				userId: session.user?.id,
				to: target,
				message: input,
				isGroup: isGroup.success,
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
