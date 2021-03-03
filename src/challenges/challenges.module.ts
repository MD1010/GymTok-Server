import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FilesModule } from "src/files/files.module";
import { LinkPredictionModule } from "src/linkPrediction/linkPrediction.module";
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
    forwardRef(() => LinkPredictionModule),
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService, ChallengesValidator],
  exports: [ChallengesValidator, ChallengesService]
})
export class ChallengesModule { }
