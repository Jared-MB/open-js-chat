import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Post,
    Request,
    UseInterceptors
} from "@nestjs/common";

import { ResponseInterceptor } from "src/interceptors/response.interceptor";

import { ContactsRequestsRepository } from "../repositories/contacts-requests.repository";
import { UserRepository } from "src/modules/user/repositories/user.repository";
import { ContactsRepository } from "../repositories/contacts.repository";
import { EventEmitter2 } from "@nestjs/event-emitter";

@UseInterceptors(ResponseInterceptor)
@Controller('contacts-requests')
export class ContactsRequestsController {

    constructor(
        private readonly contactsRequestsRepository: ContactsRequestsRepository,
        private readonly contactsRepository: ContactsRepository,
        private readonly userRepository: UserRepository,
        private eventEmitter: EventEmitter2
    ) { }

    @Get()
    async getContactsRequests(@Request() req: { user: { userId: string, username: string } }) {
        const user = await this.userRepository.findOne({ id: req.user.userId })

        const contactsRequests = await this.contactsRequestsRepository.find({ receiver: user.id })
        const requests = contactsRequests.map(async (contactRequest) => {
            const user = await this.userRepository.findOne({ id: contactRequest.sender })
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
        @Body() body: { contactId: string, type: 'accept' | 'reject' },
        @Request() req: { user: { userId: string, username: string } },
    ) {
        const user = await this.userRepository.findOne({ id: req.user.userId })

        const contactRequest = await this.contactsRequestsRepository.findOne({ sender: body.contactId })

        if (!contactRequest) {
            throw new NotFoundException()
        }

        if (contactRequest.receiver === body.contactId) {
            throw new BadRequestException()
        }

        if (body.type === 'accept') {
            await this.contactsRepository.create({
                userId: contactRequest.receiver,
                otherUserId: contactRequest.sender
            })

            const user = await this.userRepository.findOne({ id: body.contactId })

            this.eventEmitter.emit('contacts.add', {
                contact: {
                    email: user.email,
                    name: user.name,
                    id: user.id
                }
            })
        }

        await this.contactsRequestsRepository.remove({ sender: body.contactId, receiver: user.id })
    }

}