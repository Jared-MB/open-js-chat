"use client";

import { type Socket, io } from "socket.io-client";
import { createContext, useEffect, useState } from "react";

type SocketNamespace = "chat" | "contacts";

type SocketURI = `${string}/${SocketNamespace}`;

type SocketContextValue = Socket | null;

export const SocketContext = createContext<{
	socket: SocketContextValue;
	uri: SocketURI;
} | null>(null);

export const SocketProvider = ({
	children,
	uri,
}: { children: React.ReactNode; uri: SocketURI }) => {
	const [socket, setSocket] = useState<SocketContextValue>(null);

	const connect = (url: string) => {
		setSocket(
			io(url, {
				withCredentials: true,
			}),
		);
	};

	const disconnect = () => {
		socket?.disconnect();
		setSocket(null);
	};

	useEffect(() => {
		if (!uri) {
			console.error("No uri provided");
		}

		connect(uri);

		return () => {
			disconnect();
		};
	}, [uri]);

	return <SocketContext value={{ socket, uri }}>{children}</SocketContext>;
};
