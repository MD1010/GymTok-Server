import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ChallengeDocument, Challenge } from "./challenge.model";

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengesModel: Model<ChallengeDocument>
  ) { }

  async findAll() {
    return this.challengesModel.find();
  }

  async addChallenge(challenge: Challenge) {
    const createdChallenge = new this.challengesModel(challenge);

    return createdChallenge.save();
  }
}
