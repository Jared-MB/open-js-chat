import { Injectable } from "@nestjs/common";
import { GroupRepository } from "../repositories/group.repository";
import { GroupMemberRepository } from "../repositories/group-member.repository";
import { GroupDto } from "../dtos/group.dto";
import { UserRepository } from "src/modules/user/repositories/user.repository";

@Injectable()
export class GroupsService {

    constructor(
        private readonly groupRepository: GroupRepository,
        private readonly groupMemberRepository: GroupMemberRepository,
        private readonly userRepository: UserRepository,
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

    async getGroupMembers(groupId: string): Promise<{
        userId: string;
        isAdmin: boolean;
        username: string;
        email: string;
    }[]> {
        const rawGroupMembers = await this.groupMemberRepository.find({ groupId })
        const groupMembers = await Promise.all(rawGroupMembers.map(async (groupMember) => {
            const user = await this.userRepository.findOne({ id: groupMember.userId })
            return {
                userId: groupMember.userId,
                isAdmin: groupMember.isAdmin,
                username: user.name,
                email: user.email,
            }
        }))
        return groupMembers
    }

}