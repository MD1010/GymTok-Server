import { Document } from 'mongoose';
import { User } from 'src/users/user.model';

export interface RefreshToken extends Document {
    userId: User;
    refreshToken: string;
    ip: string;
    browser: string;
    country: string;
}