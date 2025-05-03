import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Student } from "../../users/schemas/discriminators/student.schema";
import { ClassStatsQuery, GradeUploadDataDto, ResultsQuery } from "../dtos/grade.dto";
import { Grade } from "../schemas/grade.schema";

@Injectable()
export class GradeService {
    constructor(
        @InjectModel(Grade.name) private gradeModel: Model<Grade>,
        @InjectModel(Student.name) private studentModel: Model<Student>,
    ) { }

    async uploadGrade(gradeData: GradeUploadDataDto) {
        const studentExists = await this.studentModel.findById(gradeData.student);
        if (!studentExists) throw new NotFoundException('Student not found');

        const {
            subject, student, classroom,
            school_term, academic_session,
            examination_score, continuous_assessment, uploaded_by
        } = gradeData;

        // Check if teacher teaches that subject
        return this.gradeModel.findOneAndUpdate({
            subject,
            student,
            school_term,
            academic_session,
            classroom
        }, { uploaded_by, examination_score, continuous_assessment }, { upsert: true, new: true });
    }

    async deleteGrade(id: Types.ObjectId) {
        const grade = await this.gradeModel.findById(id);
        if (!grade || grade.deleted_at) throw new NotFoundException('Grade not found');

        grade.deleted_at = new Date();

        await grade.save();

        return grade;

    }

    async getGrade(id: string | Types.ObjectId) {
        const grade = await this.gradeModel.findOne({
            _id: id,
            deleted_at: { $exists: false }
        }).populate('student', 'first_name last_name admission_no')
            .populate('subject', 'name code')
            .populate('classroom', 'name')
            .populate('uploaded_at', 'first_name last_name').lean()

    }

    /**
     * Get grades by student, term, session, subject
     */
    async getGrades(query: Partial<ResultsQuery>) {
        const { student, term, session, subject } = query;
        const queryFilter: any = { deleted_at: { $exists: false } };
        if (student) queryFilter.student = student;
        if (term) queryFilter.term = term;
        if (session) queryFilter.session = session;
        if (subject) queryFilter.subject = subject;

        return this.gradeModel.find(queryFilter)
            .populate('student', 'first_name last_name admission_no')
            .populate('subject', 'name code')
            .populate('classroom', 'name')
            .populate('uploaded_by', 'first_name last_name')
            .exec()
    }

    async getGradesStatistics(query: ClassStatsQuery) {
        const { classroom, subject, term, session } = query;
        const grades = await this.gradeModel.find({
            classroom,
            subject,
            school_term: term,
            academic_session: session,
            deleted_at: { $exists: false }
        });
        const result = { count: grades.length, average: 0, highest: 0, lowest: 0 };
        if (!grades || !grades.length) return result;

        const totalScores = grades.map(g => g.total_score);
        const classAverage = totalScores.reduce((acc, curr) => acc + curr, 0) / grades.length;

        result.average = classAverage;
        result.highest = Math.max(...totalScores);
        result.lowest = Math.min(...totalScores);

    }

    async bulkUploadGrades(gradesData: GradeUploadDataDto[]): Promise<BulkUploadResult> {
        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const gradeData of gradesData) {
            try {
                await this.uploadGrade(gradeData);
                results.success++;
            } catch (error) {
                if (results)
                    results.failed++;
                // results.errors.push({
                //     data: gradeData,
                //     error: error.message
                // });
            }
        }

        return results;
    }

    // !todo => Complete this!!!
    async processResults(resultQuery: ResultsQuery) {
        let { term, ...query } = resultQuery;
        if (term) query = resultQuery;

        return this.gradeModel.find({ query }).populate(["student", "subject", "classroom"]).lean();
    }

}