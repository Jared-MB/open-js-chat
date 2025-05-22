import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessageRepository } from './message.repository';
import { UserRepository } from 'src/modules/user/repositories/user.repository';

import { z } from 'zod'
import { GroupRepository } from 'src/modules/groups/repositories/group.repository';
import { GroupsService } from 'src/modules/groups/services/groups.service';

const isUUID = z.string().uuid();

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway {

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
    private readonly groupsService: GroupsService,
    private readonly groupRepository: GroupRepository,
  ) { }

  private getUsersRoom(userId: string, otherUserId: string) {
    return [userId, otherUserId].sort().join('-');
  }

  @SubscribeMessage('ping')
  ping(@ConnectedSocket() socket: Socket) {
    socket.emit('pong', 'pong');
  }

  @SubscribeMessage('join')
  async handleJoin(@MessageBody() body: { userId: string, otherUserEmail: string }, @ConnectedSocket() socket: Socket) {
    const user = await this.userRepository.findOne({ id: body.userId });

    const isGroup = isUUID.safeParse(body.otherUserEmail);

    if (isGroup.success) {
      const group = await this.groupsService.isInGroup(body.userId, body.otherUserEmail);
      if (!group) {
        return
      }

      socket.join(body.otherUserEmail);
      const messages = await this.messageRepository.findAllByGroup(body.otherUserEmail);
      socket.emit('join', { user, messages, myId: user.id });
      return
    }

    const roomId = this.getUsersRoom(user.email, body.otherUserEmail);

    socket.join(roomId);

    if (user?.isBanned) {
      socket.leave(roomId);
      return
    }

    const otherUser = await this.userRepository.findOne({ email: body.otherUserEmail });
    if (otherUser.isBanned) {
      socket.leave(roomId);
      return
    }

    const messages = await this.messageRepository.findAllByReceptor(user.id, otherUser.id);

    socket.emit('join', { user, messages, otherUser, myId: user.id });
  }

  @SubscribeMessage('leave')
  async handleLeave(@MessageBody() body: { userId: string, otherUserEmail: string }, @ConnectedSocket() socket: Socket) {
    const user = await this.userRepository.findOne({ id: body.userId });

    const isGroup = isUUID.safeParse(body.otherUserEmail);

    if (isGroup.success) {
      socket.leave(body.otherUserEmail);
      return
    }

    const roomId = this.getUsersRoom(user.email, body.otherUserEmail);

    socket.leave(roomId);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: { message: string, userId: string, to: string, isGroup: boolean }, @ConnectedSocket() socket: Socket) {
    // const socketAuth = this.cookieService.getCookies(socket.handshake.headers.cookie)

    const user = await this.userRepository.findOne({ id: body.userId })
    let otherUser
    if (!body.isGroup) {
      otherUser = await this.userRepository.findOne({ email: body.to })
    }
    else {
      otherUser = await this.groupRepository.findOne({ id: body.to })
    }

    let roomId = this.getUsersRoom(user.email, body.to);
    if (body.isGroup) {
      roomId = body.to
    }

    if (user?.isBanned || otherUser?.isBanned) {
      socket.leave(roomId);
      return
    }

    if (!user || !otherUser) {
      return
    }

    const message = await this.messageRepository.create({ text: body.message, from: user.id, to: otherUser.id });

    this.server.to(roomId).emit('message', message[0]);
  }
}
