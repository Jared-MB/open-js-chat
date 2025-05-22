"use client";

import { useEffect } from "react";

import { Message } from "./message";

import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutGroup } from "motion/react";
import { useMessages } from "../context/messages-context";
import { useParams } from "next/navigation";
import { isUUID } from "@/lib/utils";

export function Messages() {
	const { messages, viewportRef, myId } = useMessages();

	useEffect(() => {
		if (viewportRef?.current) {
			viewportRef.current.scrollTo({
				top: viewportRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [messages]);

	const { username } = useParams();

	const isGroup = isUUID.safeParse(username?.toString());

	return (
		<ScrollArea className="flex-1 p-4 h-[calc(100dvh-10rem)]" ref={viewportRef}>
			<main className="space-y-4">
				<LayoutGroup>
					{messages.map((message, index) => (
						<Message
							key={message.id}
							{...message}
							id={myId}
							targetId={username?.toString() ?? message.targetId}
							prevMessageFrom={messages[index - 1]?.fromUserId ?? ""}
							mode={isGroup.success ? "group" : "user"}
						/>
					))}
				</LayoutGroup>
			</main>
		</ScrollArea>
	);
}
