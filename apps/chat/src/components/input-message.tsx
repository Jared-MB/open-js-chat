"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Paperclip, Send, Smile } from "lucide-react";
import { Input } from "./ui/input";

import { useSocket } from "openjs-chat/react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export function InputMessage() {
	const { emit } = useSocket();
	const { data: session } = useSession();

	const [input, setInput] = useState("");
	const { username } = useParams();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!session) {
			console.log("No session");
			return;
		}

		const parsedUsername = username?.toString().replaceAll("%40", "@");

		emit("message", {
			userEmail: session.user?.email,
			to: parsedUsername,
			message: input,
		});

		setInput("");
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="border-t p-4 flex items-center gap-2 h-20"
		>
			<Button type="button" variant="ghost" size="icon">
				<Paperclip className="h-5 w-5" />
			</Button>
			<Input
				className="flex-1"
				autoFocus
				placeholder="Escribe un mensaje..."
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>
			<Button type="button" variant="ghost" size="icon">
				<Smile className="h-5 w-5" />
			</Button>
			<Button type="submit" size="icon" disabled={!input.trim()}>
				<Send className="h-5 w-5" />
			</Button>
		</form>
	);
}
