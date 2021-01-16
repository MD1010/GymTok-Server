import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.model";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>
  ) { }

  async findAll() {
    return this.usersModel.find();
  }

  async addUser(user: User) {
    const createdUser = new this.usersModel(user);

    return createdUser.save();
  }

  async getUserByUserName(username: string) {
    return this.usersModel.findOne({ username });
  }
}
