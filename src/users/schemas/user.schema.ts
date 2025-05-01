import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Gender, UserRole } from "../../lib/enums";

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

    @Prop({ default: new Date() })
    last_login: Date;

    @Prop({ required: true, enum: Object.values(Gender) })
    gender: Gender;

    @Prop({})
    profile_image?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);