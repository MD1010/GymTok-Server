import { forwardRef, HttpModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PostsModule } from "src/posts/posts.module";
import { ChallengesModule } from "../challenges/challenges.module";
import { RepliesModule } from "../Replies/replies.module";
import { UserModule } from "../users/user.module";
import { LinkPredictionController } from "./linkPrediction.controller";
import { LinkPredictionHelper } from "./linkPrediction.helper";
import { LinkPredictionParser } from "./linkPrediction.parser";
import { LinkPredictionService } from "./linkPrediction.service";

@Module({
  imports: [ConfigModule, HttpModule, forwardRef(() => UserModule), forwardRef(() => ChallengesModule), forwardRef(() => RepliesModule),
    forwardRef(() => PostsModule)
  ],
  controllers: [LinkPredictionController],
  providers: [LinkPredictionService, LinkPredictionParser, LinkPredictionHelper, LinkPredictionController],
  exports: [LinkPredictionService, LinkPredictionHelper, LinkPredictionController]
})
export class LinkPredictionModule { }
