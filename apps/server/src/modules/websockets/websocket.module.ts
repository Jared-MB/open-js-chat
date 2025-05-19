import { Module } from "@nestjs/common";

import { UserModule } from "src/modules/user/user.module";
import { ChatModule } from "./chat/chat.module";

@Module({
    imports: [UserModule, ChatModule],
})
export class WebsocketModule { }