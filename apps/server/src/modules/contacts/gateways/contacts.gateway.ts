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
        console.log('subscribe-requests', body)
        socket.join(body)
    }

    @SubscribeMessage('unsubscribe-requests')
    async handleUnsubscribeRequests(@ConnectedSocket() socket: Socket, @MessageBody() body: { userEmail: string }) {
        socket.leave(body.userEmail)
    }

    @SubscribeMessage("contact-request")
    async handleContactRequest(@ConnectedSocket() socket: Socket, @MessageBody() body: { userEmail: string, otherUserEmail: string }) {
        const user = await this.userRepository.findOne({ email: body.userEmail })
        const otherUser = await this.userRepository.findOne({ email: body.otherUserEmail })

        if (!otherUser || !user) {
            return
        }

        const contactRequest = await this.contactsRequestsRepository.findOne({
            sender: user.email,
            receiver: otherUser.email,
        })

        if (contactRequest) {
            socket.emit('contact-request:response', {
                success: false,
                message: 'Contact request already sent',
            })
            return
        }

        await this.contactsRequestsRepository.create({
            sender: user.email,
            receiver: otherUser.email,
        })

        this.server.to(otherUser.email).emit('contact-request', {
            id: user.email,
            username: user.name,
        })
        socket.emit('contact-request:response', {
            success: true,
        })
    }

    @OnEvent('contacts.add')
    async handleContactsAdd(payload: {
        contact: { email: string, name: string }, from: {
            email: string,
            name: string
        }
    }) {
        console.log('contacts.add', payload)
        this.server.to(payload.contact.email).emit('contact-request:accept', {
            id: payload.contact.email,
            username: payload.contact.name,
        })
    }
}