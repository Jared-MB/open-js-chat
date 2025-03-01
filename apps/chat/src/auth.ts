import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        jwt({ token, user }) {
            if (user) { // User is available during sign-in
                token.id = user.id
            }

            return token
        },
        session({ session, token }) {
            session.user.id = token.sub as string
            return session
        },
    },
    events: {
        signIn: async ({ user, account }) => {

            console.log({ account: account?.id_token })

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

            const data = await response.json();
        },
    }
})