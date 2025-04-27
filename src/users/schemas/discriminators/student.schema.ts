import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Document, Types } from "mongoose";
import { BloodGroup, StudentEnrollmentStatus } from "../../../lib/enums";
import { User } from "../user.schema";

export type StudentDocument = Student & Document;

@Schema()
export class Student extends User {

    @Prop({ required: true, index: true, unique: true, trim: true, uppercase: true })
    admission_no: string;

    // @Prop({ required: true, index: true, type: Types.ObjectId, ref: 'Classroom' })
    // current_class: Types.ObjectId;

    @Prop({ index: true, type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Guardian' }], default: [] })
    guardians: Types.ObjectId[];

    @Prop({ required: true })
    date_of_birth: Date;

    //! hint => Suggest moving to its own model and ref here
    @Prop({
        type: {
            blood_group: { type: String, enum:  Object.values(BloodGroup) },
            allergies: { type: [String], default: [] }
        }
    })
    medical_info?: {
        blood_group: string;
        allergies: string[];
    }

    @Prop({ enum: Object.values(StudentEnrollmentStatus), default: StudentEnrollmentStatus.ENROLLED })
    enrollment_status: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);