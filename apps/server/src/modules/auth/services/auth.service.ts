
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/modules/user/dtos/user.dto';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userRepository.findOne({ email });
        if (!user) {
            throw new UnauthorizedException();
        }
        const isSamePassword = await bcrypt.compare(pass, user?.password);
        if (!isSamePassword) {
            throw new UnauthorizedException();
        }

        return user;
    }

    async login(user: Partial<UserDto>): Promise<{ access_token: string }> {
        const payload = { sub: user.id, username: user.name };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async getSession(user: any) {
        return user;
    }
}
