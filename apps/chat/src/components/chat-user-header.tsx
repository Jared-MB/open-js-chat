import { unstable_ViewTransition as ViewTransition } from "react";

import { Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Online } from "./online";

export function ChatUserHeader({
	usernameSlug,
}: { usernameSlug: `${string}-${string}` }) {
	const username = usernameSlug.split("-")[0].replaceAll("%20", " ");

	return (
		<header className="flex items-center p-4 border-b h-20">
			<div className="relative mr-4">
				<Avatar className="h-10 w-10">
					<AvatarImage
						src="/placeholder.svg?height=40&width=40"
						alt="Contact"
					/>
					<AvatarFallback>JD</AvatarFallback>
				</Avatar>
				<Online />
			</div>
			<div className="flex-1">
				<h2 className="font-semibold">{username}</h2>
				<p className="text-xs text-muted-foreground">En línea</p>
			</div>
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="icon">
					<Phone className="h-5 w-5" />
				</Button>
				<Button variant="ghost" size="icon">
					<Video className="h-5 w-5" />
				</Button>
			</div>
		</header>
	);
}
