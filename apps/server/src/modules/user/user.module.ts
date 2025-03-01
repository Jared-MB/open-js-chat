import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './controllers/user.controller';
import { AuthService } from 'src/services/auth.service';

@Module({
    providers: [UserRepository, AuthService],
    exports: [UserRepository],
    controllers: [UserController],
})
export class UserModule { }
