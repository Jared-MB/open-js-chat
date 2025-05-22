import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Online } from "@/components/online";
import { OutletHeader } from "@/components/outlet-header";
import { getGroup } from "@/modules/contacts/actions/group";
import { isUUID } from "@/lib/utils";
import { GroupMembers } from "@/modules/contacts/components/group-members";

export async function Contact({
	params,
}: { params: Promise<{ username: string }> }) {
	const slug = (await params).username;

	const isGroup = isUUID.safeParse(slug);
	let displayChatName = "";

	if (isGroup.success) {
		const group = await getGroup(slug);
		displayChatName = group.name;
	} else {
		displayChatName = slug.split("-")[0].replaceAll("%20", " ");
	}

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
				<h2 className="font-semibold">{displayChatName}</h2>
				<p className="text-xs text-muted-foreground">En línea</p>
			</div>
			{isGroup.success && <GroupMembers id={slug} />}
		</OutletHeader>
	);
}
