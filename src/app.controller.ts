import { Controller, Get, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({ version: VERSION_NEUTRAL })
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get('healthz')
    getServerStatus(): string {
        return this.appService.getServerStatus();
    }
}
