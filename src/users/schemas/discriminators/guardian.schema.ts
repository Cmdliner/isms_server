import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";
import { MaritalStatus } from "../../../lib/enums";
import { User } from "../user.schema";

export type GuardianDocument = Guardian & Document;

@Schema()
export class Guardian extends User {

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Student', default: [] }] })
    wards: Types.ObjectId[];

    @Prop({ required: true })
    occupation: string;

    @Prop({ enum: Object.values(MaritalStatus) })
    marital_status: string;

    @Prop({ required: true})
    home_address: string;
}

export const GuardianSchema = SchemaFactory.createForClass(Guardian);