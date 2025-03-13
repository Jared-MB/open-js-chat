import { auth } from "@/auth";
import { NavUser, NavUserLogin } from "./nav-user";

export async function UserProfile() {
	const session = await auth();

	if (!session || !session.user) {
		return <NavUserLogin />;
	}

	return (
		<NavUser
			user={{
				name: session.user?.name ?? "",
				email: session.user?.email ?? "",
				avatar: session.user?.image ?? "",
			}}
		/>
	);
}
