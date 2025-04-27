import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) { }


    async getByRole(role: string) {
        return this.userModel.find({ role }).sort({ createdAt: -1 }).select('-password');
    }
}
