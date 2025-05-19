"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useContact } from "openjs-chat/react";
import { useSession } from "next-auth/react";

export function AddContact() {
	const { data: session } = useSession();

	const [isOpen, setIsOpen] = useState(false);
	const [email, setEmail] = useState("");

	const { sendContactRequest } = useContact();

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!session?.user?.email) {
			return;
		}

		sendContactRequest({
			userEmail: session.user.email,
			otherUserEmail: email,
		});

		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size="icon" variant="outline">
					<UserPlus />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Agregar contacto</DialogTitle>
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
					<DialogFooter>
						<Button
							variant="outline"
							type="button"
							onClick={() => setIsOpen(false)}
						>
							Cancelar
						</Button>
						<Button type="submit">Enviar solicitud</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
