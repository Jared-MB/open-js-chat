import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export interface ChatMessageProps {
	sender: string;
	message: string;
	time: string;
	isUser: boolean;
	avatar?: string;
	image?: string;
}

export default function ChatMessage({
	sender,
	message,
	time,
	isUser,
	avatar,
	image,
}: ChatMessageProps) {
	const initials = sender
		.split(" ")
		.map((n) => n[0])
		.join("");

	return (
		<div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
			<div
				className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} max-w-[80%] gap-2`}
			>
				{!isUser && (
					<Avatar className="h-8 w-8">
						<AvatarImage src={avatar} alt={sender} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				)}
				<div>
					<div
						className={`rounded-lg p-3 ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
					>
						{message && <p className="text-sm">{message}</p>}
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
					<p className="text-xs text-muted-foreground mt-1">{time}</p>
				</div>
			</div>
		</div>
	);
}
