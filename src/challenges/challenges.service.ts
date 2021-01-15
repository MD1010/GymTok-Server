import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Challenge } from "./challenge.model";

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly ChallengesModel: Model<Challenge>
  ) {}

  async findAll() {
    return await this.ChallengesModel.find();
  }
}
