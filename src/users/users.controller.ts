import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ChallengesValidator } from "src/challenges/challenges.validator";
import { User } from "./user.model";
import { UsersService } from "./users.service";
import { UsersValidator } from "./users.validator";

@Controller("Users")
@ApiTags("Users")
export class UserController {
  constructor(private usersService: UsersService,
    private usersValidator: UsersValidator,
    private challengesValidator: ChallengesValidator) { }

  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Get all users",
    type: [User],
  })
  async getAllArtists() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOkResponse({
    status: 201,
    description: "Adds new challenge",
    type: User,
  })
  async addUser(@Body() user: User) {
    await this.usersValidator.throwErrorIfUserNameIsNotExist(user.username);
    await this.challengesValidator.throwErrorIfOneOfChallengesIdsIsNotExist(user.recommendedChallenges);
    await this.challengesValidator.throwErrorIfOneOfChallengesIdsIsNotExist(user.acceptedChallenges);


    user.totalScore = 0;

    return this.usersService.addUser(user);
  }
}
