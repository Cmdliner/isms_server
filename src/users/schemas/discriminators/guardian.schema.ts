import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Document, Types } from "mongoose";
import { MaritalStatus, UserRole } from "src/enums";
import { User } from "../user.schema";

export type GuardianDocument = Guardian & Document;

@Schema()
export class Guardian extends User {

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Student' }] })
    wards: Types.ObjectId[];

    @Prop({ required: true })
    occupation: string;

    @Prop({enum: Object.values(MaritalStatus) })
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