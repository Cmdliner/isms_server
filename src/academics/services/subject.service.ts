import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Teacher } from "../../users/schemas/discriminators/teacher.schema";
import { CreateSubjectDto } from "../dtos/subject.dto";
import { Subject } from "../schemas/subject.schema";

@Injectable()
export class SubjectsService {
    constructor(
        @InjectModel(Subject.name) private subjectModel: Model<Subject>,
        @InjectModel(Teacher.name) private teacherModel: Model<Teacher>
    ) { }

    async create(createSubjectData: CreateSubjectDto) {
       try {
         return await this.subjectModel.create(createSubjectData);
       } catch (error) {
            await this.handleUniqueError(error);
       }
    }

    async getDetails(subject_id: Types.ObjectId) {
        const subject = await this.subjectModel.findById(subject_id).populate('teachers');
        if (!subject) throw new NotFoundException('Subject not found');

        return { success: true, subject }
    }

    async allocateTeacher(subject_id: Types.ObjectId, teacher_id: Types.ObjectId,) {
        const teacher = await this.teacherModel.findById(teacher_id).lean().exec();
        if (!teacher) throw new NotFoundException('Teacher not found');

        const subject = await this.subjectModel.findByIdAndUpdate(subject_id, { $addToSet: { teachers: teacher_id } });
        if (!subject) throw new NotFoundException('Subject not found');

        return { success: true, subject: subject.id }

    }

    async findBySession() { }

    async findOne() { }

    async update() { }

    async remove(subject_id: Types.ObjectId) {
        const result = await this.subjectModel.findByIdAndUpdate(subject_id,
            { $set: { deleted_at: new Date() } },
            { new: true });
        if (!result) throw new NotFoundException('Subject not found');

        return { deleted: true, id: result.id };
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