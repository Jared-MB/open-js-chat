"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Online } from "@/components/online";

import type { Contact } from "@/modules/contacts/interfaces";
import { useSearchContact } from "../context/search-contact";
import { useMemo } from "react";

export function ContactsList({ contacts }: { contacts: Contact[] }) {
	const { searchQuery } = useSearchContact();

	const filteredContacts = useMemo(() => {
		return contacts.filter((contact) =>
			contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [searchQuery, contacts]);

	return (
		<div className="px-2 w-96 max-h-full">
			{filteredContacts.map((contact) => (
				<Link
					key={contact.id}
					href={`/chat/${contact.email}`}
					className="w-full text-left mb-1 p-3 rounded-lg transition-colors hover:bg-muted/50 flex items-center gap-3"
				>
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
							<p className="text-xs text-muted-foreground">{contact.time}</p>
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
				</Link>
			))}
		</div>
	);
}
