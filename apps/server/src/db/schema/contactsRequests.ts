import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm';
import { users } from './users';

export const contactRequests = pgTable('contact_requests', {
    id: uuid().defaultRandom().primaryKey(),
    senderId: uuid().notNull().references(() => users.id),
    receiverId: uuid().notNull().references(() => users.id),
    status: text().default('pending'), // 'pending', 'accepted', 'rejected'
    message: text(),
    createdAt: timestamp({ mode: 'date' }).defaultNow(),
})

export const contactRequestsRelations = relations(contactRequests, ({ one }) => ({
    sender: one(users, {
        fields: [contactRequests.senderId],
        references: [users.id],
        relationName: 'requestSender'
    }),
    receiver: one(users, {
        fields: [contactRequests.receiverId],
        references: [users.id],
        relationName: 'requestReceiver'
    }),
}))