import { Injectable } from "@nestjs/common";
import { GroupRepository } from "../repositories/group.repository";
import { GroupMemberRepository } from "../repositories/group-member.repository";
import { GroupDto } from "../dtos/group.dto";

@Injectable()
export class GroupsService {

    constructor(
        private readonly groupRepository: GroupRepository,
        private readonly groupMemberRepository: GroupMemberRepository,
    ) { }

    async getUserGroups(userId: string): Promise<(GroupDto & { isGroup: boolean })[]> {
        const userGroupMembers = await this.groupMemberRepository.find({ userId })
        const groups = await Promise.all(userGroupMembers.map(async (groupMember) => {
            const group = await this.groupRepository.findOne({ id: groupMember.groupId })
            return {
                ...group,
                isGroup: true
            }
        }))
        return groups
    }

    async isInGroup(userId: string, groupId: string): Promise<boolean> {
        const groupMember = await this.groupMemberRepository.findOne({ userId, groupId })
        return !!groupMember
    }

}