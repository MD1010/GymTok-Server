import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/user.model';
import { Model } from 'mongoose';
const bcrypt = require('bcrypt');



@Injectable()
export class AuthService {

    constructor(
      private readonly jwtService: JwtService,
      @InjectModel(User.name) private readonly usersModel: Model<User>,
    ){
    }

    async createAccessToken(userId: string) {
        const accessToken = sign({userId}, process.env.JWT_SECRET , { expiresIn: process.env.JWT_EXPIRATION });
        return accessToken;
    }

    async createRefreshToken(userId: string) {
      const refreshToken = sign({userId}, process.env.JWT_SECRET , { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
      return refreshToken;
  }


    public async createAccessTokenFromRefreshToken (headers) {
      let token = headers.authorization?.split(' ')[1];
      if (!token) {
        throw new BadRequestException('Bad request.');
      }

      try {
        const user = this.jwtService.verify(token, {secret: process.env.JWT_SECRET});
        return {
          accessToken: await this.createAccessToken(user.userId),
          username: user.username
        }
      } catch (err) {
        throw new BadRequestException('Bad request.');
      }
    }

    public async validateUser(userId: string) {
      return await this.usersModel.findById(userId); 
    }

    public async validateUserByName(username: string) {
      return await this.usersModel.findOne({username}); 
    }

    public async checkPassword(attemptPass: string, user) {
      const match = await bcrypt.compare(attemptPass, user.password);
      if (!match) {
          throw new NotFoundException('Wrong email or password.');
      }
      return match;
    }

}