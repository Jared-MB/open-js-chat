import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { OAuth2Client } from 'google-auth-library'

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService) { }

    private readonly OAuth = new OAuth2Client()

    public async signIn(userId: string) {
        return await this.jwtService.signAsync({ userId })
    }

    public async decodeToken(token: string) {
        return await this.jwtService.decode(token)
    }
}