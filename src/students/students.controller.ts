import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Types } from 'mongoose';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';

@UseGuards(AuthGuard)
@Controller({ version: '1', path: 'students' })
export class StudentsController {

    constructor(private studentsService: StudentsService) { }

    @Get('info')
    async getInfo(@User() user: ReqUser) {
        const result = this.studentsService.findById(new Types.ObjectId(`${user.sub}`));
        return result;
    }

    @Post(':id/guardians')
    async addGuardian(@Param('id') student_id: string, @Body('guardian_id') guardian_id: string) {
        return this.studentsService.addGuardian(student_id, guardian_id);
    }

    @Post('/assign-classroom')
    async assignClassroom(@User() user: ReqUser) {
        await this.studentsService.assignClassroom(new Types.ObjectId(user.sub));
    }
}