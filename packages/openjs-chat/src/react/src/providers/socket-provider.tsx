"use client";

import { type Socket, io } from "socket.io-client";
import { createContext, useEffect, useState } from "react";

type SocketContextValue = Socket | null;

export const SocketContext = createContext<SocketContextValue>(null);

export const SocketProvider = ({
	children,
	url,
}: { children: React.ReactNode; url: string }) => {
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
		if (!url) {
			console.error("No url provided");
		}

		connect(url);

		return () => {
			disconnect();
		};
	}, [url]);

	return <SocketContext value={socket}>{children}</SocketContext>;
};
