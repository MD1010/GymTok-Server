import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Challenge } from "./challenge.model";
import { GenericDalService } from "src/common/genericDalService.service";

@Injectable()
export class ChallengesService {
  public basicChallengesService: GenericDalService<Challenge>;
  constructor(
    @InjectModel(Challenge.name) private readonly challengesModel: Model<Challenge>
  ) {
    this.basicChallengesService = new GenericDalService<Challenge>(challengesModel);
  }

  async findAllChallenges() {
    return this.basicChallengesService.findAll();
  }

  async findChallengeById(challengeId: string) {
    return this.basicChallengesService.findById(challengeId);
  }

  async addChallenge(challenge: Challenge) {
    return this.basicChallengesService.addEntity(challenge);
  }

  async findChallengesByIds(challengesIds: string[]) {
    return this.basicChallengesService.findByIds(challengesIds)
  }
}
