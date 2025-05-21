import { pgTable, text, uuid, timestamp, boolean } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm';

import { users } from './users';
import { messages } from './messages';

export const groups = pgTable('groups', {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    description: text(),
    avatar: text(),
    createdAt: timestamp({ mode: 'date' }).defaultNow(),
    createdBy: uuid().notNull().references(() => users.id),
    isActive: boolean().default(true),
})

export const groupMembers = pgTable('group_members', {
    id: uuid().defaultRandom().primaryKey(),
    groupId: uuid().notNull().references(() => groups.id),
    userId: uuid().notNull().references(() => users.id),
    isAdmin: boolean().default(false),
    joinedAt: timestamp({ mode: 'date' }).defaultNow(),
})

export const groupsRelations = relations(groups, ({ many, one }) => ({
    messages: many(messages, { relationName: 'groupMessages' }),
    members: many(groupMembers, { relationName: 'groupMembers' }),
    creator: one(users, {
        fields: [groups.createdBy],
        references: [users.id],
    }),
}))

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
    group: one(groups, {
        fields: [groupMembers.groupId],
        references: [groups.id],
        relationName: 'groupMembers'
    }),
    user: one(users, {
        fields: [groupMembers.userId],
        references: [users.id],
        relationName: 'userGroups'
    }),
}))