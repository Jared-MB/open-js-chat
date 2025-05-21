import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'
import { relations } from 'drizzle-orm'

export const contacts = pgTable('contacts', {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid().notNull().references(() => users.id),
    otherUserId: uuid().notNull().references(() => users.id),
    createdAt: timestamp({ mode: 'date' }).defaultNow(),
})

export const contactsRelations = relations(contacts, ({ one }) => ({
    users: one(users, {
        fields: [contacts.userId],
        references: [users.id],
        relationName: 'userContacts'
    }),
    otherUser: one(users, {
        fields: [contacts.otherUserId],
        references: [users.id],
        relationName: 'contactOf'
    }),
}))