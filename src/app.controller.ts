import { Controller, Get, HttpStatus, Redirect, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({ version: VERSION_NEUTRAL })
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    @Redirect('/healthz', HttpStatus.MOVED_PERMANENTLY)
    home() {}

    @Get('healthz')
    getServerStatus() {
        return this.appService.getServerStatus();
    }
}
