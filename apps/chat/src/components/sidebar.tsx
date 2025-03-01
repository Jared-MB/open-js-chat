import { Github, Menu, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ContactList } from "@/components/contact-list";
import Link from "next/link";
import { UserProfile } from "./user-profile";

export function Sidebar() {
	return (
		<>
			<aside className="hidden md:flex md:w-96 flex-col border-r bg-background h-dvh">
				<header className="p-4 flex items-center justify-between h-20 border-b">
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
				</header>
				<ContactList />
				<UserProfile />
			</aside>
			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden absolute top-2 left-2 z-10"
					>
						<Menu className="h-5 w-5" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="p-0">
					<div className="p-4">
						<h1 className="text-xl font-bold">Messages</h1>
					</div>
					<Separator />
					<ContactList />
				</SheetContent>
			</Sheet>
		</>
	);
}
