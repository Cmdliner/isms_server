import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getServerStatus(): string {
        return 'The hood is up Cmdliner⚡⚡';
    }
}
