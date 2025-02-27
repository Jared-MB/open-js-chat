import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './controllers/user.controller';

@Module({
    providers: [UserRepository],
    exports: [UserRepository],
    controllers: [UserController],
})
export class UserModule { }
