import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from '../users/schemas/discriminators/student.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class StudentsService {
    constructor(
        @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>
    ) { }

    async create() { }

    async findById(id: Types.ObjectId): Promise<StudentDocument> {
        const student = await this.studentModel.findById(id).populate('guardians');
        if (!student) throw new NotFoundException('Student not found!');
        return student;
    }

    async findByAdmissionNo(admission_no: string): Promise<StudentDocument> {
        const student = await this.studentModel.findOne({ admission_no });
        if(!student) throw new NotFoundException('Student not found!')
        return student;
    }

    async findAllInClass() { }
}