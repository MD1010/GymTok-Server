import { ConflictException, Injectable } from "@nestjs/common";
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
}