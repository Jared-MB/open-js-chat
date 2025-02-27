import { Chat } from "@/components/chat";
import { ChatUserHeader } from "@/components/chat-user-header";
import { InputMessage } from "@/components/input-message";

export default async function ChatPage({
	params,
}: { params: Promise<{ username: `${string}-${string}` }> }) {
	return (
		<div className="flex flex-col flex-1">
			<ChatUserHeader usernameSlug={(await params).username} />
			<Chat />
			<InputMessage />
		</div>
	);
}
