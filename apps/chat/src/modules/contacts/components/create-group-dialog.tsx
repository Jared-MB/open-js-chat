"use client";

import { useMemo, useState } from "react";
import { Check, Search, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getContacts } from "../actions/get";

// Tipo para los contactos
type Contact = {
	id: string;
	name: string;
	email: string;
	avatar?: string;
};

// Datos de ejemplo - reemplazar con tus datos reales
const mockContacts: Contact[] = [
	{ id: "1", name: "Jared Test", email: "jared@example.com" },
	{ id: "2", name: "Testing", email: "testing@example.com" },
	{ id: "3", name: "Jared Muñoz", email: "jmunoz@example.com" },
	{ id: "4", name: "Ana García", email: "ana@example.com" },
	{ id: "5", name: "Carlos López", email: "carlos@example.com" },
	{ id: "6", name: "María Rodríguez", email: "maria@example.com" },
];

interface CreateGroupDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreateGroup?: (name: string, members: Contact[]) => void;
}

export function CreateGroupDialog({
	open,
	onOpenChange,
	onCreateGroup,
}: CreateGroupDialogProps) {
	const [groupName, setGroupName] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

	const { data: contacts } = useQuery({
		queryKey: ["contacts"],
		queryFn: () => getContacts(),
	});

	const filteredContacts = contacts?.filter(
		(contact) =>
			(contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				contact.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
			!contact?.isGroup,
	);

	const handleSelectContact = (contact: Contact) => {
		if (selectedContacts.some((c) => c.id === contact.id)) {
			setSelectedContacts(selectedContacts.filter((c) => c.id !== contact.id));
		} else {
			setSelectedContacts([...selectedContacts, contact]);
		}
	};

	const handleRemoveContact = (contactId: string) => {
		setSelectedContacts(selectedContacts.filter((c) => c.id !== contactId));
	};

	const handleCreateGroup = () => {
		if (groupName.trim() && selectedContacts.length > 0) {
			onCreateGroup?.(groupName, selectedContacts);
			setGroupName("");
			setSearchQuery("");
			setSelectedContacts([]);
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-xl">Crear grupo</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<label htmlFor="group-name" className="text-sm font-medium">
							Nombre del grupo
						</label>
						<Input
							id="group-name"
							placeholder="Ej: Equipo de Proyecto"
							value={groupName}
							onChange={(e) => setGroupName(e.target.value)}
						/>
					</div>

					{selectedContacts.length > 0 && (
						<div className="space-y-2">
							<span className="text-sm font-medium">
								Miembros seleccionados
							</span>
							<div className="flex flex-wrap gap-2">
								{selectedContacts.map((contact) => (
									<Badge
										key={contact.id}
										variant="secondary"
										className="flex items-center gap-1 pl-2"
									>
										{contact.name}
										<button
											type="button"
											onClick={() => handleRemoveContact(contact.id)}
											className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
										>
											<X className="h-3 w-3" />
										</button>
									</Badge>
								))}
							</div>
						</div>
					)}

					<div className="space-y-2">
						<label className="text-sm font-medium" htmlFor="search">
							Agregar miembros
						</label>
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
							<Input
								placeholder="Buscar contactos..."
								className="pl-9"
								name="search"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<ScrollArea className="h-60 border rounded-md">
							{filteredContacts && filteredContacts.length > 0 ? (
								<ul className="p-2 flex flex-col gap-1">
									{filteredContacts.map((contact) => {
										const isSelected = selectedContacts.some(
											(c) => c.id === contact.id,
										);
										return (
											<li
												key={contact.id}
												className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
													isSelected ? "bg-gray-100 dark:bg-gray-800" : ""
												}`}
												onClick={() => handleSelectContact(contact)}
												onKeyDown={() => handleSelectContact(contact)}
											>
												<div className="flex items-center gap-3">
													<Avatar>
														<div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
															{contact.name.charAt(0)}
														</div>
													</Avatar>
													<div>
														<p className="font-medium">{contact.name}</p>
														<p className="text-sm text-gray-500">
															{contact.email}
														</p>
													</div>
												</div>
												{isSelected && (
													<Check className="h-5 w-5 text-green-500" />
												)}
											</li>
										);
									})}
								</ul>
							) : (
								<div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
									<Users className="h-8 w-8 mb-2" />
									<p>No se encontraron contactos</p>
								</div>
							)}
						</ScrollArea>
					</div>
				</div>

				<div className="flex justify-end gap-3">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button
						onClick={handleCreateGroup}
						disabled={!groupName.trim() || selectedContacts.length === 0}
					>
						Crear grupo
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
