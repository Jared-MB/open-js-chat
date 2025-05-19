import { Bell, Github } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import {
	SidebarHeader,
	Sidebar,
	SidebarFooter,
	SidebarContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import { Contacts } from "@/modules/contacts/components/contacts";

import { UserProfile } from "./user-profile";
import { Notifications } from "./notifications";
import { ContactsProvider, SocketProvider } from "openjs-chat/react";
import { Suspense } from "react";

export async function AppSidebar() {
	const session = await auth();

	return (
		<SocketProvider uri={`${process.env.SERVER_API}/contacts`}>
			<ContactsProvider id={session?.user?.email ?? ""}>
				<Sidebar>
					<SidebarHeader className="p-4 !flex-row items-center justify-between h-20 border-b">
						<h1 className="text-xl font-bold flex items-center gap-2">
							<Button asChild size="icon" variant="outline">
								<Link
									href="https://github.com/Jared-MB/open-js-chat"
									target="_blank"
									rel="noreferrer noopener"
								>
									<Github />
								</Link>
							</Button>
							<Link href="/">OpenJS Chat</Link>
						</h1>
						<Notifications />
					</SidebarHeader>
					<SidebarContent>
						<Suspense fallback={<div>Loading...</div>}>
							<AppSidebarContent />
						</Suspense>
					</SidebarContent>
					<SidebarFooter>
						<UserProfile />
					</SidebarFooter>
				</Sidebar>
			</ContactsProvider>
		</SocketProvider>
	);
}

async function AppSidebarContent() {
	const session = await auth();

	if (!session || !session.user) {
		return (
			<div className="grid place-content-center">
				<p className="p-6 text-lg text-pretty">
					Inicia sesión para comenzar a chatear con otros usuarios.
				</p>
			</div>
		);
	}

	return <Contacts />;
}
