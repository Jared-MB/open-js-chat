import { pgTable, text, timestamp, uuid, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm';

import { users } from './users';
import { groups } from './groups';

export const messageTargetType = {
    USER: 'user',
    GROUP: 'group',
} as const;

export const messageTargetTypeEnum = pgEnum('targetType', ['user', 'group'])

export const messages = pgTable('messages', {
    id: uuid().defaultRandom().primaryKey(),
    text: text().notNull(),
    fromUserId: uuid().notNull().references(() => users.id),
    targetType: messageTargetTypeEnum().notNull(), // 'user' o 'group'
    targetId: uuid().notNull(), // userId o groupId dependiendo del targetType
    date: timestamp({ mode: 'date' }).defaultNow(),
    read: boolean().default(false),
})

export const messagesRelations = relations(messages, ({ one }) => ({
    fromUser: one(users, {
        fields: [messages.fromUserId],
        references: [users.id],
        relationName: 'fromMessages'
    }),
    toGroup: one(groups, {
        fields: [messages.targetId],
        references: [groups.id],
        relationName: 'groupMessages'
    }),
}))