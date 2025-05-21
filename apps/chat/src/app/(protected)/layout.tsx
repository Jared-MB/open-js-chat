import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/modules/auth/context/session-provider";
import { SocketProvider } from "openjs-chat/react";
import { Suspense } from "react";
import QueryProvider from "@/providers/query-provider";

export async function ProtectedLayoutContent({
	children,
}: { children: React.ReactNode }) {
	return (
		<QueryProvider>
			<SocketProvider uri={`${process.env.SERVER_API}/chat`}>
				<SessionProvider>
					<SidebarProvider>
						<AppSidebar />
						{children}
					</SidebarProvider>
				</SessionProvider>
			</SocketProvider>
			<Toaster />
		</QueryProvider>
	);
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Suspense>
			<ProtectedLayoutContent>{children}</ProtectedLayoutContent>
		</Suspense>
	);
}
