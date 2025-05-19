"use server"

import { GET } from '@kristall/http';
import type { Contact, ContactRequest } from '../interfaces';
import { revalidateTag } from 'next/cache';
import { TAGS } from '../constants';
import { cookies } from 'next/headers';

export const getContacts = async () => {
    let token = ''
    let attempts = 0
    while (attempts < 10) {
        const session = (await cookies()).get("session")
        if (!session?.value) {
            console.log('No session')
            await new Promise((resolve) => setTimeout(resolve, 1000))
            attempts++
            continue
        }

        console.log('Session', session)
        token = session.value
        break
    }

    console.log('Token', token)

    const response = await GET<Contact[] | null>('/contacts', {
        tags: [TAGS.CONTACTS],
        cache: 'force-cache',
        customToken: token,
    })

    return response.data

}

export const refetchContacts = async () => {
    revalidateTag(TAGS.CONTACTS)
}

export const getContactsRequests = async () => {
    const response = await GET<ContactRequest[] | null>('/contacts-requests', {
        tags: [TAGS.CONTACTS_REQUESTS],
        cache: 'force-cache',
    })

    return response.data
}

export const refetchContactsRequests = async () => {
    revalidateTag(TAGS.CONTACTS_REQUESTS)
}