"use server"

import { POST } from "@kristall/http"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const register = async (_prevState: unknown, payload: FormData) => {

    const { email, password, confirmPassword, name } = Object.fromEntries(payload.entries());

    if (password.toString().length < 4) {
        return {
            error: null,
            fields: {
                email: {
                    message: null,
                    value: email,
                },
                password: {
                    message: 'La contraseña debe tener al menos 4 caracteres',
                    value: password,
                },
                confirmPassword: {
                    message: null,
                    value: confirmPassword,
                },
                name: {
                    message: null,
                    value: name,
                },
            }
        }
    }

    if (password !== confirmPassword) {
        return {
            error: null,
            fields: {
                email: {
                    message: null,
                    value: email,
                },
                password: {
                    message: 'Las contraseñas no coinciden',
                    value: password,
                },
                confirmPassword: {
                    message: 'Las contraseñas no coinciden',
                    value: confirmPassword,
                },
                name: {
                    message: null,
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

    if (response.message.includes('correo')) {
        return {
            error: null,
            fields: {
                email: {
                    message: 'El correo ya está registrado',
                    value: email,
                },
                password: {
                    message: null,
                    value: password,
                },
                confirmPassword: {
                    message: null,
                    value: confirmPassword,
                },
                name: {
                    message: null,
                    value: name,
                },
            }
        }
    }

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