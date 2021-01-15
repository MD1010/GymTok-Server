import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO, User } from './user.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private readonly usersModel: Model<User>) { }

    async findAll() {
        return await this.usersModel.find();
    }
}
