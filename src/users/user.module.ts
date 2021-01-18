import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.model";
import { UsersValidator } from "./users.validator";
import { ChallengesModule } from "../challenges/challenges.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => ChallengesModule),
    AuthModule
  ],
  controllers: [UserController],
  providers: [UsersService, UsersValidator],
  exports: [UsersService, UsersValidator]
})
export class UserModule { }
