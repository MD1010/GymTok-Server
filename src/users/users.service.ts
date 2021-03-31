import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";
import { AuthService } from "../auth/auth.service";
import { GenericDalService } from "../common/genericDalService.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { User, UserDto } from "./user.model";

@Injectable()
export class UsersService {
  public basicUsersService: GenericDalService<User, UserDto>;
  constructor(@InjectModel(User.name) private readonly usersModel: Model<User>, private authService: AuthService) {
    this.basicUsersService = new GenericDalService<User, UserDto>(usersModel);
  }

  async findAllUsers(searchTerm: string) {
    return searchTerm
      ? this.usersModel.find({ username: new RegExp(searchTerm, "i") })
      : this.basicUsersService.findAll();
  }

  async addUser(user: UserDto) {
    return this.basicUsersService.createEntity(user);
  }

  async create(createUserDto: CreateUserDto) {
    await this.isUserNameUnique(createUserDto.username);

    const newUser = await this.createUserDto(createUserDto);
    const user = await this.basicUsersService.createEntity(newUser);

    return {
      user,
      accessToken: await this.authService.createAccessToken(user.id),
      refreshToken: await this.authService.createRefreshToken(user.id),
    };
  }

  async getUserByUserName(username: string) {
    const [result] = await this.basicUsersService.findWithFilter({ username });
    return result;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.getUserByUserName(loginUserDto.username);
    await this.authService.checkPassword(loginUserDto.password, user);
    return {
      user,
      accessToken: await this.authService.createAccessToken(user._id),
      refreshToken: await this.authService.createRefreshToken(user._id),
    };
  }

  private async createUserDto(createUserDto: CreateUserDto) {
    const newUser = new UserDto();
    newUser.username = createUserDto.username;
    newUser.fullName = createUserDto.fullName;
    newUser.acceptedChallenges = [];
    newUser.recommendedChallenges = [];
    newUser.image = "";
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(createUserDto.password, salt);

    return newUser;
  }

  private async isUserNameUnique(username: string) {
    const user = await this.usersModel.findOne({ username });
    if (user) {
      throw new BadRequestException("User name most be unique.");
    }
  }

  async findUsersByIds(usersIds: string[]) {
    return this.basicUsersService.findByIds(usersIds);
  }

  async findUserById(userId: string) {
    return this.basicUsersService.findById(userId);
  }

  async addAcceptChallengeToUsers(challengeId: string, usersIds: string[]) {
    return this.usersModel.updateMany(
      { _id: { $in: usersIds } },
      { $addToSet: { acceptedChallenges: challengeId }, $pull: { recommendedChallenges: challengeId } }
    );
  }

  async addRecommendChallengeToUsers(challengeId: string, usersIds: string[]) {
    return this.usersModel.updateMany(
      { _id: { $in: usersIds } },
      { $addToSet: { recommendedChallenges: challengeId } }
    );
  }
}
