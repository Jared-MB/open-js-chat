"use server"

import { POST } from "@kristall/http"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const register = async (_prevState: unknown, payload: FormData) => {

    const { email, password, confirmPassword, name } = Object.fromEntries(payload.entries());

    if (password !== confirmPassword) {
        return {
            error: "Passwords do not match",
            fields: {
                email: {
                    value: email,
                },
                password: {
                    value: password,
                },
                confirmPassword: {
                    value: confirmPassword,
                },
                name: {
                    value: name,
                },
            }

        }
    }

    const response = await POST<any, { access_token: string }>('/auth/register', {
        email,
        password,
        name
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
                confirmPassword: {
                    value: confirmPassword,
                },
                name: {
                    value: name,
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