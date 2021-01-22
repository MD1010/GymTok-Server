import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import v4 from 'uuid';
import { addHours } from 'date-fns';
import * as Cryptr from 'cryptr';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/user.model';
import { Model } from 'mongoose';
const bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken';


@Injectable()
export class AuthService {

    cryptr: any;

    constructor(
      @InjectModel(User.name) private readonly usersModel: Model<User>,
    ){
        this.cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
    }

    async createAccessToken(userId: string) {
        const accessToken = sign({userId}, process.env.JWT_SECRET , { expiresIn: process.env.JWT_EXPIRATION });
        return this.encryptText(accessToken);
    }

    async createRefreshToken(userId: string) {
      const accessToken = sign({userId}, process.env.JWT_SECRET , { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
      return this.encryptText(accessToken);
  }

    encryptText(text: string): string {
        return this.cryptr.encrypt(text);
    }

    private jwtExtractor(headers) {
        let token = null;
        if (headers.headers.authorization.split(' ')[1]) {
          token = headers.headers.authorization.split(' ')[1];;
        }

        const cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
        if (token) {
          try {
            token = cryptr.decrypt(token);
          } catch (err) {
            throw new BadRequestException('Token has expired');
          }
      }
        return token;
    }

    public async createAccessTokenFromRefreshToken (headers, body) {
      let token = headers.authorization.split(' ')[1];
      if (!token) {
        throw new BadRequestException('Bad request.');
      }

      try {
        const cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
        token = cryptr.decrypt(token);
      } catch (err) {
        throw new BadRequestException('Bad request.');
      }

      try{
        const user = await this.validateUserByName(body.username); 
        return {
          accessToken: await this.createAccessToken(user.id),
          username: user.username
        }
      } catch(err) {
        console.log(err);
        throw new BadRequestException('Bad request.');
      }


    }

    public async validateUser(userId: string) {
      return await this.usersModel.findById(userId); 
    }

    public async validateUserByName(username: string) {
      return await this.usersModel.findOne({username}); 
    }
    
    returnJwtExtractor() {
        return this.jwtExtractor;
    }

    public buildRegistrationInfo(user): any {
      const userRegistrationInfo = {
          username: user.username,
          fullName: user.fullName
      };
      return userRegistrationInfo;
    }
  
    public async checkPassword(attemptPass: string, user) {
      const match = await bcrypt.compare(attemptPass, user.password);
      if (!match) {
          throw new NotFoundException('Wrong email or password.');
      }
      return match;
    }

}