import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./user.model";
import { UsersService } from "./users.service";

@Injectable()
export class UsersValidator {
  constructor(private usersService: UsersService) { }

  async throwErrorIfUserNameIsNotExist(userName: string) {
    const existUser = await this.usersService.getUserByUserName(userName);
    if (existUser) {
      throw new ConflictException(`The username ${userName} is already exist`);
    }
  }

  async getOrThrowErrorIfOneOfUsersIdsIsNotExist(usersIds: string[]) {
    const users = await this.usersService.findUsersByIds(usersIds);
    if (users.length !== usersIds.length) {
      throw new NotFoundException(`At least one of the challenges ${JSON.stringify(usersIds)} is not exist`);
    }

    return users;
  }

  throwErrorIfRecommendedChallengeWasAcceptedForUsers(users: User[], challengeId: string) {
    for (const user of users) {
      const existAcceptedChallengeId = user.acceptedChallenges.find(acceptedChallengeId => acceptedChallengeId === challengeId);
      if (existAcceptedChallengeId) {
        throw new NotFoundException(`The challenge ${challengeId} was already accepted for user ${user._id}`);
      }
    }
  }
}