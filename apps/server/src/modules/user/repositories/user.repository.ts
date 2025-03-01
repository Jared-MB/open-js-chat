import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/db/connection';
import { users } from 'src/db/schema/users'
import { CreateUserDto } from '../dtos/user.dto';

@Injectable()
export class UserRepository {

    private db = db

    async findAll() {
        return await this.db.select().from(users)
    }

    async findById(userId: string) {
        return await this.db.select().from(users).where(eq(users.id, userId))
    }

    async findByEmail(email: string) {
        return await this.db.select().from(users).where(eq(users.email, email))
    }

    async create({ nickname = '', ...rest }: CreateUserDto) {
        return await this.db.insert(users).values({ nickname, ...rest }).returning()
    }

    async exists(userId: string) {
        const user = await this.findById(userId)
        return user.length > 0
    }

    async existsByEmail(email: string) {
        const user = await this.findByEmail(email)
        return user.length > 0
    }

}
