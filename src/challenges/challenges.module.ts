import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
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
    forwardRef(() => UserModule)
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService, ChallengesValidator],
  exports: [ChallengesValidator]
})
export class ChallengesModule { }
