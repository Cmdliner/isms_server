import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { UserRole } from "src/utils";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {

    @Prop({ required: true, index: true, immutable: true, enum: Object.values(UserRole) })
    role: string;

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

    @Prop({ required: true, enum: ['M', 'F'] })
    gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);