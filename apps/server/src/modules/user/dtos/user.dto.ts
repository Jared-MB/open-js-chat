import { users } from "src/db/schema/users"

export type CreateUserDto = typeof users.$inferInsert

export type UserDto = typeof users.$inferSelect
