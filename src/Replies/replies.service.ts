import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, Get } from '@nestjs/common';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { GenericDalService } from "../common/genericDalService.service";
import { Reply, ReplyDto } from './replies.model';

@Injectable()
export class RepliesService {
  public basicRepliesService: GenericDalService<Reply, ReplyDto>;
  constructor(
    @InjectModel(Reply.name) private readonly repliesModel: Model<Reply>,
  ) {
    this.basicRepliesService = new GenericDalService<Reply, ReplyDto>(repliesModel);
  }

  async findAllReplies() {
    return this.basicRepliesService.findAll();
  }

  async findAllRepliesOfChallengeId(challengeId: string) {
    return this.repliesModel.where({ challengeId });
  }
}
