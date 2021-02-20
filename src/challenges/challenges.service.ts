import { Injectable } from "@nestjs/common";
import { Connection, Model } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Challenge, ChallengeDto } from "./challenge.model";
import { GenericDalService } from "../common/genericDalService.service";
import { MongoGridFS } from "mongo-gridfs";

@Injectable()
export class ChallengesService {
  private fileModel: MongoGridFS;
  public basicChallengesService: GenericDalService<Challenge, ChallengeDto>;
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengesModel: Model<Challenge>,
    @InjectConnection() private readonly connection: Connection
  ) {
    this.basicChallengesService = new GenericDalService<
      Challenge,
      ChallengeDto
    >(challengesModel);
    this.fileModel = new MongoGridFS(this.connection.db, "Challenges");
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
    return this.basicChallengesService.findByIds(challengesIds);
  }
  // async uploadChallenge(Challenge:ChallengeDto){
  //   this.fileModel.writeFileStream()
  // }
}
