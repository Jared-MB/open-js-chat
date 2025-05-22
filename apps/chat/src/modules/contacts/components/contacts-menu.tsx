"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddContact } from "@/modules/contacts/components/add-contact";
import { MessagesSquare, MoreVertical } from "lucide-react";
import { CreateGroupDialog } from "./create-group-dialog";
import { useState } from "react";
import { createGroup } from "../actions/group";

export function ContactsMenu() {
	const [createGroupOpen, setCreateGroupOpen] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon">
						<MoreVertical />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuLabel>Opciones</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<AddContact />
						<DropdownMenuItem onClick={() => setCreateGroupOpen(true)}>
							<MessagesSquare className="w-5 h-5" />
							Crear grupo
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			{createGroupOpen && (
				<CreateGroupDialog
					open={createGroupOpen}
					onOpenChange={setCreateGroupOpen}
					onCreateGroup={async (name, members) => {
						await createGroup({
							name,
							users: members.map((member) => member.id),
						});
					}}
				/>
			)}
		</>
	);
}
