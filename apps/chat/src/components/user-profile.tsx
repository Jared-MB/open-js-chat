import { auth } from "@/auth";
import { SignOut } from "./sign-out";
import SignIn from "./sign-in";

export async function UserProfile() {
	const session = await auth();
	return (
		<div className="h-16 border">{session ? <SignOut /> : <SignIn />}</div>
	);
}
