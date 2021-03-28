import { Injectable } from "@nestjs/common";
import { Connection, Model } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Challenge, ChallengeDto } from "./challenge.model";
import { GenericDalService } from "../common/genericDalService.service";

@Injectable()
export class ChallengesService {
  public basicChallengesService: GenericDalService<Challenge, ChallengeDto>;

  constructor(
    @InjectModel(Challenge.name)
    private readonly challengesModel: Model<Challenge>,

    @InjectConnection() private readonly connection: Connection
  ) {
    this.basicChallengesService = new GenericDalService<Challenge, ChallengeDto>(challengesModel);
  }

  async findAllChallenges(pageNumber?: number, pageSize?: number, userId?: string) {
    const data = userId ? this.challengesModel.find({ createdBy: userId } as any) : this.challengesModel.find();
    return data
      .skip(pageSize * pageNumber)
      .limit(pageSize)
      .sort({
        creationTime: "desc",
      });
  }

  async findChallengeById(challengeId: string) {
    return this.basicChallengesService.findById(challengeId);
  }

  async addChallenge(challenge: ChallengeDto) {
    return this.basicChallengesService.createEntity(challenge);
  }

  async findChallengesByIds(challengesIds: string[]) {
    return this.basicChallengesService.findByIds(challengesIds);
  }

  createChallengeObject(challengeFields: any, videoLocation: string): ChallengeDto {
    const userId = challengeFields.userId;
    const description = challengeFields.description;
    const parsedSelectedFriends = JSON.parse(challengeFields.selectedFriends);
    const selectedFriends = parsedSelectedFriends.map((f) => f._id);
    return {
      createdBy: userId,
      description,
      selectedFriends,
      video: videoLocation,
    };
  }

  async getComplementChallengesOfChallengesIds(challengesIds: string[]) {
    return this.challengesModel.where("_id").nin(challengesIds).exec();
  }
}
