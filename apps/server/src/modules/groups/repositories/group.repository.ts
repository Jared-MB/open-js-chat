import { Injectable } from "@nestjs/common";
import { Repository } from "src/interfaces/repository";
import { GroupDto, GroupInsertDto } from "../dtos/group.dto";
import { db } from "src/db/connection";
import { groups } from "src/db/schema/groups";
import { eq } from "drizzle-orm";

@Injectable()
export class GroupRepository implements Repository<GroupDto> {

    private db = db

    async create(data: GroupInsertDto): Promise<GroupDto[]> {
        return await this.db.insert(groups).values(data).returning();
    }

    async find(filter?: { id: string }): Promise<GroupDto[]> {
        if (filter) {
            return await this.db.select().from(groups).where(eq(groups.id, filter.id));
        }
        return await this.db.select().from(groups);
    }

    async findOne(filter?: { id: string }): Promise<GroupDto> {
        if (filter) {
            const group = await this.db.select().from(groups).where(eq(groups.id, filter.id)).limit(1);
            return group.at(0);
        }
        const group = await this.db.select().from(groups).limit(1);
        return group.at(0);
    }

}