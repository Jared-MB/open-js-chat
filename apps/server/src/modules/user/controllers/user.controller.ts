import { Controller, Get, Request, UseInterceptors, } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';

@UseInterceptors(ResponseInterceptor)
@Controller('user')
export class UserController {

    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    @Get('profile')
    async getProfile(@Request() req: { user: { userId: string, username: string } }) {
        const user = await this.userRepository.findOne({ id: req.user.userId })
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        }
    }

}
