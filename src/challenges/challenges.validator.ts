import { Injectable } from "@nestjs/common";
import { GenericValidator } from "src/common/generic.validator";
import { Challenge } from "./challenge.model";
import { ChallengesService } from "./challenges.service";

@Injectable()
export class ChallengesValidator extends GenericValidator<Challenge> {
  constructor(private challengesService: ChallengesService) {
    super(challengesService);
  }
}
