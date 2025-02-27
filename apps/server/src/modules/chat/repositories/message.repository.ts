import { Injectable } from '@nestjs/common';
import { and, eq, or } from 'drizzle-orm';
import { db } from 'src/db/connection';
import * as schema from 'src/db/schema';

@Injectable()
export class MessageRepository {
    private db = db;

    async findAllByUser(userId: string) {
        return await this.db
            .select()
            .from(schema.messages)
            .where(
                or(
                    eq(schema.messages.ownerId, userId),
                    eq(schema.messages.receptorId, userId),
                ),
            );
    }

    async findAllByReceptor(userId: string, receptorId: string) {
        return await this.db
            .select()
            .from(schema.messages)
            .where(
                or(
                    and(
                        eq(schema.messages.ownerId, userId),
                        eq(schema.messages.receptorId, receptorId),
                    ),
                    and(
                        eq(schema.messages.ownerId, receptorId),
                        eq(schema.messages.receptorId, userId),
                    ),
                )
            );
    }

    async create({ ownerId, receptorId, text }) {
        return await this.db
            .insert(schema.messages)
            .values({
                ownerId,
                receptorId,
                text,
            })
            .returning();
    }
}
