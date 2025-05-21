"use server"

import { GET } from '@kristall/http';
import type { Contact, ContactRequest } from '../interfaces';
import { revalidateTag } from 'next/cache';
import { TAGS } from '../constants';

export const getContacts = async () => {
    const response = await GET<Contact[] | null>('/contacts', {
        tags: [TAGS.CONTACTS],
        cache: 'force-cache',
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