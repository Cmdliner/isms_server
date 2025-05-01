import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";
import { ACADEMIC_SESSION_REGEX } from "../../lib/constants";

export type ClassroomDocument = Classroom & Document;

@Schema({ timestamps: true })
export class Classroom {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, match: ACADEMIC_SESSION_REGEX })
    academic_session: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Teacher' })
    class_teacher: Types.ObjectId;

    @Prop({ default: true })
    is_active: boolean;

    @Prop({})
    deleted_at: Date;

    @Prop({ type: MongooseSchema.Types.Int32, min: 0, default: 0 })
    no_of_students: number;
}

export const ClassroomSchema = SchemaFactory.createForClass(Classroom).index({
    name: 1,
    academic_session: 1
}, { unique: true });

