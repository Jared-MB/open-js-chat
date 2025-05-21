import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { CookieService } from 'src/services/cookie.service';

import { ChatGateway } from './chat.gateway';
import { MessageRepository } from './message.repository';
import { GroupsModule } from 'src/modules/groups/groups.module';

@Module({
  imports: [UserModule, GroupsModule],
  providers: [ChatGateway, MessageRepository, CookieService],
})
export class ChatModule { }
