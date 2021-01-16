import { Injectable, NotFoundException } from "@nestjs/common";
import { ChallengesService } from "./challenges.service";

@Injectable()
export class ChallengesValidator {
  constructor(private challengesService: ChallengesService) { }

  async throwErrorIfOneOfChallengesIdsIsNotExist(challengesIds: string[]) {
    for (const challengeId of challengesIds) {
      const challenge = await this.challengesService.findChallengeById(challengeId);
      if (!challenge) {
        throw new NotFoundException(`User id ${challengeId} is not exist`);
      }
    }
  }

  async throwErrorIfChallengeIdIsNotExist(challengeId: string) {
    const challenge = await this.challengesService.findChallengeById(challengeId);
    if (!challenge) {
      throw new NotFoundException(`The challenge id ${challengeId} is not exist`);
    }
  }
}
