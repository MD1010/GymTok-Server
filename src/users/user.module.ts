import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.model";
import { UsersValidator } from "./users.validator";
import { ChallengesModule } from "../challenges/challenges.module";
import { AuthModule } from "../auth/auth.module";
import { LinkPredictionModule } from "../linkPrediction/linkPrediction.module";
import { UsersHelper } from "./users.helper.";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => ChallengesModule),
    AuthModule,
    forwardRef(() => LinkPredictionModule)
  ],
  controllers: [UserController],
  providers: [UsersService, UsersValidator, UsersHelper],
  exports: [UsersService, UsersValidator, UsersHelper]
})
export class UserModule { }
