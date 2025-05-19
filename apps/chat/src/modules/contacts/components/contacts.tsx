import { Search } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";

import { SearchContactProvider } from "@/modules/contacts/context/search-contact";
import { SearchContact } from "@/modules/contacts/components/search-contact";
import { ContactsList } from "@/modules/contacts/components/contacts-list";
import { AddContact } from "@/modules/contacts/components/add-contact";
import { getContacts } from "@/modules/contacts/actions/get";
import { auth } from "@/auth";
import { cookies } from "next/headers";

export async function Contacts() {
	const contacts = await getContacts();

	return (
		<SearchContactProvider>
			<section className="flex flex-col">
				<header className="p-4 h-16 flex gap-x-2">
					<div className="relative grow">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<SearchContact />
					</div>
					<AddContact />
				</header>
				<ScrollArea className="h-[calc(100dvh-13rem)]">
					<ContactsList contacts={contacts ?? []} />
				</ScrollArea>
			</section>
		</SearchContactProvider>
	);
}
