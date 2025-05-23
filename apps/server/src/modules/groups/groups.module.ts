import { Module } from "@nestjs/common";
import { GroupsController } from "./controllers/groups.controller";
import { GroupMemberRepository } from "./repositories/group-member.repository";
import { GroupRepository } from "./repositories/group.repository";
import { GroupsService } from "./services/groups.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [UserModule],
    controllers: [GroupsController],
    providers: [GroupMemberRepository, GroupRepository, GroupsService],
    exports: [GroupsService, GroupRepository]
})
export class GroupsModule { }