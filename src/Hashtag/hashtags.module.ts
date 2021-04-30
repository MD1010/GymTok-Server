import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Hashtag, HashtagSchema } from "./hashtags.model";
import { HashtagsController } from "./hashtags.controller";
import { HashtagsService } from "./hashtags.service";
import { HashtagsHelper } from "./hashtags.helper";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hashtag.name, schema: HashtagSchema }]),
  ],
  controllers: [HashtagsController],
  providers: [HashtagsService, HashtagsHelper],
  exports: [HashtagsService, HashtagsHelper]
})
export class HashtagsModule { }
