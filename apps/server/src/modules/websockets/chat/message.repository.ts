import { Injectable } from '@nestjs/common';
import { and, eq, or } from 'drizzle-orm';
import { db } from 'src/db/connection';
import { messages } from 'src/db/schema/messages';

@Injectable()
export class MessageRepository {
    private db = db;

    async findAllByUser(userId: string) {
        return await this.db
            .select()
            .from(messages)
            .where(
                or(
                    eq(messages.from, userId),
                    eq(messages.to, userId),
                ),
            );
    }

    async findAllByReceptor(userId: string, to: string) {
        return await this.db
            .select()
            .from(messages)
            .where(
                or(
                    and(
                        eq(messages.from, userId),
                        eq(messages.to, to),
                    ),
                    and(
                        eq(messages.from, to),
                        eq(messages.to, userId),
                    ),
                )
            );
    }

    async create({ from, to, text }) {
        return await this.db
            .insert(messages)
            .values({
                from,
                to,
                text,
            })
            .returning();
    }
}
