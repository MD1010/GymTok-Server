import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import v4 from 'uuid';
import { addHours } from 'date-fns';
import * as Cryptr from 'cryptr';
const bcrypt = require('bcrypt');


@Injectable()
export class AuthService {

    cryptr: any;

    constructor(
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

    private jwtExtractor(request) {
        let token = null;
        if (request.header('x-token')) {
        token = request.get('x-token');
      } else if (request.headers.authorization) {
        token = request.headers.authorization.replace('Bearer ', '').replace(' ', '');
      } else if (request.body.token) {
        token = request.body.token.replace(' ', '');
      }
        if (request.query.token) {
        token = request.body.token.replace(' ', '');
      }
        const cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
        if (token) {
          try {
            token = cryptr.decrypt(token);
          } catch (err) {
            throw new BadRequestException('Bad request.');
          }
      }
        return token;
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
  
    public setRegistrationInfo(user): any {
      user.verification = v4();
      user.verificationExpires = addHours(new Date(), Number(process.env.HOURS_TO_VERIFY));
    }
  
    public async checkPassword(attemptPass: string, user) {
      const match = await bcrypt.compare(attemptPass, user.password);
      if (!match) {
          throw new NotFoundException('Wrong email or password.');
      }
      return match;
    }

}