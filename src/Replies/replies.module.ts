import { forwardRef, Module } from "@nestjs/common";
import { RepliesService } from "./replies.service";
import { RepliesController } from "./replies.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Reply, ReplySchema } from "./replies.model";
import { FilesModule } from "src/files/files.module";
import { RepliesParser } from "./replies.parser";
import { ChallengesModule } from "src/challenges/challenges.module";
import { UserModule } from "src/users/user.module";
import { LinkPredictionModule } from "src/linkPrediction/linkPrediction.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reply.name, schema: ReplySchema }]), FilesModule,
    forwardRef(() => ChallengesModule), forwardRef(() => UserModule), forwardRef(() => LinkPredictionModule)
  ],
  controllers: [RepliesController],
  providers: [RepliesService, RepliesParser],
  exports: [RepliesService]
})
export class RepliesModule { }
