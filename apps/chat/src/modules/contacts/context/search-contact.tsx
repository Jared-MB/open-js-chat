"use client";

import { createContext, useContext, useState } from "react";

export const SearchContactContext = createContext<{
	searchQuery: string;
	setSearchQuery: (searchQuery: string) => void;
} | null>(null);

export const SearchContactProvider = ({
	children,
}: { children: React.ReactNode }) => {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<SearchContactContext value={{ searchQuery, setSearchQuery }}>
			{children}
		</SearchContactContext>
	);
};

export const useSearchContact = () => {
	const context = useContext(SearchContactContext);

	if (!context) {
		throw new Error(
			"useSearchContact must be used within SearchContactProvider",
		);
	}

	return context;
};
