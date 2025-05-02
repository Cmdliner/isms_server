import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";

export type GradeDocument = Grade & Document;

@Schema({ timestamps: true })
export class Grade {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Student' })
    student: Types.ObjectId;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Subject' })
    subject: Types.ObjectId;

    @Prop({ required: true, enum: ['first', 'second', 'third'] })
    school_term: string;

    @Prop({ required: true })
    academic_session: string;

    @Prop({ min: 0 })
    continuous_assessment: number;

    @Prop({ min: 0 })
    examination_score: number;

    @Prop({ virtual: true })
    get total_score(): number {
        return this.continuous_assessment + this.examination_score;
    }

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Classroom' })
    classroom: Types.ObjectId;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Teacher' })
    uploaded_by: Types.ObjectId;

    @Prop({})
    deleted_at: Date;

}

export const GradeSchema = SchemaFactory.createForClass(Grade);

GradeSchema.set('toJSON', { virtuals: true });
GradeSchema.set('toObject', { virtuals: true })