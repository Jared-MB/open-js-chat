import { getContactsRequests } from "@/modules/contacts/actions/get";
import { unstable_ViewTransition as ViewTransition } from "react";
import { ContactRequest } from "@/modules/contacts/components/contact-request";

export default async function ContactRequestsPage() {
	const contactsRequests = await getContactsRequests();

	if (!contactsRequests) {
		return null;
	}

	return (
		<ViewTransition>
			<main className="py-6 divide-y">
				{contactsRequests.length > 0 ? (
					contactsRequests.map((contactRequest) => (
						<ContactRequest
							key={contactRequest.email}
							contactRequest={contactRequest}
						/>
					))
				) : (
					<div className="flex items-center justify-between p-6 hover:bg-muted rounded-md transition-colors duration-200">
						<p className="text-base text-muted-foreground">
							Se ve un poco vacío aquí...
						</p>
					</div>
				)}
			</main>
		</ViewTransition>
	);
}
