import { Controller, Get } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Types } from 'mongoose';

@Controller('students')
export class StudentsController {

    constructor(private studentsService: StudentsService) { }

    @Get('info')
    async getInfo() {
        this.studentsService.findById(new Types.ObjectId(''));
    }
}