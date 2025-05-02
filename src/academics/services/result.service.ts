import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { compareObjectId } from "../../lib/utils";
import { Grade } from "../schemas/grade.schema";
import { Result, ResultSchema, SubjectScore, TermResult } from "../schemas/result.schema";
import { Subject } from "../schemas/subject.schema";

@Injectable()
export class ResultService {

    constructor(
        @InjectModel(Result.name) private resultModel: Model<Result>,
        @InjectModel(Subject.name) private subjectModel: Model<Subject>
    ) { }

    /**
     * Synchronize a grade to the result document
     */
    async syncGradeToResult(grade: Grade): Promise<ResultSchema> {
        let result: ResultSchema = await this.resultModel.findOne({
            student: grade.student,
            classroom: grade.classroom,
            academic_session: grade.academic_session
        }) as any as ResultSchema;

        if (!result) {
            result = new this.resultModel({
                student: grade.student,
                classroom: grade.classroom,
                academic_session: grade.academic_session,
                first_term: { subjects: [] },
                second_term: { subjects: [] },
                third_term: { subjects: [] },
                cumulative_average: 0
            });
        }

        const subject = await this.subjectModel.findById(grade.subject);
        if (!subject) throw new NotFoundException('Subject with ID ${grade.subject} not found');

        const termKey = `${grade.school_term}_term`;
        const termResult: TermResult = result[termKey] || { subjects: [] };

        // Create/update subject score
        const subjectScore: SubjectScore = {
            subject_name: subject.name,
            subject_id: grade.subject,
            ca_score: grade.continuous_assessment,
            exam_score: grade.examination_score,
            total_score: grade.continuous_assessment + grade.examination_score,
            grade: this.calculateGrade(grade.continuous_assessment + grade.examination_score),
            remarks: this.getRemarks(grade.continuous_assessment + grade.examination_score)
        };

        const existingSubjectIndex = termResult.subjects.findIndex((s) => compareObjectId(s.subject_id, grade.subject));

        if (existingSubjectIndex >= 0) termResult.subjects[existingSubjectIndex] = subjectScore;
        else termResult.subjects.push(subjectScore);

        // Recalculate stats
        this.recalculateTermStatistics(termResult);
        result[termKey] = termResult;

        // Update cumulative average across terms
        this.recalculateCumulativeAverage(result);

        // Save and return
        return result.save();
    }

    /**
     *  Remove a grade from result document
     */
    async removeGradeFromResult(grade: Grade): Promise<ResultSchema | null> {
        const result = await this.resultModel.findOne({
            student: grade.student,
            classroom: grade.classroom,
            academic_session: grade.academic_session
        });

        if (!result) return null;
        // Get the term
        const termKey = `${grade.school_term}_term`;
        const termResult: TermResult = result[termKey];

        termResult.subjects = termResult.subjects.filter(s => s.subject_id.toString() !== grade.subject.toString());

        // Recalculate stats
        this.recalculateTermStatistics(termResult);
        result[termKey] = termResult;

        // Update cumulative average
        this.recalculateCumulativeAverage(result);

        // Save and return
        return result.save();
    }

    async getStudentResult(student: Types.ObjectId, academic_session: string) {
        const result = await this.resultModel.findOne({
            student,
            academic_session
        })
            .populate('student', 'first_name last_name registration_number')
            .populate('classroom', 'name')
            .exec();

        if (!result) {
            throw new NotFoundException('Result not found');
        }

        return result;
    }

    async getClassResults(classroom: Types.ObjectId, academic_session: string, term?: string) {
        const results = await this.resultModel.find({
            classroom,
            academic_session
        })
            .populate('student', 'first_name last_name registration_number')
            .populate('classroom', 'name')
            .exec();

        // Calculate class positions
        if (results.length > 0 && term) {
            const termKey = `${term}_term`;
            // Sort by average score
            results.sort((a, b) => (b[termKey]?.average_score || 0) - (a[termKey]?.average_score || 0));

            // Update positions
            results.forEach((result, index) => {
                if (result[termKey]) {
                    result[termKey].position_in_class = index + 1;
                }
            });

            // Save all results with updated positions
            await Promise.all(results.map(result => result.save()));
        }

        return results;
    }

    async calculatePromotionStatus(classroom: Types.ObjectId, academic_session: string) {
        const results = await this.resultModel.find({
            classroom,
            academic_session
        }).exec();

        for (const result of results) {
            result.promotion_status = result.cumulative_average >= 45 ? 'Promoted' : 'Not Promoted';
            await result.save();
        }

        return results;
    }

    async updateTermComment(resultId: string, term: string, comments: { teacher_comment?: string, principal_comment?: string }) {
        const result = await this.resultModel.findById(resultId);

        if (!result) {
            throw new NotFoundException('Result not found');
        }

        const termKey = `${term}_term`;

        if (!result[termKey]) {
            throw new NotFoundException(`No data for ${term} term`);
        }

        if (comments.teacher_comment !== undefined) {
            result[termKey].teacher_comment = comments.teacher_comment;
        }

        if (comments.principal_comment !== undefined) {
            result[termKey].principal_comment = comments.principal_comment;
        }

        return result.save();
    }

    private recalculateTermStatistics(termResult: TermResult): void {
        if (!termResult || !termResult.subjects || !termResult.subjects.length) {
            termResult.total_score = 0;
            termResult.average_score = 0;
            return;
        }

        termResult.total_score = termResult.subjects.reduce(
            (sum, subject) => sum + subject.total_score, 0
        );

        termResult.average_score = termResult.total_score / termResult.subjects.length;
    }

    private recalculateCumulativeAverage(result: Result): void {
        const terms = ['first_term', 'second_term', 'third_term'];
        let validTerms = 0;
        let totalAverage = 0;

        for (const term of terms) {
            if (result[term] && result[term].subjects && result[term].subjects.length > 0) {
                totalAverage += result[term].average_score;
                validTerms++;
            }
        }
        result.cumulative_average = (validTerms > 0) ? (totalAverage / validTerms) : 0;
    }

    private calculateGrade(score: number): SubjectGrade {
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        if (score >= 50) return 'D';
        if (score >= 40) return 'E';
        return 'F';
    }

    private getRemarks(score: number): string {
        if (score >= 80) return 'Excellent';
        if (score >= 70) return 'Very Good';
        if (score >= 60) return 'Good';
        if (score >= 50) return 'Fair';
        if (score >= 40) return 'Pass';
        return 'Fail';
    }
}