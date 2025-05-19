"use server"

import { POST } from "@kristall/http"
import { refetchContacts, refetchContactsRequests } from "./get"

export const manageContactRequest = async (contactEmail: string, type: 'accept' | 'reject') => {

    await POST('/contacts-requests/manage', {
        contactEmail,
        type
    })

    await Promise.all([
        refetchContacts(),
        refetchContactsRequests()
    ])

}