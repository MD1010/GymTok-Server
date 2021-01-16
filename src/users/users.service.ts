import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./user.model";
import { BasicService } from "src/common/basic.service";

@Injectable()
export class UsersService extends BasicService<User> {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>
  ) {
    super(usersModel);
  }

  async findAllUsers() {
    return this.findAll();
  }

  async addUser(user: User) {
    return this.add(user);
  }

  async getUserByUserName(username: string) {
    return this.usersModel.findOne({ username });
  }

  async findUsersByIds(usersIds: string[]) {
    return this.findByIds(usersIds);
  }

  async addAcceptChallengeToUsers(challengeId: string, usersIds: string[]) {
    return this.usersModel.updateMany({ _id: { $in: usersIds } }, { $addToSet: { acceptedChallenges: challengeId }, $pull: { recommendedChallenges: challengeId } });
  }

  async addRecommendChallengeToUsers(challengeId: string, usersIds: string[]) {
    return this.usersModel.updateMany({ _id: { $in: usersIds } }, { $addToSet: { recommendedChallenges: challengeId } });
  }
}
