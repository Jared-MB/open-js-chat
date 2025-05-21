"use server";

import { GET } from "@kristall/http";
import { cache } from "react";
import { TAGS } from "./constants";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export interface User {
    email: string;
    name: string;
    password: string;
    id: string;
    nickname: string;
    status: string;
    lastActive: Date;
    avatar: string;
    isBanned: boolean;
}

export const getSession = cache(async () => {
    const response = await GET<User>('/auth/session', {
        tags: [TAGS.SESSION],
        cache: 'force-cache'
    })

    if (response.status !== 200) {
        redirect('/login')
    }

    return response.data
})

export const revalidateSession = async () => {
    revalidateTag(TAGS.SESSION)
}