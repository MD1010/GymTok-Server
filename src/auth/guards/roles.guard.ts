import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor() {
    super();
  }

  handleRequest(err, user, info: Error, context: ExecutionContext) {

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}