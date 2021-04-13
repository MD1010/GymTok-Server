import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HashtagsModule } from "src/Hashtag/hashtags.module";
import { FilesModule } from "../files/files.module";
import { LinkPredictionModule } from "../linkPrediction/linkPrediction.module";
import { RepliesModule } from "../Replies/replies.module";
import { UserModule } from "../users/user.module";
import { Challenge, ChallengeSchema } from "./challenge.model";
import { ChallengesController } from "./challenges.controller";
import { ChallengesService } from "./challenges.service";
import { ChallengesValidator } from "./challenges.validator";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
    forwardRef(() => UserModule),
    FilesModule,
    HashtagsModule,
    forwardRef(() => LinkPredictionModule),
    forwardRef(() => RepliesModule)
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService, ChallengesValidator],
  exports: [ChallengesValidator, ChallengesService]
})
export class ChallengesModule { }
