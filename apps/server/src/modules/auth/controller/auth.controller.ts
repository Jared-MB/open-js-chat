import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { Public } from "../decorators/public.decorator";
import { UserRepository } from "src/modules/user/repositories/user.repository";
import * as bcrypt from "bcrypt"
import { ResponseInterceptor } from "src/interceptors/response.interceptor";
import { UserDto } from "src/modules/user/dtos/user.dto";

@UseInterceptors(ResponseInterceptor)
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userRepository: UserRepository
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Request() req: any) {
        return this.authService.login(req.user);
    }

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async signUp(@Body() signUpDto: Record<string, any>) {

        const { email, name, password } = signUpDto
        if (!email || !name || !password) {
            throw new BadRequestException()
        }

        const user = await this.userRepository.findOne({ email })

        if (user) {
            throw new BadRequestException()
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await this.userRepository.create({ email, name, password: hashedPassword, nickname: name })

        return this.authService.login(newUser[0])
    }

    @HttpCode(HttpStatus.OK)
    @Get('session')
    async getSession(@Request() req: any) {
        const user = await this.userRepository.findOne({ id: req.user.userId })
        const { password, ...rest } = user
        return { ...rest }
    }
}