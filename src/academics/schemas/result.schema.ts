import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";
import { ACADEMIC_SESSION_REGEX } from "../../lib/constants";

export type ResultSchema = Result & Document;

export class SubjectScore {
    @Prop({ required: true })
    subject_name: string;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Subject' })
    subject_id: Types.ObjectId;

    @Prop({ min: 0, max: 100, default: 0 })
    ca_score: number;

    @Prop({ min: 0, max: 100, default: 0 })
    exam_score: number;

    @Prop({ min: 0, max: 100, default: 0 })
    total_score: number;

    @Prop()
    grade: SubjectGrade;

    @Prop()
    remarks: string;
}

export class TermResult {
    @Prop({ type: [Object] })
    subjects: SubjectScore[];

    @Prop()
    total_score: number;

    @Prop()
    average_score: number;

    @Prop()
    position_in_class: number;

    @Prop()
    teacher_comment: string;

    @Prop()
    principal_comment: string;
}


@Schema({ timestamps: true })
export class Result {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Student' })
    student: Types.ObjectId;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Classroom' })
    classroom: Types.ObjectId;

    @Prop({ required: true, match: ACADEMIC_SESSION_REGEX })
    academic_session: string;

    @Prop({ type: Object })
    first_term: TermResult;

    @Prop({ type: Object })
    second_term?: TermResult;

    @Prop({ type: Object })
    third_term?: TermResult;

    @Prop()
    cumulative_average: number;

    @Prop()
    final_position: number;

    @Prop()
    promotion_status: string;
}

export const ResultSchema = SchemaFactory.createForClass(Result).index({
    student: 1,
    classroom: 1,
    academic_session: 1
}, { unique: true });