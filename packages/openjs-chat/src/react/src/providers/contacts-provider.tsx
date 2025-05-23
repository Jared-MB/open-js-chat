"use client";

import { createContext, useEffect, useState } from "react";

import { useSocket } from "../hooks/useSocket.js";
import type { ContactRequest } from "../interface.js";

export const ContactsContext = createContext<{
	id: string;
	contactRequests: ContactRequest[];
	acceptedContactRequests: ContactRequest[];
	groupsJoined: {
		name: string;
		id: string;
		createdBy: {
			id: string;
			name: string;
		};
	}[];
} | null>(null);

export const ContactsProvider = ({
	children,
	id,
}: { children: React.ReactNode; id: string }) => {
	const { uri, socket } = useSocket();
	const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
	const [acceptedContactRequests, setAcceptedContactRequests] = useState<
		ContactRequest[]
	>([]);

	const [groupsJoined, setGroupsJoined] = useState<
		{
			name: string;
			id: string;
			createdBy: {
				id: string;
				name: string;
			};
		}[]
	>([]);

	useEffect(() => {
		if (!socket || !id) return;

		socket.emit("subscribe-requests", id);

		socket.on("contact-request", (data) => {
			setContactRequests((prev) => [...prev, data]);
		});

		socket.on("contact-request:accept", (data) => {
			setAcceptedContactRequests((prev) => [...prev, data]);
		});

		socket.on("new-group", (data) => {
			setGroupsJoined((prev) => [...prev, data]);
		});
	}, [socket, id]);

	if (!uri.includes("/contacts")) {
		throw new Error(
			"ContactsProvider must be used within SocketProvider with a contacts uri",
		);
	}

	return (
		<ContactsContext
			value={{ id, contactRequests, acceptedContactRequests, groupsJoined }}
		>
			{children}
		</ContactsContext>
	);
};
