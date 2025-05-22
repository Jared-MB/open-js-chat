"use client";

import { Bell, MessagesSquare, User2, X } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Button } from "./ui/button";
import { useContact } from "openjs-chat/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
	refetchContacts,
	refetchContactsRequests,
} from "@/modules/contacts/actions/get";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

interface Notification {
	id: number | string;
	from: string;
	text: string;
	type: "CONTACT_REQUEST" | "MESSAGE" | "GROUP_JOINED";
}

export function Notifications() {
	const queryClient = useQueryClient();

	const [unread, setUnread] = useState(0);
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const { contactRequests, acceptedContactRequests, groupsJoined, id } =
		useContact();

	const prevGroupsJoinedLength = useRef(groupsJoined.length);
	const prevContactRequestsLength = useRef(contactRequests.length);
	const prevAcceptedContactRequestsLength = useRef(
		acceptedContactRequests.length,
	);

	useEffect(() => {
		if (contactRequests.length > prevContactRequestsLength.current) {
			setUnread((prev) => prev + 1);
			const lastContactRequest = contactRequests.at(-1);

			const notification: Notification = {
				id: Math.random(),
				from: lastContactRequest?.username ?? "",
				text: "te ha enviado una solicitud de amistad",
				type: "CONTACT_REQUEST",
			};

			setNotifications((prev) => [notification, ...prev]);

			toast.info(
				<div>
					<strong>{lastContactRequest?.username}</strong> te ha mandado
					solicitud de amistad
				</div>,
			);

			refetchContactsRequests();
		}

		prevContactRequestsLength.current = contactRequests.length;
	}, [contactRequests]);

	useEffect(() => {
		if (
			acceptedContactRequests.length > prevAcceptedContactRequestsLength.current
		) {
			setUnread((prev) => prev + 1);
			const lastContactRequest = acceptedContactRequests.at(-1);

			const notification: Notification = {
				id: Math.random(),
				from: lastContactRequest?.username ?? "",
				text: "te ha aceptado una solicitud de amistad",
				type: "CONTACT_REQUEST",
			};

			setNotifications((prev) => [notification, ...prev]);

			toast.info(
				<div>
					<strong>{lastContactRequest?.username}</strong> te ha aceptado una
					solicitud de amistad
				</div>,
			);

			refetchContacts();
		}

		prevAcceptedContactRequestsLength.current = acceptedContactRequests.length;
	}, [acceptedContactRequests]);

	useEffect(() => {
		if (groupsJoined.length > prevGroupsJoinedLength.current) {
			const lastGroupJoined = groupsJoined.at(-1);

			if (id === lastGroupJoined?.createdBy.id) {
				refetchContacts();
				queryClient.invalidateQueries({
					queryKey: ["contacts"],
				});
				return;
			}

			setUnread((prev) => prev + 1);

			const notification: Notification = {
				id: lastGroupJoined?.id ?? "",
				from: lastGroupJoined?.createdBy?.name ?? "",
				text: "te ha unido a un grupo",
				type: "GROUP_JOINED",
			};

			setNotifications((prev) => [notification, ...prev]);

			toast.info(
				<div>
					<strong>{lastGroupJoined?.createdBy?.name}</strong> te ha unido a un
					grupo
				</div>,
			);
			queryClient.invalidateQueries({
				queryKey: ["contacts"],
			});
			refetchContacts();
		}

		prevGroupsJoinedLength.current = groupsJoined.length;
	}, [groupsJoined]);

	const handleClick = () => {
		setUnread(0);
	};

	const dismissNotification = (id: number | string) => {
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id),
		);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					size="icon"
					variant="outline"
					className="ml-auto relative"
					onClick={handleClick}
				>
					<Bell />
					{unread > 0 && (
						<span className="absolute -bottom-2 -right-2 size-6 rounded-full grid place-content-center bg-primary text-primary-foreground">
							{unread}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-96 flex flex-col gap-2">
				<header>
					<h4 className="font-semibold flex items-center gap-2">
						<Bell className="size-4" />
						Notificaciones
					</h4>
				</header>
				<LayoutGroup>
					<AnimatePresence>
						{notifications.length === 0 && (
							<motion.div
								exit={{
									opacity: 0,
									rotateX: 50,
								}}
								initial={{
									opacity: 0,
									rotateX: -50,
								}}
								animate={{
									opacity: 1,
									rotateX: 0,
								}}
								transition={{
									duration: 0.3,
									ease: "easeInOut",
								}}
								key="empty"
								layout
								className="grid place-content-center gap-4 p-4 hover:bg-primary/5 transition-colors duration-100 rounded-md relative"
							>
								<p className="text-sm text-pretty">
									¡Aún no hay notificaciones!
								</p>
							</motion.div>
						)}
						{notifications.length > 0 &&
							notifications.map((notification, index) => (
								<motion.div
									exit={{
										opacity: 0,
										translateX: 10,
									}}
									initial={{
										opacity: 0,
										translateX: -10,
									}}
									animate={{
										opacity: 1,
										translateX: 0,
										transition: {
											delay: index * 0.1,
										},
									}}
									transition={{
										duration: 0.2,
										ease: "easeInOut",
									}}
									key={notification.id}
									layout
									className="flex flex-col gap-4 hover:bg-primary/5 transition-colors duration-100 p-4 rounded-md relative"
								>
									<button
										type="button"
										onClick={() => dismissNotification(notification.id)}
										className="absolute top-1 right-1 p-1 rounded-full hover:bg-primary/10 transition-colors cursor-pointer"
									>
										<X className="size-5" />
									</button>
									<div className="flex items-center gap-4">
										<div className="bg-primary/10 p-2 rounded-full">
											{notification.type === "CONTACT_REQUEST" ? (
												<User2 className="size-6" />
											) : (
												<MessagesSquare className="size-6" />
											)}
										</div>
										<p className="text-sm text-pretty">
											<strong className="mr-2">{notification.from}</strong>
											{notification.text}
										</p>
									</div>
									<div>
										<Button variant="outline" size="sm" asChild>
											{notification.type === "GROUP_JOINED" ? (
												<Link href={`/chat/${notification.id}`}>Ver más</Link>
											) : (
												<Link href="/profile/contact-requests">Ver más</Link>
											)}
										</Button>
									</div>
								</motion.div>
							))}
					</AnimatePresence>
				</LayoutGroup>
			</PopoverContent>
		</Popover>
	);
}
