"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import type { Message } from "./chat";
import { format } from "@formkit/tempo";
import { useSession } from "next-auth/react";

export interface ChatMessageProps {
	sender: string;
	message: string;
	time: string;
	isUser: boolean;
	avatar?: string;
	image?: string;
}

export function ChatMessage({
	to,
	text,
	date,
	read,
	from,
	id,
	email,
}: Message & { email: string }) {
	const isUser = from === email;
	console.log({ from, email });
	const avatar = "";
	const image = "";
	const initials = "";

	return (
		<div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
			<div
				className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} max-w-[80%] gap-2`}
			>
				{!isUser && (
					<Avatar className="h-8 w-8">
						<AvatarImage src={avatar} alt={from} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				)}
				<div>
					<div
						className={`rounded-lg p-3 ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
					>
						{text && <p className="text-sm">{text}</p>}
						{image && (
							<div className="mt-2 overflow-hidden rounded-md">
								<Image
									src={image || "/placeholder.svg"}
									alt="Shared image"
									width={300}
									height={200}
									className="object-cover"
								/>
							</div>
						)}
					</div>
					<p className="text-xs text-muted-foreground mt-1">
						{format({
							date,
							format: "h:mm a",
							tz: "America/Mexico_City",
						})}
					</p>
				</div>
			</div>
		</div>
	);
}
