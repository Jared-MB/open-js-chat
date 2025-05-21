import { Controller, Get, InternalServerErrorException, Request, UnauthorizedException, UseInterceptors } from "@nestjs/common";

import { ResponseInterceptor } from "src/interceptors/response.interceptor";

import { UserRepository } from "src/modules/user/repositories/user.repository";

import { ContactsRepository } from "../repositories/contacts.repository";
import { GroupsService } from "src/modules/groups/services/groups.service";

@UseInterceptors(ResponseInterceptor)
@Controller('contacts')
export class ContactsController {

    constructor(
        private readonly contactsRepository: ContactsRepository,
        private readonly userRepository: UserRepository,
        private readonly groupsService: GroupsService,
    ) { }

    @Get()
    async getContacts(@Request() req: { user: { userId: string, username: string } }) {
        const user = await this.userRepository.findOne({ id: req.user.userId })

        if (!user) {
            throw new UnauthorizedException()
        }

        try {
            const myContacts = await this.contactsRepository.find({
                userId: user.id
            })

            const usersPromise = myContacts.map(async (contact) => {
                let otherUserId = ''
                if (contact.userId === user.id) {
                    otherUserId = contact.otherUserId
                }
                else {
                    otherUserId = contact.userId
                }

                return await this.userRepository.findOne({ id: otherUserId })
            })

            const groupsPromise = this.groupsService.getUserGroups(user.id)

            const [contacts, groups] = await Promise.all([Promise.all(usersPromise), groupsPromise])
            return [...contacts, ...groups]
        }
        catch (error) {
            throw new InternalServerErrorException()
        }
    }

}