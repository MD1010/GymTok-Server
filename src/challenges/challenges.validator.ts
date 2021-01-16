import { Injectable, NotFoundException } from "@nestjs/common";
import { BasicValidator } from "src/common/basic.validator";
import { Challenge } from "./challenge.model";
import { ChallengesService } from "./challenges.service";

@Injectable()
export class ChallengesValidator extends BasicValidator<Challenge> {
  constructor(private challengesService: ChallengesService) {
    super(challengesService);
  }
}
