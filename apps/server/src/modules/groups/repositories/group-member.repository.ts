import { Injectable } from "@nestjs/common";
import { Repository } from "src/interfaces/repository";
import { GroupMemberDto, GroupMemberInsertDto } from "../dtos/group-member.dto";
import { db } from "src/db/connection";
import { groupMembers } from "src/db/schema/groups";
import { and, eq } from "drizzle-orm";

@Injectable()
export class GroupMemberRepository implements Repository<GroupMemberDto> {

    private db = db

    async create(data: GroupMemberInsertDto | GroupMemberInsertDto[]): Promise<GroupMemberDto[]> {
        if (Array.isArray(data)) {
            return await this.db.insert(groupMembers).values(data).returning();
        }
        return await this.db.insert(groupMembers).values(data).returning();
    }

    async find(filter?: { userId?: string, groupId?: string }): Promise<GroupMemberDto[]> {

        if (filter?.groupId && filter?.userId) {
            return await this.db.select().from(groupMembers).where(
                and(
                    eq(groupMembers.groupId, filter.groupId),
                    eq(groupMembers.userId, filter.userId)
                )
            );
        }

        if (filter?.userId) {
            return await this.db.select().from(groupMembers).where(
                eq(groupMembers.userId, filter.userId)
            );
        }

        return await this.db.select().from(groupMembers);

    }

    async findOne(filter?: { userId?: string, groupId?: string }): Promise<GroupMemberDto> {
        const groupMember = await this.find(filter)
        return groupMember.at(0)
    }

}