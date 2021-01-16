import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UserDto, User } from "./user.model";
import { GenericService } from "src/common/genericService";

@Injectable()
export class UsersService extends GenericService<User> {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>
  ) {
    super(usersModel);
  }

  async findAllUsers() {
    return this.findAll();
  }

  async addUser(user: UserDto) {
    return this.add(user);
  }

  async getUserByUserName(username: string) {
    return this.usersModel.findOne({ username });
  }

  async findUsersByIds(usersIds: string[]) {
    return this.findByIds(usersIds);
  }

  async addAcceptChallengeToUsers(challengeId: string, usersIds: string[]) {
    return this.usersModel.updateMany({ _id: { $in: usersIds } }, { $addToSet: { acceptedChallenges: challengeId } });
  }

  async addRecommendChallengeToUsers(challengeId: string, usersIds: string[]) {
    return this.usersModel.updateMany({ _id: { $in: usersIds } }, { $addToSet: { recommendedChallenges: challengeId } });
  }
}
