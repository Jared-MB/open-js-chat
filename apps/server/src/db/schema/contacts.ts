import { pgTable, timestamp, uuid, boolean, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm';
import { users } from './users';

export const contacts = pgTable('contacts', {
    id: uuid().defaultRandom().primaryKey(),
    user: text().notNull().references(() => users.email),
    contact: text().notNull().references(() => users.email),
    blockedByUser: boolean().default(false),
    blockedByContact: boolean().default(false),
    createdAt: timestamp({ mode: 'date' }).defaultNow(),
})

export const contactsRelations = relations(contacts, ({ one }) => ({
    user: one(users, {
        fields: [contacts.user],
        references: [users.email],
        relationName: 'userContacts'
    }),
    contact: one(users, {
        fields: [contacts.contact],
        references: [users.email],
        relationName: 'contactOf'
    }),
}))