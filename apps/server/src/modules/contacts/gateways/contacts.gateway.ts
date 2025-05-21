import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { UserRepository } from "src/modules/user/repositories/user.repository";
import { ContactsRequestsRepository } from "../repositories/contacts-requests.repository";
import { OnEvent } from "@nestjs/event-emitter";

@WebSocketGateway({
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
    namespace: '/contacts',
})
export class ContactsGateway {
    @WebSocketServer()
    server: Server

    constructor(
        private readonly userRepository: UserRepository,
        private readonly contactsRequestsRepository: ContactsRequestsRepository,
    ) { }

    @SubscribeMessage('subscribe-requests')
    async handleListenRequests(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
        socket.join(body)
    }

    @SubscribeMessage('unsubscribe-requests')
    async handleUnsubscribeRequests(@ConnectedSocket() socket: Socket, @MessageBody() body: { id: string }) {
        socket.leave(body.id)
    }

    @SubscribeMessage("contact-request")
    async handleContactRequest(@ConnectedSocket() socket: Socket, @MessageBody() body: { userId: string, otherUserEmail: string }) {
        const user = await this.userRepository.findOne({ id: body.userId })
        const otherUser = await this.userRepository.findOne({ email: body.otherUserEmail })

        if (!otherUser || !user) {
            return
        }

        const contactRequest = await this.contactsRequestsRepository.findOne({
            sender: user.id,
            receiver: otherUser.id,
        })

        if (contactRequest) {
            socket.emit('contact-request:response', {
                success: false,
                message: 'Contact request already sent',
            })
            return
        }

        await this.contactsRequestsRepository.create({
            sender: user.id,
            receiver: otherUser.id,
        })

        this.server.to(otherUser.id).emit('contact-request', {
            id: user.email,
            username: user.name,
        })
        socket.emit('contact-request:response', {
            success: true,
        })
    }

    @OnEvent('contacts.add')
    async handleContactsAdd(payload: {
        contact: { email: string, name: string, id: string }
    }) {
        this.server.to(payload.contact.id).emit('contact-request:accept', {
            id: payload.contact.email,
            username: payload.contact.name,
        })
    }

    @OnEvent('group.add')
    async handleGroupAdd(payload: {
        users: string[],
        group: {
            name: string, id: string, createdBy: {
                id: string,
                name: string,
            }
        }
    }) {
        this.server.to(payload.users).emit('new-group', payload.group)
    }
}