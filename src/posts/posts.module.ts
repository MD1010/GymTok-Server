import { forwardRef, Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "./posts.model";
import { FilesModule } from "../files/files.module";
import { RepliesParser } from "./posts.parser";
import { ChallengesModule } from "../challenges/challenges.module";
import { UserModule } from "../users/user.module";
import { LinkPredictionModule } from "../linkPrediction/linkPrediction.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), FilesModule,
    //  forwardRef(() => LinkPredictionModule)
  ],
  controllers: [PostsController],
  providers: [PostsService, RepliesParser],
  exports: [PostsService]
})
export class PostsModule { }
