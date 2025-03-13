import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/db/connection';
import { users } from 'src/db/schema/users'
import { CreateUserDto, UserDto } from '../dtos/user.dto';
import { Repository } from 'src/interfaces/repository';

type UserFilter = { id: string, email?: never } | { email: string, id?: never }

@Injectable()
export class UserRepository implements Repository<UserDto> {

    private db = db

    public async find(filter?: UserFilter) {

        if (!filter) {
            return await this.db.select().from(users)
        }

        const filterKey = Object.keys(filter)[0]

        return await this.db.select().from(users)
            .where(
                eq(users[filterKey], filter[filterKey])
            )
    }

    public async findOne(filter: UserFilter): Promise<UserDto | undefined> {
        const users = await this.find(filter)

        if (users.length === 0) {
            return undefined
        }

        return users.at(0)
    }

    async create({ nickname = '', ...rest }: CreateUserDto) {
        return await this.db.insert(users).values({ nickname, ...rest }).returning()
    }
}
