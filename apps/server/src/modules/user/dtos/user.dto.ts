import { users } from "src/db/schema/users"

export type CreateUserDto = typeof users.$inferInsert & {
    avatar?: string
}

export type UserDto = typeof users.$inferSelect
