import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Classroom } from "../schemas/classroom.schema";
import { Model, MongooseError, Types } from "mongoose";
import { Student } from "../../users/schemas/discriminators/student.schema";
import { Teacher } from "../../users/schemas/discriminators/teacher.schema";
import { CreateClassroomDto, TransferStudentDto } from "../dtos/classroom.dto";

@Injectable()
export class ClassroomService {
    constructor(
        @InjectModel(Classroom.name) private classroomModel: Model<Classroom>,
        @InjectModel(Student.name) private studentModel: Model<Student>,
        @InjectModel(Teacher.name) private teacherModel: Model<Teacher>
    ) { }

    async create(classroomData: CreateClassroomDto) {
        try {
            await this.classroomModel.create(classroomData);
            return { success: true, message: 'Classroom created' };
        } catch (error) {
            await this.handleUniqueError(error);
        }
    }

    async assignTeacher(teacher_id: Types.ObjectId, classroom_id: Types.ObjectId) {
        const teacherExists = await this.teacherModel.exists({ _id: teacher_id });
        if (!teacherExists) throw new NotFoundException('Teacher not found');

        await this.classroomModel.findByIdAndUpdate(classroom_id, { $set: { class_teacher: teacher_id } });
        return { success: true, message: 'Teacher designation successful' };
    }

    async assignStudent(student_id: Types.ObjectId, classroom_id: Types.ObjectId) {
        const student = await this.studentModel.findByIdAndUpdate(student_id, { $set: { current_class: classroom_id } });
        if (!student) throw new NotFoundException('Student not found');

        await this.classroomModel.findByIdAndUpdate(classroom_id, { $inc: { no_of_students: 1 } });

        return { success: true, message: 'Student has been successfully assigned a class' }
    }

    async transferStudent(transfer_data: TransferStudentDto) {
        const { old_classroom_id, new_classroom_id, student_id } = transfer_data;
        await this.classroomModel.findByIdAndUpdate(old_classroom_id, { $inc: { no_of_students: -1 } });

        const student = await this.studentModel.findByIdAndUpdate(student_id, { $set: { current_class: new_classroom_id } });
        if (!student) throw new NotFoundException('Student not found');

        const newClassroom = await this.classroomModel.findByIdAndUpdate(new_classroom_id, { $inc: { no_of_students: 1 } });
        if (!newClassroom) throw new BadRequestException('Transfer class not found');

        return { success: true, message: 'Class transfer successful' };
    }

    async findAll(classroom_id: Types.ObjectId) {
        const students = await this.studentModel.find({ current_class: classroom_id }).lean();
        return { success: true, students };
    }

    private async handleUniqueError(error: any): Promise<void> {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            throw new BadRequestException(`The ${field} '${value}' is already taken.`);
        }
        throw new BadRequestException(error.message);
    }

}