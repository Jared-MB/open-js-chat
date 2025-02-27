import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessageRepository } from '../repositories/message.repository';
import { UserRepository } from '../../user/repositories/user.repository';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayDisconnect {

  private connectedUsers = new Map<string, string>();

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
  ) { }

  handleDisconnect(socket: Socket) {
    this.connectedUsers.delete(socket.id);
    this.server.emit('users', { users: this.countUsers() });
  }

  private countUsers() {
    const users: string[] = []
    for (const values of this.connectedUsers.values()) {
      users.push(values)
    }
    return users
  }

  private getUsersRoom(userId: string, otherUserId: string) {
    return [userId, otherUserId].sort().join('-');
  }

  @SubscribeMessage('join')
  async handleJoin(@MessageBody() body: { userId: string, otherUserId: string }, @ConnectedSocket() socket: Socket) {
    const roomId = this.getUsersRoom(body.userId, body.otherUserId);

    socket.join(roomId);

    const messages = await this.messageRepository.findAllByReceptor(body.userId, body.otherUserId);
    const user = (await this.userRepository.findById(body.userId))[0];
    const otherUser = (await this.userRepository.findById(body.otherUserId))[0];

    this.connectedUsers.set(socket.id, body.userId);

    socket.emit('join', { user, messages, otherUser });
  }

  @SubscribeMessage('users')
  async handleUsers() {
    const users = this.countUsers()
    this.server.emit('users', { users });
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: { message: string, userId: string, receptorId: string }) {

    const user = (await this.userRepository.findById(body.userId))[0]

    if (!user) {
      return
    }

    const message = await this.messageRepository.create({ text: body.message, ownerId: user.id, receptorId: body.receptorId });

    const roomId = this.getUsersRoom(body.userId, body.receptorId);

    this.server.to(roomId).emit('message', message);
  }
}
