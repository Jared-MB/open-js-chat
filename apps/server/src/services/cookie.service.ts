import { Injectable } from "@nestjs/common";

@Injectable()
export class CookieService {

    public getCookies(cookiesString: string) {
        const cookies = cookiesString.split(';')
        const cookieObject = {}

        cookies.forEach(cookie => {
            const [key, value] = cookie.split('=')
            cookieObject[key] = value
        })

        return cookieObject
    }

    public getCookie(cookiesString: string, name: string) {
        const cookies = this.getCookies(cookiesString)
        return cookies[name]
    }

}