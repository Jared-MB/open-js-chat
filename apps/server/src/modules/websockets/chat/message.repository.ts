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
                    eq(messages.fromUserId, userId),
                    eq(messages.targetId, userId),
                ),
            );
    }

    async findAllByGroup(groupId: string) {
        return await this.db
            .select()
            .from(messages)
            .where(
                eq(messages.targetId, groupId),
            );
    }

    async findAllByReceptor(userId: string, to: string) {
        return await this.db
            .select()
            .from(messages)
            .where(
                or(
                    and(
                        eq(messages.fromUserId, userId),
                        eq(messages.targetId, to),
                    ),
                    and(
                        eq(messages.fromUserId, to),
                        eq(messages.targetId, userId),
                    ),
                )
            );
    }

    async create({ from, to, text, targetType = 'user' }: { from: string, to: string, text: string, targetType?: 'user' | 'group' }) {
        return await this.db
            .insert(messages)
            .values({
                fromUserId: from,
                targetId: to,
                text,
                targetType
            })
            .returning();
    }
}
