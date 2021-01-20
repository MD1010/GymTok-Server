import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { AuthService } from "../auth/auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { v4 } from 'uuid';
import { addHours } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from "./dto/login-user.dto";
import { User, UserDto } from "./user.model";
import { GenericDalService } from "../common/genericDalService.service";

@Injectable()
export class UsersService {
  public basicUsersService: GenericDalService<User, UserDto>;
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>,
    private authService: AuthService
  ) {
    this.basicUsersService = new GenericDalService<User, UserDto>(usersModel);
  }

  HOURS_TO_VERIFY = 4;
  HOURS_TO_BLOCK = 6;

  async findAllUsers() {
    return this.basicUsersService.findAll();
  }

  async addUser(user: UserDto) {
    return this.basicUsersService.createEntity(user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      await this.isUserNameUnique(createUserDto.username);

      const newUser = new UserDto();
      newUser.username = createUserDto.username;
      newUser.fullName = createUserDto.fullName;
      newUser.acceptedChallenges = [];
      newUser.recommendedChallenges = [];
      newUser.image = "";
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(createUserDto.password, salt);

      this.setRegistrationInfo(newUser);
      await this.basicUsersService.createEntity(newUser);
      return this.buildRegistrationInfo(newUser);

    } catch(err) {
      console.log(err);
    }   
  }

  private buildRegistrationInfo(user): any {
    const userRegistrationInfo = {
        username: user.username,
        fullName: user.fullName
    };
    return userRegistrationInfo;
  }

  private setRegistrationInfo(user): any {
    user.verification = v4();
    user.verificationExpires = addHours(new Date(), this.HOURS_TO_VERIFY);
  }

  private async isUserNameUnique(username: string) {
    const user = await this.usersModel.findOne({username});
    if (user) {
        throw new BadRequestException('User name most be unique.');
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.getUserByUserName(loginUserDto.username);
      await this.checkPassword(loginUserDto.password, user);
      return {
          username: user.username,
          fullname: user.fullName,
          accessToken: await this.authService.createAccessToken(user._id),
          // refreshToken: await this.authService.createRefreshToken(req, user._id),
      };
    } catch (err) {
      console.log(err);
    }
  }

  private async checkPassword(attemptPass: string, user) {
    const match = await bcrypt.compare(attemptPass, user.password);
    if (!match) {
        throw new NotFoundException('Wrong email or password.');
    }
    return match;
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
