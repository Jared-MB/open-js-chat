import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {

    const userCredentials = await request.json()

    const { access_token } = userCredentials as { access_token: string };

    console.log(access_token);

    (await cookies()).set('access_token', access_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30,
    })

    return new NextResponse()

}