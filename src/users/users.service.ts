import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UserDto, User } from "./user.model";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>
  ) { }

  async findAll() {
    return this.usersModel.find();
  }

  async addUser(user: UserDto) {
    const createdUser = new this.usersModel(user);

    return createdUser.save();
  }

  async getUserByUserName(username: string) {
    return this.usersModel.findOne({ username });
  }

  async findUsersByIds(usersIds: string[]) {
    return this.usersModel.find({ _id: { $in: usersIds } }).exec();
  }

  async addAcceptChallengeToUsers(challengeId: string, usersIds: string[]) {
    return this.usersModel.updateMany({ _id: { $in: usersIds } }, { $addToSet: { acceptedChallenges: challengeId } });
  }

  async addRecommendChallengeToUsers(challengeId: string, usersIds: string[]) {
    return this.usersModel.updateMany({ _id: { $in: usersIds } }, { $addToSet: { recommendedChallenges: challengeId } });
  }
}
