import { BadRequestException, Body, Controller, Get, Param, Post, UseInterceptors, } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { CreateUserDto, UserDto } from '../dtos/user.dto';
import { AuthService } from 'src/services/auth.service';

@UseInterceptors(ResponseInterceptor)
@Controller('user')
export class UserController {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService,
    ) { }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        const user = await this.userRepository.findOne({ email: id })
        return user
    }

    @Get()
    async getUsers() {
        const users = await this.userRepository.find()
        return users
    }

    @Post()
    async createUser(@Body() body: CreateUserDto & { access_token: string }) {
        const payload = await this.authService.decodeToken(body.access_token)
        const googleId = String(payload.sub)

        const isUserCreated = await this.userRepository.findOne({ email: body.email })

        let user: UserDto | null = null
        if (!isUserCreated) {
            const userCreated = await this.userRepository.create({ ...body, googleId })
            user = userCreated[0]
        }

        user = isUserCreated[0]
    }

}
