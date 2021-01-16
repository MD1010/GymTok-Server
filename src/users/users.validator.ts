import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
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

  async throwErrorIfOneOfUsersIdsIsNotExist(usersIds: string[]) {
    for (const userId of usersIds) {
      const user = await this.usersService.finsUserById(userId);
      if (!user) {
        throw new NotFoundException(`User id ${userId} is not exist`);
      }
    }
  }
}