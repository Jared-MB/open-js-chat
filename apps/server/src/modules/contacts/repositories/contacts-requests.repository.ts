import { Injectable } from "@nestjs/common";
import { db } from "src/db/connection";
import { contactRequests } from "src/db/schema/contactsRequests";
import { Repository } from "src/interfaces/repository";
import { ContactRequestDto } from "../dtos/contacts.dto";
import { and, eq } from "drizzle-orm";

type ContactRequestFilter = {
    sender?: string,
    receiver?: string
}

const ALLOWED_KEYS = ['sender', 'receiver']

@Injectable()
export class ContactsRequestsRepository implements Repository<ContactRequestDto> {
    private db = db;

    public async create({ sender, receiver }) {
        return await this.db.insert(contactRequests).values({
            sender,
            receiver,
        }).returning()
    }

    public async find(filter?: ContactRequestFilter): Promise<ContactRequestDto[]> {

        if (!filter) {
            return await this.db.select().from(contactRequests)
        }

        const filterConditions = Object.keys(filter).map((key) => {
            if (!ALLOWED_KEYS.includes(key)) {
                return null
            }
            return eq(contactRequests[key], filter[key])
        })

        const filters = filterConditions.filter((filter) => filter !== null)

        return await this.db.select().from(contactRequests).where(
            and(...filters)
        )

    }

    public async findOne(filter: ContactRequestFilter): Promise<ContactRequestDto | undefined> {
        const contactRequests = await this.find(filter)

        if (contactRequests.length === 0) {
            return undefined
        }

        return contactRequests.at(0)
    }

    public async remove({ receiver, sender }: { receiver: string, sender: string }) {
        try {
            await this.db.delete(contactRequests).where(
                and(
                    eq(contactRequests.receiver, receiver),
                    eq(contactRequests.sender, sender)
                )
            )
            return true
        }
        catch (error) {
            return false
        }
    }
}