import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./user.model";
import { GenericDalService } from "src/common/genericDalService.service";

@Injectable()
export class UsersService extends GenericDalService<User> {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>
  ) {
    super(usersModel);
  }

  async findAllUsers() {
    return this.findAll();
  }

  async addUser(user: User) {
    return this.addEntity(user);
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
