import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Hashtag, HashtagSchema } from "./hashtags.model";
import { HashtagsController } from "./hashtags.controller";
import { HashtagsService } from "./hashtags.service";
import { HashtagsHelper } from "./hashtags.helper";
import { PostsModule } from "src/posts/posts.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hashtag.name, schema: HashtagSchema }]),
    forwardRef(() => PostsModule)
  ],
  controllers: [HashtagsController],
  providers: [HashtagsService, HashtagsHelper],
  exports: [HashtagsService, HashtagsHelper]
})
export class HashtagsModule { }
