"use server";

import { POST } from "@kristall/http";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const login = async (_prevState: unknown, payload: FormData) => {

    const { email, password } = Object.fromEntries(payload.entries());

    const response = await POST<any, { access_token: string }>('/auth/login', {
        email,
        password
    }, {
        auth: false
    })

    if (response.status !== 200) {
        return {
            error: response.message,
            fields: {
                email: {
                    value: email,
                },
                password: {
                    value: password,
                },
            }
        }
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    (await cookies()).set('session', response.data.access_token, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
    redirect('/')

}