import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

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

export default async function RootLayoutContent({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-sans)] flex h-screen w-full overflow-hidden`}
			>
				{children}
			</body>
		</html>
	);
}
