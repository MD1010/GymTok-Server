import { JwtService } from "@nestjs/jwt";
import { User } from "../users/user.model";
import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { RefreshToken } from './interfaces/refresh-token.interface';
import { InjectModel } from '@nestjs/mongoose';
import * as Cryptr from 'cryptr';
const bcrypt = require('bcrypt');
import { v4 } from 'uuid';

@Injectable()
export class AuthService {

    cryptr: any;

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('RefreshToken') private readonly refreshTokenModel: Model<RefreshToken>,
        private readonly jwtService : JwtService
    ){
        this.cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
    }

    async createAccessToken(userId: string) {
        const accessToken = sign({userId}, process.env.JWT_SECRET , { expiresIn: process.env.JWT_EXPIRATION });
        return this.encryptText(accessToken);
    }

    encryptText(text: string): string {
        return this.cryptr.encrypt(text);
    }

    async createRefreshToken(req: Request, userId) {
        const refreshToken = new this.refreshTokenModel({
          userId,
          refreshToken: v4()
        });
        
        await refreshToken.save();
        return refreshToken.refreshToken;
    }
    
    async findRefreshToken(token: string) {
        const refreshToken = await this.refreshTokenModel.findOne({refreshToken: token});
        if (!refreshToken) {
            throw new UnauthorizedException('User has been logged out.');
        }
        return refreshToken.userId;
    }
    
    async validateUser(jwtPayload: JwtPayload): Promise<any> {
        const user = await this.userModel.findOne({_id: jwtPayload.userId, verified: true});
        if (!user) {
            throw new UnauthorizedException('User not found.');
        }
        return user;
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

}