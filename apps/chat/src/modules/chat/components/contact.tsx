import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Online } from "@/components/online";
import { OutletHeader } from "@/components/outlet-header";

export async function Contact({
	params,
}: { params: Promise<{ username: `${string}-${string}` }> }) {
	const usernameSlug = (await params).username;
	const username = usernameSlug.split("-")[0].replaceAll("%20", " ");

	return (
		<OutletHeader>
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
		</OutletHeader>
	);
}
