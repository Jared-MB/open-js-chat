import { pgTable, text, timestamp, uuid, } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    externalId: text().notNull()
})

export const usersRelations = relations(users, ({ many }) => ({
    messages: many(messages)
}))

export const messages = pgTable('messages', {
    id: uuid().defaultRandom().primaryKey(),
    text: text().notNull(),
    ownerId: uuid().notNull(),
    receptorId: uuid().notNull(),
    date: timestamp({ mode: 'date' }).defaultNow()
})

export const messagesRelations = relations(messages, ({ one }) => ({
    owner: one(users, {
        fields: [messages.ownerId],
        references: [users.id],
    }),
    receptor: one(users, {
        fields: [messages.receptorId],
        references: [users.id],
    }),
}))