import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Challenge, ChallengeDto } from "./challenge.model";
import { GenericService } from "../common/genericService";

@Injectable()
export class ChallengesService extends GenericService<Challenge> {
  constructor(
    @InjectModel(Challenge.name) private readonly challengesModel: Model<Challenge>
  ) {
    super(challengesModel);
  }

  async findAllChallenges() {
    return this.findAll();
  }

  async findById(challengeId: string) {
    return this.findById(challengeId);
  }

  async addChallenge(challenge: ChallengeDto) {
    return this.add(challenge);
  }

  async findChallengesByIds(challengesIds: string[]) {
    return this.findByIds(challengesIds)
  }
}
