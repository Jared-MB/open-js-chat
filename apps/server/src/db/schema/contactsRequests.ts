import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm';
import { users } from './users';

export const contactRequests = pgTable('contact_requests', {
    id: uuid().defaultRandom().primaryKey(),
    sender: text().notNull().references(() => users.email),
    receiver: text().notNull().references(() => users.email),
    status: text().default('pending'), // 'pending', 'accepted', 'rejected'
    createdAt: timestamp({ mode: 'date' }).defaultNow(),
})

export const contactRequestsRelations = relations(contactRequests, ({ one }) => ({
    sender: one(users, {
        fields: [contactRequests.sender],
        references: [users.email],
        relationName: 'requestSender'
    }),
    receiver: one(users, {
        fields: [contactRequests.receiver],
        references: [users.email],
        relationName: 'requestReceiver'
    }),
}))