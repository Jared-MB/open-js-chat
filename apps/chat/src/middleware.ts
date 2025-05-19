import { auth } from "@/auth";

export const middleware = auth((req) => {
    console.log(req.auth);
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}