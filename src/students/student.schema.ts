import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { BloodGroup, StudentEnrollmentStatus, UserRole } from "src/utils";

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {

    @Prop({ required: true, immutable: true, default: UserRole.STUDENT })
    role: string = UserRole.STUDENT;

    @Prop({ sparse: true, unique: true, trim: true, lowercase: true })
    email?: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    first_name: string;

    @Prop({ required: true })
    last_name: string;

    @Prop({ required: true })
    last_login: Date

    @Prop({ required: true, index: true, unique: true, trim: true, uppercase: true })
    admission_no: string;

    // @Prop({ required: true, index: true, type: Types.ObjectId, ref: 'Classroom' })
    // current_class: Types.ObjectId;

    @Prop({ required: true, minlength: 1, index: true, type: [{ type: Types.ObjectId, ref: 'Guardian' }] })
    guardians: Types.ObjectId[];

    @Prop({ required: true })
    date_of_birth: Date;

    @Prop({ required: true, enum: ['M', 'F'] })
    gender: string;

    //! hint => Suggest moving to its own model and ref here
    @Prop({
        type: {
            blood_group: { type: String, enum: Object.values(BloodGroup) },
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