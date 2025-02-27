"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Paperclip, Send, Smile } from "lucide-react";
import { Input } from "./ui/input";
import { useChatStore } from "@/store/chat";

import { format } from "@formkit/tempo";
import { useParams } from "next/navigation";

export function InputMessage() {
	const { username } = useParams();

	const [input, setInput] = useState("");
	const { addMessage, messages } = useChatStore();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		addMessage({
			sender: "You",
			message: input,
			time: format(new Date(), "h:mm A"),
			isUser: true,
			id: (messages.length + 1).toString(),
		});
		setTimeout(() => {
			addMessage({
				sender:
					username?.toString().split("-")[0].replaceAll("%20", " ") ?? "You",
				avatar: "/placeholder.svg?height=40&width=40",
				message: "Hey there! How's it going?",
				time: format(new Date(), "h:mm A"),
				isUser: false,
				id: (messages.length + 2).toString(),
			});
		}, 1000);
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
