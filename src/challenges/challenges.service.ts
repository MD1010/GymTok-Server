import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Challenge, ChallengeDto } from "./challenge.model";

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengesModel: Model<Challenge>
  ) { }

  async findAll() {
    return this.challengesModel.find();
  }

  async findById(challengeId: string) {
    return this.challengesModel.findById(challengeId);
  }

  async addChallenge(challenge: ChallengeDto) {
    const createdChallenge = new this.challengesModel(challenge);

    return createdChallenge.save();
  }

  async findChallengesByIds(challengesIds: string[]) {
    return this.challengesModel.find({ _id: { $in: challengesIds } })
  }
}
