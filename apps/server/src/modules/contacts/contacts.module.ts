import { Module } from "@nestjs/common";

import { UserModule } from "src/modules/user/user.module";

import { ContactsRequestsRepository } from "./repositories/contacts-requests.repository";

import { ContactsGateway } from "./gateways/contacts.gateway";

import { ContactsRequestsController } from "./controllers/contacts-requests.controller";
import { ContactsController } from "./controllers/contacts.controller";
import { AuthService } from "src/services/auth.service";
import { ContactsRepository } from "./repositories/contacts.repository";
import { GroupsModule } from "../groups/groups.module";

@Module({
    imports: [UserModule, GroupsModule],
    controllers: [ContactsController, ContactsRequestsController],
    providers: [ContactsRequestsRepository, ContactsRepository, ContactsGateway, AuthService],
})
export class ContactsModule { }