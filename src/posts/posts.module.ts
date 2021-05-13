import { forwardRef, Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "./posts.model";
import { FilesModule } from "../files/files.module";
import { PostsParser } from "./posts.parser";
import { PostsValidator } from "./posts.validator";
import { LinkPredictionModule } from "../linkPrediction/linkPrediction.module";
import { UserModule } from "src/users/user.module";
import { HashtagsModule } from "src/Hashtag/hashtags.module";
import { PostsHelper } from "./posts.helper.";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), FilesModule,
    forwardRef(() => HashtagsModule),
    forwardRef(() => UserModule),
    forwardRef(() => LinkPredictionModule)
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsParser, PostsValidator, PostsHelper],
  exports: [PostsService, PostsValidator, PostsHelper]
})
export class PostsModule { }
