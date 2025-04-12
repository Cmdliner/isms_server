import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Document, Types } from "mongoose";
import { User } from "../user.schema";

export type TeacherDocument = Teacher & Document;

@Schema()
export class Teacher extends User {

    @Prop({ default: true })
    is_active: boolean;

    @Prop({ required: true, index: true, unique: true, trim: true, uppercase: true })
    staff_id: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Subject' }], default: [] })
    subjects: Types.ObjectId[];

    @Prop({ required: true })
    qualifications: string[];

    @Prop({ required: true })
    employed_at: Date;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Classroom' })
    home_room?: Types.ObjectId;

    @Prop()
    bio?: string;

    @Prop({ index: true })
    is_hod: boolean;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);