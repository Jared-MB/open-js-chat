import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { cookies } from "next/headers"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                // First-time login, save the `access_token`, its expiry and the `refresh_token`
                return {
                    ...token,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    refresh_token: account.refresh_token,
                }
            }
            if (Date.now() < (token.expires_at as any) * 1000) {
                // Subsequent logins, but the `access_token` is still valid
                return token
            }
            // Subsequent logins, but the `access_token` has expired, try to refresh it
            if (!token.refresh_token) throw new TypeError("Missing refresh_token")

            try {
                const response = await fetch("https://oauth2.googleapis.com/token", {
                    method: "POST",
                    body: new URLSearchParams({
                        client_id: process.env.AUTH_GOOGLE_ID ?? '',
                        client_secret: process.env.AUTH_GOOGLE_SECRET ?? '',
                        grant_type: "refresh_token",
                        refresh_token: token.refresh_token as string,
                    }),
                })

                const tokensOrError = await response.json()

                if (!response.ok) throw tokensOrError

                const newTokens = tokensOrError as {
                    access_token: string
                    expires_in: number
                    refresh_token?: string
                }

                return {
                    ...token,
                    access_token: newTokens.access_token,
                    expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
                    // Some providers only issue refresh tokens once, so preserve if we did not get a new one
                    refresh_token: newTokens.refresh_token
                        ? newTokens.refresh_token
                        : token.refresh_token,
                }
            } catch (error) {
                console.error("Error refreshing access_token", error)
                // If we fail to refresh the token, return an error so we can handle it on the page
                token.error = "RefreshTokenError"
                return token
            }

        },
        session({ session, token }) {
            session.user.id = token.sub as string
            (session as any).error = token.error
            return session
        },
        authorized({ auth }) {
            return !!auth
        }
    },
    pages: {
        signIn: "/",
    },
    events: {
        signIn: async ({ user, account }) => {

            const session = account?.id_token;

            if (!session) {
                throw new Error('No session')
            }

            (await cookies()).set("session", session, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/",
            })


            const response = await fetch(`${process.env.SERVER_API}/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: user.name,
                    nickname: "",
                    email: user.email,
                    access_token: account?.id_token,
                    __SECRET__: process.env.SERVER_SECRET,
                }),
            });

            await response.json();

            await new Promise((resolve) => setTimeout(resolve, 1000))
        },
    },

})

declare module "next-auth" {
    interface Session {
        error?: "RefreshTokenError"
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        access_token: string
        expires_at: number
        refresh_token?: string
        error?: "RefreshTokenError"
    }
}