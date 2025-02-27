import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/db/connection';
import * as schema from 'src/db/schema'
import { CreateUserDto } from '../dtos/user.dto';

@Injectable()
export class UserRepository {

    private db = db

    async findAll() {
        return await this.db.select().from(schema.users)
    }

    async findById(userId: string) {
        return await this.db.select().from(schema.users).where(eq(schema.users.id, userId))
    }

    async findByExternalId(externalId: string) {
        return await this.db.select().from(schema.users).where(eq(schema.users.externalId, externalId))
    }

    async create({ name, externalId }: CreateUserDto) {
        return await this.db.insert(schema.users).values({ name, externalId }).returning()
    }

    async exists(userId: string) {
        const user = await this.findById(userId)
        return user.length > 0
    }

    async existsByExternalId(externalId: string) {
        const user = await this.findByExternalId(externalId)
        return user.length > 0
    }

}
