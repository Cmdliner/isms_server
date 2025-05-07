import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorators/user.decorator';
import { StudentsService } from '../services/students.service';

@UseGuards(AuthGuard)
@Controller({ version: '1', path: 'students' })
export class StudentsController {

    constructor(private studentsService: StudentsService) { }

    @Get()
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