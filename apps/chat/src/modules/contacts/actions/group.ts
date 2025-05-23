"use server"

import { GET, POST } from "@kristall/http"
import { TAGS } from "../constants"

export const getGroup = async (id: string) => {
    const response = await GET<{ name: string }>(`/groups/${id}`, {
        tags: [`${TAGS.GROUPS}${id}__`],
        cache: 'force-cache',
    })

    return response.data
}

export const getGroupMembers = async (id: string) => {
    const response = await GET<{ userId: string, isAdmin: boolean, username: string, email: string }[]>(`/groups/${id}/members`, {
        tags: [`${TAGS.GROUPS_MEMBERS}${id}__`],
        cache: 'force-cache',
    })

    return response.data
}

export const createGroup = async ({ name, users }: { name: string, users: string[] }) => {

    const response = await POST('/groups', {
        name,
        users
    })

    return response.data

}