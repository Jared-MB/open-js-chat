import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Post,
    UnauthorizedException,
    UseInterceptors
} from "@nestjs/common";

import { ResponseInterceptor } from "src/interceptors/response.interceptor";
import { Cookies } from "src/decorators/cookie.decorator";

import { ContactsRequestsRepository } from "../repositories/contacts-requests.repository";
import { AuthService } from "src/services/auth.service";
import { UserRepository } from "src/modules/user/repositories/user.repository";
import type { TokenPayload } from "google-auth-library";
import { ContactsRepository } from "../repositories/contacts.repository";
import { EventEmitter2 } from "@nestjs/event-emitter";

@UseInterceptors(ResponseInterceptor)
@Controller('contacts-requests')
export class ContactsRequestsController {

    constructor(
        private readonly contactsRequestsRepository: ContactsRequestsRepository,
        private readonly contactsRepository: ContactsRepository,
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService,
        private eventEmitter: EventEmitter2
    ) { }

    @Get()
    async getContactsRequests(@Cookies('session') authorization: string) {
        let session: TokenPayload = null

        try {
            session = await this.authService.decodeToken(authorization)
        }
        catch (error) {
            throw new UnauthorizedException()
        }

        const userEmail = session.email

        const contactsRequests = await this.contactsRequestsRepository.find({ receiver: userEmail })
        const requests = contactsRequests.map(async (contactRequest) => {
            const user = await this.userRepository.findOne({ email: contactRequest.sender })
            return {
                user: user.name,
                email: user.email,
                avatar: user.avatar,
                id: user.id
            }
        })

        return await Promise.all(requests)
    }

    @Post('manage')
    async manageContactRequest(
        @Body() body: { contactEmail: string, type: 'accept' | 'reject' },
        @Cookies('session') token: string,
    ) {
        let session: TokenPayload = null

        try {
            session = await this.authService.decodeToken(token)
        }
        catch (error) {
            throw new UnauthorizedException()
        }

        const userEmail = session.email

        const contactRequest = await this.contactsRequestsRepository.findOne({ sender: body.contactEmail })

        if (!contactRequest) {
            throw new NotFoundException()
        }

        if (contactRequest.receiver === body.contactEmail) {
            throw new BadRequestException()
        }

        if (body.type === 'accept') {
            await this.contactsRepository.create({
                user: contactRequest.receiver,
                contact: contactRequest.sender
            })

            const user = await this.userRepository.findOne({ email: body.contactEmail })

            this.eventEmitter.emit('contacts.add', {
                contact: {
                    email: user.email,
                    name: user.name
                },
                from: {
                    email: userEmail,
                    name: session.name
                }
            })
        }

        await this.contactsRequestsRepository.remove({ sender: body.contactEmail, receiver: userEmail })
    }

}