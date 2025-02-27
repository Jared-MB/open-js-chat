import type { UUID } from "node:crypto";

export class CreateUserDto {
    name: string
    externalId: string
}

export class UserDto extends CreateUserDto {
    id: UUID;
}

