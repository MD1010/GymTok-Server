import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.model";
import { UsersValidator } from "./users.validator";
import { AuthModule } from "../auth/auth.module";
import { LinkPredictionModule } from "../linkPrediction/linkPrediction.module";
import { UsersHelper } from "./users.helper.";
import { PostsModule } from "src/posts/posts.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    forwardRef(() => LinkPredictionModule),
    forwardRef(() => PostsModule)
  ],
  controllers: [UserController],
  providers: [UsersService, UsersValidator, UsersHelper],
  exports: [UsersService, UsersValidator, UsersHelper]
})
export class UserModule { }
