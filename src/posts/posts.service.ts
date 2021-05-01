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

  async findPostsByPaging(pageNumber?: number, pageSize?: number, createdBy?: string) {
    const data = createdBy
      ? this.postsModel.find({ createdBy } as FilterQuery<Post>)
      : this.postsModel.find();
    return data
      .skip(pageSize * pageNumber)
      .limit(pageSize)
      .sort({
        creationTime: "desc",
      });
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

  async addReplyToPost(postId: string, replyId: string) {
    return this.postsModel.updateOne({ _id: postId }, { $push: { replies: Types.ObjectId(replyId) } });
  }

  async findPostsByIds(postsIds: string[]) {
    return this.basicPostsService.findByIds(postsIds);
  }

  async addHashtagsToPost(postId: string, hashtagsIds: Types.ObjectId[]) {
    return this.postsModel.updateOne({ _id: postId }, { $addToSet: { hashtags: { $each: hashtagsIds } } });
  }

  async removeLike(postId: string, userId: string) {
    return this.postsModel.updateOne({ _id: postId }, { $pull: { likes: Types.ObjectId(userId) } });
  }

  async getNotReplyPosts() {
    return this.postsModel.find({ isReply: false });
  }
}
