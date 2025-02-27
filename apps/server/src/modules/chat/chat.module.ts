import { Module } from '@nestjs/common';
import { ChatGateway } from './gateways/chat.gateway';
import { MessageRepository } from './repositories/message.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [ChatGateway, MessageRepository],
})
export class ChatModule { }
