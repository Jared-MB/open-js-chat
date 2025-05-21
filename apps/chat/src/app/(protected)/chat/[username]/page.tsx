import { unstable_ViewTransition as ViewTransition } from "react";

import { InputMessage } from "@/modules/chat/components/input-message";
import { Contact } from "@/modules/chat/components/contact";
import { Messages } from "@/modules/chat/components/messages";
import { MessagesProvider } from "@/modules/chat/context/messages-context";

export default function ChatPage({
	params,
}: { params: Promise<{ username: string }> }) {
	return (
		<ViewTransition>
			<MessagesProvider>
				<div className="flex flex-col flex-1">
					<Contact params={params} />
					<Messages />
					<InputMessage />
				</div>
			</MessagesProvider>
		</ViewTransition>
	);
}
