import { Github } from "lucide-react";
import Link from "next/link";
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
import { getSession } from "@/modules/auth/session";

export async function AppSidebar() {
	const session = await getSession();

	return (
		<SocketProvider uri={`${process.env.SERVER_API}/contacts`}>
			<ContactsProvider id={session?.id ?? ""}>
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
						<Contacts />
					</SidebarContent>
					<SidebarFooter>
						<UserProfile />
					</SidebarFooter>
				</Sidebar>
			</ContactsProvider>
		</SocketProvider>
	);
}
