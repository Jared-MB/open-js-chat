"use client";

import { createContext, useContext } from "react";
import { getSession, type User } from "../session";
import { useQuery } from "@tanstack/react-query";

export const SessionContext = createContext<{ user?: User } | undefined>(
	undefined,
);

export function SessionProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data: session } = useQuery({
		queryKey: ["session"],
		queryFn: () => getSession(),
	});

	return <SessionContext value={{ user: session }}>{children}</SessionContext>;
}

export function useSession() {
	const context = useContext(SessionContext);

	if (!context) {
		throw new Error("useSession must be used within a SessionProvider");
	}

	return context;
}
