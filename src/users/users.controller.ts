import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiCreatedResponse } from "@nestjs/swagger";
import { ChallengesValidator } from "../challenges/challenges.validator";
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDto } from "./user.model";
import { UsersService } from "./users.service";
import { UsersValidator } from "./users.validator";

@Controller("users")
@ApiTags("Users")
export class UserController {
  constructor(private usersService: UsersService,
    private usersValidator: UsersValidator,
    private challengesValidator: ChallengesValidator) { }

  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Get all users",
    type: [UserDto],
  })
  async getAllArtists() {
    return this.usersService.findAllUsers();
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: 200,
    description: "Create a user",
    type: [CreateUserDto],
  })
  async register(@Body() createUserDto: CreateUserDto) {
      return await this.usersService.create(createUserDto);
  }

  @Post()
  @ApiOkResponse({
    status: 201,
    description: "Adds new challenge",
    type: UserDto,
  })
  async addUser(@Body() user: UserDto) {
    await this.usersValidator.throwErrorIfUserNameIsNotExist(user.username);
    await this.challengesValidator.getOrThrowErrorIfOneOfEntityIdsIsNotExist(user.recommendedChallenges);
    await this.challengesValidator.getOrThrowErrorIfOneOfEntityIdsIsNotExist(user.acceptedChallenges);

    return this.usersService.addUser(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: 200,
    description: "Login success",
    type: [LoginUserDto],
  })
  async login(@Body() loginUserDto: LoginUserDto) {
      return await this.usersService.login(loginUserDto);
  }
}
