import { Controller, Get, Post, Body, UseGuards, Headers, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiCreatedResponse, ApiHeader, ApiBearerAuth } from "@nestjs/swagger";
import { ChallengesValidator } from "../challenges/challenges.validator";
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDto } from "./user.model";
import { UsersService } from "./users.service";
import { AuthService } from "../auth/auth.service";
import { UsersValidator } from "./users.validator";
import { LinkPredictionService } from '../linkPrediction/linkPrediction.service';
import { ChallengeDto } from 'src/challenges/challenge.model';
import { LinkPredictionHelper } from 'src/linkPrediction/linkPrediction.helper';
import { ChallengesService } from 'src/challenges/challenges.service';

@Controller("users")
@ApiTags("Users")
export class UserController {
  constructor(private usersService: UsersService,
    private usersValidator: UsersValidator,
    private challengesValidator: ChallengesValidator,
    private challengesService: ChallengesService,
    private authService: AuthService,
    private linkPredictionService: LinkPredictionService,
    private linkPredictionHelper: LinkPredictionHelper) { }

  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Get all users",
    type: [UserDto],
  })
  async getAllUsers() {
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
    await this.usersValidator.throwErrorIfUserNameIsExist(createUserDto.username);
    return await this.usersService.create(createUserDto);
  }

  @Post()
  @ApiOkResponse({
    status: 201,
    description: "Adds new challenge",
    type: UserDto,
  })
  async addUser(@Body() user: UserDto) {
    await this.usersValidator.throwErrorIfUserNameIsExist(user.username);
    await this.challengesValidator.getOrThrowErrorIfOneOfEntityIdsIsNotExist(user.recommendedChallenges);
    await this.challengesValidator.getOrThrowErrorIfOneOfEntityIdsIsNotExist(user.acceptedChallenges);

    return this.usersService.addUser(user);
  }

  @Get(":username/recommendedChallenges")
  @ApiOkResponse({
    status: 200,
    description: "Adds to the challenge id to the recommended challenges of the user ids",
    type: [ChallengeDto],
  })
  async getRecommendChallengeByUserId(@Param('username') username: string, @Query("page") page: number, @Query("size") size: number) {
    const user = await this.usersValidator.throwErrorIfUserNameIsNotExist(username);
    try {
      const challengesAndTheirRecommendPercent = await this.linkPredictionService.getLinkPredictionCalculationResult(user._id);
      const recommendedChallengesIds = this.linkPredictionHelper.getMostRecommendedChallenges(challengesAndTheirRecommendPercent);
      const recommendedChallenges = await this.challengesService.findChallengesByIds(recommendedChallengesIds);

      return recommendedChallenges.slice(page * size, (page + 1) * size);
    }
    catch (err) {
      const d = await this.challengesService.getComplementChallengesOfChallengesIds(user.acceptedChallenges);
      return d.slice(page * size, (page + 1) * size);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: 200,
    description: "Login success",
    type: [LoginUserDto],
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    await this.usersValidator.throwErrorIfUserNameIsNotExist(loginUserDto.username);
    return await this.usersService.login(loginUserDto);
  }

  @Post('/refresh')
  @ApiOkResponse({
    status: 200,
  })
  @ApiBearerAuth()
  async refresh(@Headers() headers) {
    return await this.authService.createAccessTokenFromRefreshToken(headers);
  }
}
