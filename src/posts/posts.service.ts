import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, Get } from '@nestjs/common';
import { FilterQuery, Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { GenericDalService } from "../common/genericDalService.service";
import { Post, PostDto } from './posts.model';

@Injectable()
export class PostsService {
  public basicPostsService: GenericDalService<Post, PostDto>;
  constructor(
    @InjectModel(Post.name) private readonly postsModel: Model<Post>,
  ) {
    this.basicPostsService = new GenericDalService<Post, PostDto>(postsModel);
  }

  async findAllPosts() {
    return this.basicPostsService.findAll();
  }

  async getPostById(postId: string) {
    return this.basicPostsService.findById(postId);
  }

  async getPostsOfUserId(userId: string) {
    return this.postsModel.find({ createdBy: userId } as FilterQuery<Post>);
  }

  async getPostsByIds(postsId: string[]) {
    return this.postsModel.find({ _id: { $in: postsId } } as FilterQuery<Post>);
  }

  async addLike(postId: string, userId: string) {
    return this.postsModel.updateOne({ _id: postId }, { $push: { likes: Types.ObjectId(userId) } });
  }

  async removeLike(postId: string, userId: string) {
    return this.postsModel.updateOne({ _id: postId }, { $pull: { likes: Types.ObjectId(userId) } });
  }

  // async findAllRepliesOfChallengeId(challengeId: string) {
  //   return this.postsModel.where({ challengeId });
  // }

  // async getRepliesOfUserId(userId: string) {
  //   return this.postsModel.find({ replierId: userId } as FilterQuery<Post>);
  // }
}
