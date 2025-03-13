import { pgTable, timestamp, uuid, boolean, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm';
import { users } from './users';

export const contacts = pgTable('contacts', {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid().notNull().references(() => users.id),
    contactId: uuid().notNull().references(() => users.id),
    blockedByUser: boolean().default(false),
    blockedByContact: boolean().default(false),
    createdAt: timestamp({ mode: 'date' }).defaultNow(),
})

export const contactsRelations = relations(contacts, ({ one }) => ({
    user: one(users, {
        fields: [contacts.userId],
        references: [users.id],
        relationName: 'userContacts'
    }),
    contact: one(users, {
        fields: [contacts.contactId],
        references: [users.id],
        relationName: 'contactOf'
    }),
}))