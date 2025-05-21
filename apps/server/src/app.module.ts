import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { WebsocketModule } from 'src/modules/websockets/websocket.module';
import { UserModule } from './modules/user/user.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { jwtConstants } from './modules/auth/constants';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { GroupsModule } from './modules/groups/groups.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    AuthModule,
    WebsocketModule,
    UserModule,
    ContactsModule,
    GroupsModule
  ],
  controllers: [AppController],
})
export class AppModule { }
