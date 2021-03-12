import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Challenge } from "src/challenges/challenge.model";
import { User, UserDto } from "./user.model";
import { UsersService } from "./users.service";

@Injectable()
export class UsersHelper {
  constructor(private usersService: UsersService) {
  }

  async addCreatedUserToChallenges(challenges: Challenge[]) {
    const userIdToUserDetails = {};
    for (const challenge of challenges) {
      if (userIdToUserDetails[challenge.createdBy._id]) {
        challenge.createdBy = userIdToUserDetails[challenge.createdBy._id]
      } else {
        challenge.createdBy = await this.usersService.findUserById(challenge.createdBy._id);
      }
    }
  }
}