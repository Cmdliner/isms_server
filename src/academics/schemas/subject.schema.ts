import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";

export type SubjectDocument = Subject & Document;

@Schema({ timestamps: true })
export class Subject {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    code: string;

    @Prop()
    description: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Teacher' }], default: [] })
    teachers: Types.ObjectId[];

    @Prop({ required: true })
    grade_level: string;

    @Prop({ required: true })
    academic_session: string;

    @Prop({ defualt: true })
    is_active: boolean;

    @Prop({})
    deleted_at: Date;

}

export const SubjectSchema = SchemaFactory.createForClass(Subject).index({
    code: 1,
    academic_session: 1
}, { unique: true });