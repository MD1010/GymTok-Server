import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Challenge, ChallengeSchema } from "./challenge.model";
import { ChallengesController } from "./challenges.controller";
import { ChallengesService } from "./challenges.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule { }
