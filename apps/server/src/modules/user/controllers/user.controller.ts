import { BadRequestException, Body, Controller, Get, Param, Post, UseInterceptors, } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';

@Controller('user')
export class UserController {

    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    @UseInterceptors(ResponseInterceptor)
    @Get(':id')
    async getUser(@Param('id') id: string) {
        const user = await this.userRepository.findByExternalId(id)
        return user
    }

    @UseInterceptors(ResponseInterceptor)
    @Post()
    async createUser(@Body() body: any) {
        const isUserCreated = await this.userRepository.existsByExternalId(body.externalId)
        if (isUserCreated) {
            throw new BadRequestException('User already exists')
        }

        const user = await this.userRepository.create(body.user)
        return user
    }

}
