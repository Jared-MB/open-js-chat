import { groups } from "src/db/schema/groups";

export type GroupDto = typeof groups.$inferSelect;
export type GroupInsertDto = typeof groups.$inferInsert;