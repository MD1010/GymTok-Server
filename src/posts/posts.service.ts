import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, Get } from "@nestjs/common";
import { FilterQuery, Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { GenericDalService } from "../common/genericDalService.service";
import { Post, PostDto } from "./posts.model";

@Injectable()
export class PostsService {
  public basicPostsService: GenericDalService<Post, PostDto>;
  constructor(@InjectModel(Post.name) private readonly postsModel: Model<Post>) {
    this.basicPostsService = new GenericDalService<Post, PostDto>(postsModel);
  }

  async findAllPosts() {
    return this.basicPostsService.findAll();
  }

  async findPostsByPaging(
    isReply: boolean,
    pageNumber?: number,
    pageSize?: number,
    createdBy?: string,
    currentMaxDate?: Date
  ) {
    console.log(`pageNumber: ${pageNumber} ", pageSize: ${pageSize} `);

    const data = createdBy
      ? this.postsModel.find({
          createdBy,
          // isReply: { $eq: isReply ? isReply : false },
          isReply: isReply ? { $eq: isReply } : { $exists: true, $ne: null },
          publishDate: { $gte: currentMaxDate ? currentMaxDate : new Date(null) },
        } as FilterQuery<Post>)
      : this.postsModel.find({
          // isReply: { $eq: isReply ? isReply : false },
          isReply: isReply ? { $eq: isReply } : { $exists: true, $ne: null },
          publishDate: { $gte: currentMaxDate ? currentMaxDate : new Date(null) },
        });

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

  async getPostsOfUserId(userId: string, isReply?: boolean) {
    let query = isReply ? { createdBy: userId, isReply } : { createdBy: userId };
    return this.postsModel.find(query as FilterQuery<Post>);
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

  async findPostsByHashtag(hashtagId: string) {
    let posts = [];
    const data = await this.postsModel
      .find({ hashtags: Types.ObjectId(hashtagId) } as FilterQuery<Post>)
      .limit(4)
      .sort({
        creationTime: "desc",
      });

    // for (let i = 0; i < data.length; i++) {
    //   const post = data[i];
    //   posts.push({
    //     _id: post.id,
    //     video: post.videoURI,
    //     numOfLikes: post.likes?.length,
    //     gif: post.gif,
    //     description: post.description,
    //   });
    // }

    return data;
  }
}
