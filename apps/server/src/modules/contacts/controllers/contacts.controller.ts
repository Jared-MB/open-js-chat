import type { TokenPayload } from "google-auth-library";

import { Controller, Get, InternalServerErrorException, UnauthorizedException, UseInterceptors } from "@nestjs/common";

import { ResponseInterceptor } from "src/interceptors/response.interceptor";
import { Cookies } from "src/decorators/cookie.decorator";
import { AuthService } from "src/services/auth.service";

import { UserRepository } from "src/modules/user/repositories/user.repository";

import { ContactsRepository } from "../repositories/contacts.repository";

@UseInterceptors(ResponseInterceptor)
@Controller('contacts')
export class ContactsController {

    constructor(
        private readonly contactsRepository: ContactsRepository,
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService
    ) { }

    @Get()
    async getContacts(@Cookies('session') token: string) {
        let session: TokenPayload = null

        try {
            session = await this.authService.decodeToken(token)
        }
        catch (error) {
            console.log(error)
            throw new UnauthorizedException()
        }

        const user = await this.userRepository.findOne({ email: session.email })

        if (!user) {
            throw new UnauthorizedException()
        }

        try {
            const contacts = await this.contactsRepository.find({
                user: user.email
            })

            const users = contacts.map(async (contact) => {
                let otherUserEmail = ''
                if (contact.user === user.email) {
                    otherUserEmail = contact.contact
                }
                else {
                    otherUserEmail = contact.user
                }

                return await this.userRepository.findOne({ email: otherUserEmail })
            })
            return await Promise.all(users)
        }
        catch (error) {
            throw new InternalServerErrorException()
        }
    }

}