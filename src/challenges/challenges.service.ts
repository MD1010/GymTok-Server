import { Injectable } from "@nestjs/common";
import { Connection, FilterQuery, Model } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Challenge, ChallengeDto } from "./challenge.model";
import { GenericDalService } from "../common/genericDalService.service";
import { User } from "../users/user.model";

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
    const data = userId
      ? this.challengesModel.find({ createdBy: userId } as FilterQuery<Challenge>)
      : this.challengesModel.find();
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
    const hashtags = challengeFields.hashtags !== 'undefined' ? JSON.parse(challengeFields.hashtags) : [];
    return {
      createdBy: userId,
      description,
      selectedFriends,
      video: videoLocation,
      hashtags,
    };
  }

  async getComplementChallengesOfChallengesIds(challengesIds: string[]) {
    return this.challengesModel.where("_id").nin(challengesIds).exec();
  }

  async findAllHashtags(searchTerm: string, excludedIds: string[]) {

    excludedIds = excludedIds ? excludedIds : [];
    
    const results = await this.challengesModel.aggregate([
      {
          "$group": {
              "_id": 0,
              "hashtags": { "$push": "$hashtags" },
          }
      },
      {
          "$project": {
              "hashtags": {
                  "$reduce": {
                      "input": "$hashtags",
                      "initialValue": [],
                      "in": { "$setUnion": ["$$value", "$$this"] },
                  }
              }
          }
      }
    ]);

    let hashtags = results[0].hashtags;

    if(searchTerm) {
      hashtags = hashtags.filter(
        function(e) {
          return this.indexOf(e) < 0;
        },
        excludedIds
      ).filter(tag => tag.match(new RegExp(searchTerm, "i")));
    }
    
    return {hashtags};
  }
}
