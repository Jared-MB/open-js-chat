import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { Public } from "./modules/auth/decorators/public.decorator";

@Controller()
export class AppController {

    @Public()
    @HttpCode(HttpStatus.OK)
    @Get('health-check')
    healthCheck() {
        return 'ok';
    }

}