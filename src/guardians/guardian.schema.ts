import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { MaritalStatus } from "src/utils";
import { UserRole } from "src/utils";

export type GuardianDocument = Guardian & Document;

@Schema({ timestamps: true })
export class Guardian {

    @Prop({ required: true, index: true, immutable: true })
    role: string = UserRole.GUARDIAN;

    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    first_name: string;

    @Prop({ required: true })
    last_name: string;

    @Prop({ required: true })
    last_login: Date;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Student' }] })
    wards: Types.ObjectId[];

    @Prop({ required: true })
    occupation: string;

    @Prop({ enum: Object.values(MaritalStatus) })
    marital_status: string;

    @Prop({
        type: {
            street: String,
            city: String,
            state: String,
            country: { type: String, default: 'Nigeria' },
            postal_code: String
        }
    })
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
    }
}

export const GuardianSchema = SchemaFactory.createForClass(Guardian);