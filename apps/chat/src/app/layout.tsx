import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import { AppSidebar as Sidebar } from "@/components/sidebar";
import { SessionProvider } from "next-auth/react";

import "./globals.css";
import { auth } from "@/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";

import { SocketProvider } from "openjs-chat/react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "OpenJS Chat",
	description: "Chat de prueba para probar la aplicación de OpenJS Chat",
	openGraph: {
		type: "website",
		url: "https://open-js-chat.vercel.app",
		title: "OpenJS Chat",
		description: "Chat de prueba para probar la aplicación de OpenJS Chat",
		images: [
			{
				url: "https://open-js-chat.vercel.app/favicon.ico",
				width: 630,
				height: 630,
				alt: "OpenJS Chat",
			},
		],
		siteName: "OpenJS Chat",
	},
};

async function RootLayoutContent({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-sans)] flex h-screen w-full overflow-hidden`}
			>
				<SocketProvider uri={`${process.env.SERVER_API}/chat`}>
					<SessionProvider session={session}>
						<SidebarProvider>
							<Sidebar />
							{children}
						</SidebarProvider>
					</SessionProvider>
				</SocketProvider>
				<Toaster />
			</body>
		</html>
	);
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Suspense>
			<RootLayoutContent>{children}</RootLayoutContent>
		</Suspense>
	);
}
