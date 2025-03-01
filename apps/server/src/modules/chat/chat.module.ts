import { Module } from '@nestjs/common';
import { ChatGateway } from './gateways/chat.gateway';
import { MessageRepository } from './repositories/message.repository';
import { UserModule } from '../user/user.module';
import { CookieService } from 'src/services/cookie.service';

@Module({
  imports: [UserModule],
  providers: [ChatGateway, MessageRepository, CookieService],
})
export class ChatModule { }
