import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./user.model";
import { GenericService } from "../common/genericService";
import { AuthService } from "../auth/auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { v4 } from 'uuid';
import { addHours } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()
export class UsersService extends GenericService<User> {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>,
    private authService: AuthService
  ) {
    super(usersModel);
  }

  HOURS_TO_VERIFY = 4;
  HOURS_TO_BLOCK = 6;

  async findAllUsers() {
    return this.findAll();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // const user = new this.usersModel(createUserDto);
    try {
      await this.isUserNameUnique(createUserDto.username);

      const newUser = new this.usersModel({
        username: createUserDto.username,
        fullName: createUserDto.fullName,
        acceptedChallenges: [],
        recommendedChallenges: [],
        image: "",
        password: ""
      })
    
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(createUserDto.password, salt);

      this.setRegistrationInfo(newUser);
      await this.add(newUser);
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
    return this.usersModel.findOne({ username });
  }

  async findUsersByIds(usersIds: string[]) {
    return this.findByIds(usersIds);
  }

  async addAcceptChallengeToUsers(challengeId: string, usersIds: string[]) {
    return this.usersModel.updateMany({ _id: { $in: usersIds } }, { $addToSet: { acceptedChallenges: challengeId } });
  }

  async addRecommendChallengeToUsers(challengeId: string, usersIds: string[]) {
    return this.usersModel.updateMany({ _id: { $in: usersIds } }, { $addToSet: { recommendedChallenges: challengeId } });
  }
}
