import { Injectable, NotFoundException } from "@nestjs/common";
import { ChallengesService } from "./challenges.service";

@Injectable()
export class ChallengesValidator {
  constructor(private challengesService: ChallengesService) { }

  async throwErrorIfOneOfChallengesIdsIsNotExist(challengesIds: string[]) {
    const challenges = await this.challengesService.findChallengesByIds(challengesIds);
    if (challenges.length !== challengesIds.length) {
      throw new NotFoundException(`At least one of the challenges ${JSON.stringify(challengesIds)} is not exist`);
    }
  }

  async throwErrorIfChallengeIdIsNotExist(challengeId: string) {
    const challenge = await this.challengesService.findById(challengeId);
    if (!challenge) {
      throw new NotFoundException(`The challenge id ${challengeId} is not exist`);
    }
  }
}
