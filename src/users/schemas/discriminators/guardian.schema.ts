import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Document, Types } from "mongoose";
import { MaritalStatus, UserRole } from "src/lib/enums";
import { User } from "../user.schema";

export type GuardianDocument = Guardian & Document;

@Schema()
export class Guardian extends User {

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Student' }] })
    wards: Types.ObjectId[];

    @Prop({ required: true })
    occupation: string;

    @Prop({ enum: Object.values(MaritalStatus) })
    marital_status: string;

    @Prop({ required: true})
    home_address: string;
}

export const GuardianSchema = SchemaFactory.createForClass(Guardian);