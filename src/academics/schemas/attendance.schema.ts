import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";
import { ACADEMIC_SESSION_REGEX } from "../../lib/constants";
import { AttendanceStatus } from "../../lib/enums";

export type AttenDanceDocument = Attendance & Document;

@Schema()
export class Attendance {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', required: true })
    student: Types.ObjectId;

    @Prop({ default: new Date() })
    date: Date

    @Prop({ type: String, enum: Object.values(AttendanceStatus), immutable: true, default: AttendanceStatus.ABSENT })
    status: AttendanceStatus;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Subject', required: true })
    subject: Types.ObjectId;

    @Prop({ required: true, match: ACADEMIC_SESSION_REGEX })
    academic_session: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);