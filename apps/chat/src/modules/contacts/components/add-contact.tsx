"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useContact } from "openjs-chat/react";
import { useSession } from "@/modules/auth/context/session-provider";
import {
	DropdownMenuLabel,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function AddContact() {
	const session = useSession();

	const [isOpen, setIsOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { sendContactRequest } = useContact();

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		if (!session?.user?.email) {
			return;
		}

		sendContactRequest({
			userId: session.user.id,
			otherUserEmail: email,
		});

		setEmail("");
		setIsLoading(false);
		setIsOpen(false);
		toast.success("Solicitud enviada");
	};

	return (
		<DropdownMenuSub open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuSubTrigger className="flex items-center gap-2">
				<UserPlus className="h-5 w-5 text-muted-foreground" />
				Agregar contacto
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="w-sm p-6 flex flex-col gap-4">
				<DropdownMenuLabel className="p-0 text-xl">
					Agregar contacto
				</DropdownMenuLabel>
				<form className="flex flex-col gap-4" onSubmit={onSubmit}>
					<div className="flex flex-col gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							id="email"
							name="email"
							type="email"
							placeholder="ejemplo@ejemplo.com"
						/>
					</div>
					<div className="flex justify-end gap-2">
						<Button
							variant="outline"
							type="button"
							onClick={() => setIsOpen(false)}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Cargando..." : "Agregar contacto"}
						</Button>
					</div>
				</form>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
