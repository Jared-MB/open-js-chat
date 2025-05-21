"use client";

import { useEffect } from "react";

import { Message } from "./message";

import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutGroup } from "motion/react";
import { useMessages } from "../context/messages-context";

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

	return (
		<ScrollArea className="flex-1 p-4 h-[calc(100dvh-10rem)]" ref={viewportRef}>
			<main className="space-y-4">
				<LayoutGroup>
					{messages.map((message) => (
						<Message key={message.id} {...message} id={myId} />
					))}
				</LayoutGroup>
			</main>
		</ScrollArea>
	);
}
