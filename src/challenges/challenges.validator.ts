import { Injectable } from "@nestjs/common";
import { GenericValidator } from "src/common/generic.validator";
import { Challenge, ChallengeDto } from "./challenge.model";
import { ChallengesService } from "./challenges.service";

@Injectable()
export class ChallengesValidator extends GenericValidator<Challenge, ChallengeDto> {
  constructor(private challengesService: ChallengesService) {
    super(challengesService.basicChallengesService);
  }
}
