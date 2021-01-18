import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.model";
import { UsersValidator } from "./users.validator";
import { ChallengesModule } from "src/challenges/challenges.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => ChallengesModule)],
  controllers: [UserController],
  providers: [UsersService, UsersValidator],
  exports: [UsersService, UsersValidator]
})
export class UserModule { }
