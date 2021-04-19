import { Injectable } from "@nestjs/common";
import { Connection, FilterQuery, Model, Types } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Challenge, ChallengeDto } from "./challenge.model";
import { GenericDalService } from "../common/genericDalService.service";
import { User } from "../users/user.model";
import { HashtagsService } from "src/Hashtag/hashtags.service";

@Injectable()
export class ChallengesService {
  public basicChallengesService: GenericDalService<Challenge, ChallengeDto>;

  constructor(
    @InjectModel(Challenge.name)
    private readonly challengesModel: Model<Challenge>,
    private hashtagsService: HashtagsService,

    @InjectConnection() private readonly connection: Connection
  ) {
    this.basicChallengesService = new GenericDalService<Challenge, ChallengeDto>(challengesModel);
  }

  async findAllChallenges(pageNumber?: number, pageSize?: number, createdBy?: string) {
    const data = createdBy
      ? this.challengesModel.find({ createdBy } as FilterQuery<Challenge>)
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

  async createChallengeObject(challengeFields: any, videoLocation: string): Promise<ChallengeDto> {
    const userId = challengeFields.userId;
    const description = challengeFields.description !== "undefined" ? challengeFields.description : null;
    const parsedSelectedFriends =
      challengeFields.selectedFriends !== "undefined" ? JSON.parse(challengeFields.selectedFriends) : [];
    const selectedFriends = parsedSelectedFriends.map((f) => f._id);
    const hashtags = challengeFields.hashtags !== "undefined" ? JSON.parse(challengeFields.hashtags) : [];
    const hashtagsIds = await this.hashtagsService.getOrCreateHashtags(hashtags);
    return {
      createdBy: userId,
      description,
      selectedFriends,
      video: videoLocation,
      hashtags: hashtagsIds,
    };
  }

  async addLike(challengeId: string, userId: string) {
    return this.challengesModel.updateOne({ _id: challengeId }, { $push: { likes: Types.ObjectId(userId) } });
  }

  async removeLike(challengeId: string, userId: string) {
    return this.challengesModel.updateOne({ _id: challengeId }, { $pull: { likes: Types.ObjectId(userId) } });
  }

  async getComplementChallengesOfChallengesIds(challengesIds: string[]) {
    return this.challengesModel.where("_id").nin(challengesIds).exec();
  }
}
