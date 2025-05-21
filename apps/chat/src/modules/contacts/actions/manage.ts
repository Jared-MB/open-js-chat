"use server"

import { POST } from "@kristall/http"
import { refetchContacts, refetchContactsRequests } from "./get"

export const manageContactRequest = async (contactId: string, type: 'accept' | 'reject') => {

    const response = await POST('/contacts-requests/manage', {
        contactId,
        type
    })

    console.log(response)

    await Promise.all([
        refetchContacts(),
        refetchContactsRequests()
    ])

}