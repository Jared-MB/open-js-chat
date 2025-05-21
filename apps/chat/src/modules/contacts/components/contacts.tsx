import { Search } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";

import { SearchContactProvider } from "@/modules/contacts/context/search-contact";
import { SearchContact } from "@/modules/contacts/components/search-contact";
import {
	ContactsList,
	ContactsListSkeleton,
} from "@/modules/contacts/components/contacts-list";
import { getContacts } from "@/modules/contacts/actions/get";
import type { Contact } from "../interfaces";
import { Suspense } from "react";
import { ContactsMenu } from "@/modules/contacts/components/contacts-menu";

export function Contacts() {
	const contacts = getContacts();

	return (
		<SearchContactProvider>
			<section className="flex flex-col">
				<header className="p-4 h-16 flex gap-x-2">
					<div className="relative grow">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<SearchContact />
					</div>
					<ContactsMenu />
				</header>
				<ScrollArea className="h-[calc(100dvh-13rem)]">
					<Suspense fallback={<ContactsListSkeleton />}>
						<UserContacts contacts={contacts} />
					</Suspense>
				</ScrollArea>
			</section>
		</SearchContactProvider>
	);
}

async function UserContacts({
	contacts,
}: { contacts: Promise<Contact[] | null> }) {
	const userContacts = await contacts;

	return <ContactsList contacts={userContacts ?? []} />;
}
