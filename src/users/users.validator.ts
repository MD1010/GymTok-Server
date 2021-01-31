import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { GenericValidator } from "../common/generic.validator";
import { User, UserDto } from "./user.model";
import { UsersService } from "./users.service";

@Injectable()
export class UsersValidator extends GenericValidator<User, UserDto>{
  constructor(private usersService: UsersService) {
    super(usersService.basicUsersService)
  }

  async throwErrorIfUserNameIsExist(userName: string) {
    const existUser = await this.usersService.getUserByUserName(userName);
    if (existUser) {
      throw new ConflictException(`The username ${userName} is already exist`);
    }
  }

  async throwErrorIfUserNameIsNotExist(userName: string) {
    const existUser = await this.usersService.getUserByUserName(userName);
    if (!existUser) {
      throw new ConflictException(`Wrong credentials.`);
    }
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