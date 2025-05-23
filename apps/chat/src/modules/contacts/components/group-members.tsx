"use client";

import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { getGroupMembers } from "../actions/group";
import { useQuery } from "@tanstack/react-query";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function GroupMembers({ id }: { id: string }) {
	const { data: groupMembers } = useQuery({
		queryKey: ["group-members", id],
		queryFn: () => getGroupMembers(id),
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Users />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-72">
				<DropdownMenuLabel>Miembros</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{groupMembers?.map((member) => (
					<DropdownMenuItem key={member.userId} className="justify-between">
						<div className="flex flex-col items-start gap-1">
							<span className="font-medium">{member.username}</span>
							<span className="text-sm">{member.email}</span>
						</div>
						{member.isAdmin && <Badge variant="secondary">Administrador</Badge>}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
