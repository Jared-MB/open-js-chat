"use client";

import type { Message as M } from "../interfaces";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { format } from "@formkit/tempo";
import { motion } from "motion/react";
import { useQueryClient } from "@tanstack/react-query";

export interface ChatMessageProps {
	sender: string;
	message: string;
	time: string;
	isUser: boolean;
	avatar?: string;
	image?: string;
}

export function Message({
	targetId,
	text,
	date,
	read,
	fromUserId,
	id,
	mode,
	prevMessageFrom,
}: M & {
	mode: "user" | "group";
	prevMessageFrom: string;
}) {
	const queryClient = useQueryClient();

	const groupMembers =
		queryClient.getQueryData<
			{ userId: string; isAdmin: boolean; username: string; email: string }[]
		>(["group-members", targetId]) ?? [];
	const sendByMessage = groupMembers.find(
		(member) => member.userId === fromUserId,
	);

	const isPreviousMessageFromSameUser = prevMessageFrom === fromUserId;
	const isUser = fromUserId === id;
	const avatar = "";
	const image = "";
	const initials = "";

	return (
		<motion.div
			initial={{
				opacity: 0,
				translateX: -10,
			}}
			animate={{
				opacity: 1,
				translateX: 0,
			}}
			transition={{
				duration: 0.2,
				ease: "easeInOut",
			}}
			layout
			className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
		>
			{mode === "group" && !isUser && !isPreviousMessageFromSameUser && (
				<small className="text-muted-foreground my-1">
					{sendByMessage?.username}
				</small>
			)}
			<div
				className={`grid ${isUser ? "" : "grid-cols-[auto_1fr]"} max-w-[80%] gap-2`}
			>
				{!isUser && !isPreviousMessageFromSameUser ? (
					<Avatar className="h-8 w-8">
						<AvatarImage src={avatar} alt={fromUserId} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				) : (
					<div className="w-8" />
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
		</motion.div>
	);
}
