import { Injectable } from "@nestjs/common";
import { Repository } from "src/interfaces/repository";
import { ContactDto, CreateContactDto } from "../dtos/contacts.dto";
import { db } from "src/db/connection";
import { contacts } from "src/db/schema/contacts";
import { and, eq, or } from "drizzle-orm";

@Injectable()
export class ContactsRepository implements Repository<ContactDto> {

    private db = db

    public async create({ otherUserId, userId }: CreateContactDto) {
        return this.db.insert(contacts).values({
            otherUserId,
            userId
        }).returning()
    }

    public async find(filter?: { userId?: string, otherUserId?: string }): Promise<ContactDto[]> {
        if (!filter) {
            return await this.db.select().from(contacts)
        }

        if (filter.userId && filter.otherUserId) {
            return await this.db.select().from(contacts).where(
                or(
                    and(
                        eq(contacts.userId, filter.userId),
                        eq(contacts.otherUserId, filter.otherUserId)
                    ),
                    and(
                        eq(contacts.userId, filter.otherUserId),
                        eq(contacts.otherUserId, filter.userId)
                    )
                )
            )
        }

        if (filter.userId) {
            return await this.db.select().from(contacts).where(
                or(
                    eq(contacts.userId, filter.userId),
                    eq(contacts.otherUserId, filter.userId)
                )
            )
        }

        if (filter.otherUserId) {
            return await this.db.select().from(contacts).where(
                or(
                    eq(contacts.otherUserId, filter.otherUserId),
                    eq(contacts.userId, filter.otherUserId)
                )
            )
        }

        return []
    }

    public async findOne(filter: { userId?: string, otherUserId?: string }): Promise<ContactDto> {
        const contacts = await this.find(filter)

        if (contacts.length === 0) {
            return undefined
        }

        return contacts.at(0)
    }

}