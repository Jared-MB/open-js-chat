import { pgTable, text, uuid, timestamp, boolean } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm';

import { messages } from './messages';
import { contactRequests } from './contactsRequests';
import { contacts } from './contacts';

export const users = pgTable('users', {
    id: uuid().defaultRandom().primaryKey(),
    googleId: text().notNull().unique(),
    email: text().notNull().unique(),
    name: text().notNull(),
    nickname: text().notNull(),
    status: text().default('offline'),
    lastActive: timestamp({ mode: 'date' }).defaultNow(),
    isBanned: boolean().default(false),
})

export const usersRelations = relations(users, ({ many }) => ({
    messages: many(messages, { relationName: 'fromMessages' }),
    receivedMessages: many(messages, { relationName: 'toMessages' }),
    sentRequests: many(contactRequests, { relationName: 'requestSender' }),
    receivedRequests: many(contactRequests, { relationName: 'requestReceiver' }),
    contacts: many(contacts, { relationName: 'userContacts' }),
    contactOf: many(contacts, { relationName: 'contactOf' }),
}))