import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema, Types } from "mongoose";

export type ResultDocument = Result & Document;

export class Result {

    @Prop({ type: Schema.Types.ObjectId, ref: 'Student', required: true })
    owner: Types.ObjectId;

    
}

export const ResultSchema = SchemaFactory.createForClass(Result);


