"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ContactRequest as CR } from "@/modules/contacts/interfaces";
import { Check, X } from "lucide-react";
import { useTransition } from "react";
import { manageContactRequest } from "../actions/manage";
import { toast } from "sonner";

export function ContactRequest({ contactRequest }: { contactRequest: CR }) {
	const [isLoading, startTransition] = useTransition();

	const handleClick = (type: "accept" | "reject") =>
		startTransition(async () => {
			await manageContactRequest(contactRequest.id, type);
			toast.success("Contacto aceptado");
		});

	return (
		<div key={contactRequest.email} className="py-1">
			<article className="flex items-center justify-between px-6 py-3 hover:bg-muted rounded-md transition-colors duration-200">
				<div className="flex items-center gap-6">
					<Avatar>
						<AvatarImage
							src={contactRequest.avatar}
							alt={contactRequest.user}
						/>
						<AvatarFallback>{contactRequest.user[0]}</AvatarFallback>
					</Avatar>
					<div>
						<h2 className="font-semibold">{contactRequest.user}</h2>
						<p className="text-sm text-foreground opacity-80">
							{contactRequest.email}
						</p>
					</div>
				</div>
				<div className="flex gap-4">
					<Button
						variant="outline"
						size="icon"
						disabled={isLoading}
						onClick={() => handleClick("reject")}
					>
						<X className="h-4 w-4" />
					</Button>
					<Button
						size="icon"
						disabled={isLoading}
						onClick={() => handleClick("accept")}
					>
						<Check className="h-4 w-4" />
					</Button>
				</div>
			</article>
		</div>
	);
}
