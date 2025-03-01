import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm';

import { users } from './users';

export const messages = pgTable('messages', {
    id: uuid().defaultRandom().primaryKey(),
    text: text().notNull(),
    from: uuid().notNull().references(() => users.id),
    to: uuid().notNull().references(() => users.id),
    date: timestamp({ mode: 'date' }).defaultNow(),
    read: boolean().default(false),
})

export const messagesRelations = relations(messages, ({ one }) => ({
    from: one(users, {
        fields: [messages.from],
        references: [users.id],
        relationName: 'fromMessages'
    }),
    to: one(users, {
        fields: [messages.to],
        references: [users.id],
        relationName: 'toMessages'
    }),
}))