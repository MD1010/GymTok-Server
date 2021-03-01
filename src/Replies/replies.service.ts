import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, Get } from '@nestjs/common';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { GenericDalService } from "../common/genericDalService.service";
import { Reply, ReplyDto } from './replies.model';

@Injectable()
export class RepliesService {
  public basicUsersService: GenericDalService<Reply, ReplyDto>;
  constructor(
    @InjectModel(Reply.name) private readonly usersModel: Model<Reply>,
  ) {
    this.basicUsersService = new GenericDalService<Reply, ReplyDto>(usersModel);
  }

  @Get()
  async findAllReplies() {
    return this.basicUsersService.findAll();
  }
}
