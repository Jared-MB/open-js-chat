import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessageRepository } from '../repositories/message.repository';
import { UserRepository } from '../../user/repositories/user.repository';
import { CookieService } from 'src/services/cookie.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
})
export class ChatGateway {

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
    private readonly cookieService: CookieService,
  ) { }

  private getUsersRoom(userId: string, otherUserId: string) {
    return [userId, otherUserId].sort().join('-');
  }

  @SubscribeMessage('ping')
  ping(@ConnectedSocket() socket: Socket) {
    socket.emit('pong', 'pong');
  }

  @SubscribeMessage('join')
  async handleJoin(@MessageBody() body: { userEmail: string, otherUserEmail: string }, @ConnectedSocket() socket: Socket) {
    const roomId = this.getUsersRoom(body.userEmail, body.otherUserEmail);

    socket.join(roomId);
    console.log(roomId)

    const user = await this.userRepository.findOne({ email: body.userEmail });
    const otherUser = await this.userRepository.findOne({ email: body.otherUserEmail });

    const messages = await this.messageRepository.findAllByReceptor(user.id, otherUser.id);

    socket.emit('join', { user, messages, otherUser });
  }

  @SubscribeMessage('leave')
  handleLeave(@MessageBody() body: { userEmail: string, otherUserEmail: string }, @ConnectedSocket() socket: Socket) {
    const roomId = this.getUsersRoom(body.userEmail, body.otherUserEmail);
    console.log(roomId)

    socket.leave(roomId);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: { message: string, userEmail: string, to: string }, @ConnectedSocket() socket: Socket) {
    const socketAuth = this.cookieService.getCookies(socket.handshake.headers.cookie)

    console.log(socket.rooms)

    const user = await this.userRepository.findOne({ email: body.userEmail })
    const otherUser = await this.userRepository.findOne({ email: body.to })

    if (!user || !otherUser) {
      return
    }

    const message = await this.messageRepository.create({ text: body.message, from: user.id, to: otherUser.id });

    const roomId = this.getUsersRoom(body.userEmail, body.to);

    this.server.to(roomId).emit('message', message[0]);
  }
}
