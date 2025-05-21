import { groupMembers } from "src/db/schema/groups";

export type GroupMemberDto = typeof groupMembers.$inferSelect;
export type GroupMemberInsertDto = typeof groupMembers.$inferInsert;