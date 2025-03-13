"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Online } from "./online";

import Link from "next/link";

interface Contact {
	id: string;
	name: string;
	avatar?: string;
	lastMessage: string;
	time: string;
	unread: number;
	online: boolean;
	email: string;
}

const contacts: Contact[] = [
	{
		id: "1",
		name: "Jane Doe",
		email: "amunozbaez668@gmail.com",
		avatar: "/placeholder.svg?height=40&width=40",
		lastMessage: "That looks amazing! I love the clean design.",
		time: "10:40 AM",
		unread: 0,
		online: true,
	},
	{
		id: "2",
		name: "John Smith",
		email: "kristall.dev.pos@gmail.com",
		avatar: "/placeholder.svg?height=40&width=40",
		lastMessage: "Can we meet tomorrow to discuss the project?",
		time: "Ayer",
		unread: 2,
		online: false,
	},
];

export function ContactList({ contacts }: { contacts: Contact[] }) {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredContacts = contacts.filter((contact) =>
		contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<section className="flex flex-col">
			<header className="p-4 h-16">
				<div className="relative">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Buscar contactos..."
						className="pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</header>
			<ScrollArea className="h-[calc(100dvh-13rem)]">
				<div className="px-2 w-96 max-h-full">
					{filteredContacts.map((contact) => (
						<Link
							key={contact.id}
							href={`/chat/${contact.email}`}
							className="w-full text-left mb-1 p-3 rounded-lg transition-colors hover:bg-muted/50 inline-block"
						>
							<div className="flex items-center gap-3">
								<div className="relative">
									<Avatar>
										<AvatarImage src={contact.avatar} alt={contact.name} />
										<AvatarFallback>
											{contact.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									{contact.online && <Online />}
								</div>
								<div className="flex-1 overflow-hidden">
									<div className="flex justify-between items-center">
										<h3 className="font-medium truncate">{contact.name}</h3>
										<p className="text-xs text-muted-foreground">
											{contact.time}
										</p>
									</div>
									<div className="flex justify-between items-center">
										<p className="text-sm text-muted-foreground truncate">
											{contact.lastMessage}
										</p>
										{contact.unread > 0 && (
											<span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
												{contact.unread}
											</span>
										)}
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</ScrollArea>
		</section>
	);
}
