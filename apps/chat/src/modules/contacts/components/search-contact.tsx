"use client";

import { useSearchContact } from "@/modules/contacts/context/search-contact";
import { Input } from "@/components/ui/input";

export function SearchContact() {
	const { searchQuery, setSearchQuery } = useSearchContact();

	return (
		<Input
			type="search"
			placeholder="Buscar contactos..."
			className="pl-8"
			value={searchQuery}
			onChange={(e) => setSearchQuery(e.target.value)}
		/>
	);
}
