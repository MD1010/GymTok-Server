import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDto } from "./user.model";
import { GenericDalService } from "src/common/genericDalService.service";

@Injectable()
export class UsersService {
  public basicUsersService: GenericDalService<User, UserDto>;
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>
  ) {
    this.basicUsersService = new GenericDalService<User, UserDto>(usersModel);
  }

  async findAllUsers() {
    return this.basicUsersService.findAll();
  }

  async addUser(user: UserDto) {
    return this.basicUsersService.addEntity(user);
  }

  async getUserByUserName(username: string) {
    return this.basicUsersService.findPropertyWithSpecificValue('username', username);
  }

  async findUsersByIds(usersIds: string[]) {
    return this.basicUsersService.findByIds(usersIds);
  }

  async addAcceptChallengeToUsers(challengeId: string, usersIds: string[]) {
    return this.usersModel.updateMany({ _id: { $in: usersIds } }, { $addToSet: { acceptedChallenges: challengeId }, $pull: { recommendedChallenges: challengeId } });
  }

  async addRecommendChallengeToUsers(challengeId: string, usersIds: string[]) {
    return this.usersModel.updateMany({ _id: { $in: usersIds } }, { $addToSet: { recommendedChallenges: challengeId } });
  }
}
