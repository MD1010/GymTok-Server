import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Challenge } from "./challenge.model";
import { BasicService } from "src/common/basic.service";

@Injectable()
export class ChallengesService extends BasicService<Challenge> {
  constructor(
    @InjectModel(Challenge.name) private readonly challengesModel: Model<Challenge>
  ) {
    super(challengesModel);
  }

  async findAllChallenges() {
    return this.findAll();
  }

  async findChallengeById(challengeId: string) {
    return this.findById(challengeId);
  }

  async addChallenge(challenge: Challenge) {
    return this.add(challenge);
  }

  async findChallengesByIds(challengesIds: string[]) {
    return this.findByIds(challengesIds)
  }
}
