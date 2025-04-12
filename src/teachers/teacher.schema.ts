import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { UserRole } from "src/utils";

export type TeacherDocument = Teacher & Document;

@Schema({ timestamps: true })
export class Teacher {

    @Prop({ required: true, index: true, immutable: true })
    role: string =  UserRole.TEACHER;

    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    first_name: string;

    @Prop({ required: true })
    last_name: string;

    @Prop({ default: true })
    is_active: boolean;

    @Prop({ required: true })
    last_login: Date
    @Prop({ required: true, index: true, unique: true, trim: true, uppercase: true })
    staff_id: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Subject' }], default: [] })
    subjects: Types.ObjectId[];

    @Prop({ required: true })
    qualifications: string[];

    @Prop({ required: true })
    employed_at: Date;

    @Prop({ type: Types.ObjectId, ref: 'Classroom' })
    home_room?: Types.ObjectId;

    @Prop()
    bio?: string;

    @Prop({ index: true })
    is_hod?: boolean;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);