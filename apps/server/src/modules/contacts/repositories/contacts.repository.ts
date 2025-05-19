import { Injectable } from "@nestjs/common";
import { Repository } from "src/interfaces/repository";
import { ContactDto, CreateContactDto } from "../dtos/contacts.dto";
import { db } from "src/db/connection";
import { contacts } from "src/db/schema/contacts";
import { and, eq, or } from "drizzle-orm";

type ContactFilter = {
    user?: string,
    contactId?: string
}

const ALLOWED_KEYS = ['userId', 'contactId']

@Injectable()
export class ContactsRepository implements Repository<ContactDto> {

    private db = db

    public async create({ user, contact }: CreateContactDto) {
        return this.db.insert(contacts).values({
            user,
            contact
        }).returning()
    }

    public async find(filter?: { user?: string, contact?: string }): Promise<ContactDto[]> {
        if (!filter) {
            return await this.db.select().from(contacts)
        }

        if (filter.user && filter.contact) {
            console.log('both')
            return await this.db.select().from(contacts).where(
                or(
                    and(
                        eq(contacts.user, filter.user),
                        eq(contacts.contact, filter.contact)
                    ),
                    and(
                        eq(contacts.user, filter.contact),
                        eq(contacts.contact, filter.user)
                    )
                )
            )
        }

        if (filter.user) {
            console.log('user')
            return await this.db.select().from(contacts).where(
                or(
                    eq(contacts.user, filter.user),
                    eq(contacts.contact, filter.user)
                )
            )
        }

        if (filter.contact) {
            console.log('contact')
            return await this.db.select().from(contacts).where(
                or(
                    eq(contacts.contact, filter.contact),
                    eq(contacts.user, filter.contact)
                )
            )
        }

        return []
    }

    public async findOne(filter: { user?: string, contact?: string }): Promise<ContactDto> {
        const contacts = await this.find(filter)

        if (contacts.length === 0) {
            return undefined
        }

        return contacts.at(0)
    }

}