import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/modules/auth/session";
import { unstable_ViewTransition as ViewTransition } from "react";

export default async function ProfilePage() {
	const session = await getSession();

	return (
		<ViewTransition>
			<Card className="my-6">
				<CardContent className="flex items-center gap-4">
					<div>
						<Avatar className="size-16 text-2xl">
							<AvatarImage src={session.avatar} alt={session.name} />
							<AvatarFallback>{session.name.charAt(0)}</AvatarFallback>
						</Avatar>
					</div>
					<div>
						<CardTitle>
							<h3 className="text-xl">{session.name}</h3>
						</CardTitle>
						<CardDescription>
							<h4 className="text-base">{session.email}</h4>
						</CardDescription>
					</div>
				</CardContent>
			</Card>
		</ViewTransition>
	);
}
