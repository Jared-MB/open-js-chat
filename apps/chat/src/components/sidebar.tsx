import { Github, Menu, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactList } from "@/components/contact-list";
import Link from "next/link";
import { UserProfile } from "./user-profile";
import {
	SidebarHeader,
	Sidebar,
	SidebarFooter,
	SidebarContent,
} from "./ui/sidebar";
import { auth } from "@/auth";

export async function AppSidebar() {
	const session = await auth();

	if (!session || !session.user) {
		return (
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
						OpenJS Chat <small className="text-xs">(Client)</small>
					</h1>
					<Button variant="ghost" size="icon">
						<MoreVertical className="h-5 w-5" />
					</Button>
				</SidebarHeader>
				<SidebarContent className="grid place-content-center">
					<p className="p-6 text-lg text-pretty">
						Inicia sesión para comenzar a chatear con otros usuarios.
					</p>
				</SidebarContent>
				<SidebarFooter>
					<UserProfile />
				</SidebarFooter>
			</Sidebar>
		);
	}

	const contacts = await fetch(`${process.env.SERVER_API}/user`)
		.then((res) => res.json())
		.then((res) => res.data);

	return (
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
					OpenJS Chat <small className="text-xs">(Client)</small>
				</h1>
				<Button variant="ghost" size="icon">
					<MoreVertical className="h-5 w-5" />
				</Button>
			</SidebarHeader>
			<SidebarContent>
				<ContactList contacts={contacts} />
			</SidebarContent>
			<SidebarFooter>
				<UserProfile />
			</SidebarFooter>
		</Sidebar>
	);
}
