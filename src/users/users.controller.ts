import { BadRequestException, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserRole } from '../lib/enums';
import { UsersService } from './users.service';

@UseGuards(AuthGuard)
@Controller({version: '1', path: 'users'})
export class UsersController {

    constructor(private usersService: UsersService) { }
    
    @Get(':role')
    async getByRole(@Param('role') role: string) {
        if (!(Object.values(UserRole) as string[]).includes(role)) throw new BadRequestException('Unknown role!');

        const result = await this.usersService.getByRole(role);
        return result;
    }
}
