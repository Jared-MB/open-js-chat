import { Body, Controller, ForbiddenException, Get, InternalServerErrorException, Param, Post, Request, UseInterceptors } from "@nestjs/common";
import { GroupRepository } from "../repositories/group.repository";
import { GroupInsertDto } from "../dtos/group.dto";
import { GroupMemberRepository } from "../repositories/group-member.repository";
import { ResponseInterceptor } from "src/interceptors/response.interceptor";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { GroupsService } from "../services/groups.service";

@UseInterceptors(ResponseInterceptor)
@Controller('groups')
export class GroupsController {

    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly groupRepository: GroupRepository,
        private readonly groupMemberRepository: GroupMemberRepository,
        private readonly groupsService: GroupsService,
    ) { }

    @Get(':id')
    async getGroup(@Param('id') id: string) {
        const group = await this.groupRepository.findOne({ id });
        return {
            name: group.name,
        }
    }

    @Get(':id/members')
    async getGroupMembers(@Param('id') id: string, @Request() req: { user: { userId: string } }) {
        const isUserInGroup = await this.groupsService.isInGroup(req.user.userId, id);
        if (!isUserInGroup) {
            throw new ForbiddenException()
        }
        const groupMembers = await this.groupsService.getGroupMembers(id);
        return groupMembers;
    }

    @Post()
    async createGroup(@Request() req: { user: { userId: string, username: string } }, @Body() body: GroupInsertDto & { users: string[] }) {
        const user = req.user;

        const group = await this.groupRepository.create({
            name: body.name,
            createdBy: user.userId
        });
        if (group.length === 0) {
            throw new InternalServerErrorException('Error al crear el grupo')
        }

        const groupMembers = body.users.map((userId) => ({
            userId,
            groupId: group[0].id,
            isAdmin: false,
        }))

        groupMembers.push({
            userId: user.userId,
            groupId: group[0].id,
            isAdmin: true,
        })

        await this.groupMemberRepository.create(groupMembers);
        this.eventEmitter.emit('group.add', {
            group: {
                id: group[0].id,
                name: group[0].name,
                createdBy: {
                    id: user.userId,
                    name: user.username,
                }
            },
            users: [...body.users, user.userId],
        })

        return group;
    }
}