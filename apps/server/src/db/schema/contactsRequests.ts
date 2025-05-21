import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm';
import { users } from './users';

export const contactRequests = pgTable('contact_requests', {
    id: uuid().defaultRandom().primaryKey(),
    sender: uuid().notNull().references(() => users.id),
    receiver: uuid().notNull().references(() => users.id),
    createdAt: timestamp({ mode: 'date' }).defaultNow(),
})

export const contactRequestsRelations = relations(contactRequests, ({ one }) => ({
    sender: one(users, {
        fields: [contactRequests.sender],
        references: [users.id],
        relationName: 'requestSender'
    }),
    receiver: one(users, {
        fields: [contactRequests.receiver],
        references: [users.id],
        relationName: 'requestReceiver'
    }),
}))