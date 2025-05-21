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
				{contactsRequests.map((contactRequest) => (
					<ContactRequest
						key={contactRequest.email}
						contactRequest={contactRequest}
					/>
				))}
			</main>
		</ViewTransition>
	);
}
