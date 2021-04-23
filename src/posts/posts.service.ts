import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, Get } from '@nestjs/common';
import { FilterQuery, Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { GenericDalService } from "../common/genericDalService.service";
import { Post, PostDto } from './posts.model';

@Injectable()
export class PostsService {
  public basicRepliesService: GenericDalService<Post, PostDto>;
  constructor(
    @InjectModel(Post.name) private readonly postsModel: Model<Post>,
  ) {
    this.basicRepliesService = new GenericDalService<Post, PostDto>(postsModel);
  }

  async findAllPosts() {
    return this.basicRepliesService.findAll();
  }

  // async findAllRepliesOfChallengeId(challengeId: string) {
  //   return this.postsModel.where({ challengeId });
  // }

  // async getRepliesOfUserId(userId: string) {
  //   return this.postsModel.find({ replierId: userId } as FilterQuery<Post>);
  // }
}
