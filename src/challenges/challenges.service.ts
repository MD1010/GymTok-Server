import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Challenge, ChallengeDto } from "./challenge.model";
import { GenericDalService } from "../common/genericDalService.service";

@Injectable()
export class ChallengesService {
  public basicChallengesService: GenericDalService<Challenge, ChallengeDto>;
  constructor(
    @InjectModel(Challenge.name) private readonly challengesModel: Model<Challenge>
  ) {
    this.basicChallengesService = new GenericDalService<Challenge, ChallengeDto>(challengesModel);
  }

  async findAllChallenges() {
    return this.basicChallengesService.findAll();
  }

  async findChallengeById(challengeId: string) {
    return this.basicChallengesService.findById(challengeId);
  }

  async addChallenge(challenge: ChallengeDto) {
    return this.basicChallengesService.createEntity(challenge);
  }

  async findChallengesByIds(challengesIds: string[]) {
    return this.basicChallengesService.findByIds(challengesIds)
  }
}
