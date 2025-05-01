import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from '../schemas/discriminators/student.schema';
import { Model, Types } from 'mongoose';
import { Guardian } from '../schemas/discriminators/guardian.schema';

@Injectable()
export class StudentsService {

    constructor(
        @InjectModel(Student.name) private readonly studentModel: Model<Student>,
        @InjectModel(Guardian.name) private readonly guardianModel: Model<Guardian>
    ) { }


    async findById(id: Types.ObjectId): Promise<StudentDocument> {
        const student = await this.studentModel.findById(id).populate('guardians');
        if (!student) throw new NotFoundException('Student not found!');
        return student;
    }

    async findByAdmissionNo(admission_no: string): Promise<StudentDocument> {
        const student = await this.studentModel.findOne({ admission_no });
        if (!student) throw new NotFoundException('Student not found!')
        return student;
    }

    async addGuardian(student_id: string, guardian_id: string) {

        const guardian = await this.guardianModel.findById(guardian_id);
        if (!guardian) throw new NotFoundException('Guardian not found!');

        await this.studentModel.findOneAndUpdate({ _id: student_id }, { $addToSet: { guardians: guardian_id } });

        return { success: true, message: 'Guardian added successfully' };
    }

    async assignClassroom(user_id: Types.ObjectId) {
        const student = await this.studentModel.findById(user_id);
        if(!student) throw new NotFoundException('Student not found');
    }

    async findAllInClass() { }
}