import { auth } from "@/auth";
import { SignOut } from "./sign-out";
import SignIn from "./sign-in";
import { NavUser } from "./nav-user";

export async function UserProfile() {
	const session = await auth();

	if (!session || !session.user) {
		return <SignIn />;
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
