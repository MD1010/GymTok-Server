import { Body, Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express/multer";
import { ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { HashtagsHelper } from "src/Hashtag/hashtags.helper";
import { HashtagsService } from "src/Hashtag/hashtags.service";
import { UsersHelper } from "src/users/users.helper.";
import { FilesService } from "../files/files.service";
import { LinkPredictionController } from "../linkPrediction/linkPrediction.controller";
import { UsersValidator } from "../users/users.validator";
import { PostsHelper } from "./posts.helper.";
import { PostDto } from "./posts.model";
import { PostsParser } from "./posts.parser";
import { PostsService } from "./posts.service";
import { PostsValidator } from "./posts.validator";
import * as _ from "lodash";
import { Types } from "mongoose";

@Controller("posts")
@ApiTags("Posts")
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsParser: PostsParser,
    private usersValidator: UsersValidator,
    private usersHelper: UsersHelper,
    private hashtagsHelper: HashtagsHelper,
    private postsValidator: PostsValidator,
    private filesService: FilesService,
    private hashtagsService: HashtagsService,
    private linkPredictionController: LinkPredictionController,
    private postsHelper: PostsHelper
  ) {}

  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Get all posts",
    type: [PostDto],
  })
  @ApiQuery({ name: "page", type: Number, required: false })
  @ApiQuery({ name: "size", type: Number, required: false })
  @ApiQuery({ name: "uid", type: String, required: false })
  @ApiQuery({ name: "isReply", type: Boolean, required: true })
  @ApiQuery({ name: "currentMaxDate", type: Date, required: false })
  async getAllPosts(
    @Query("isReply") isReply,
    @Query("page") page,
    @Query("size") size,
    @Query("uid") userId,
    @Query("currentMaxDate") currentMaxDate
  ) {
    const posts = await this.postsService.findPostsByPaging(isReply, +page, +size, userId, currentMaxDate);
    if (posts.length > 0) {
      await this.postsHelper.addParamsToPosts(posts);
    }

    return posts;
  }

  @Get(":postId")
  @ApiOkResponse({
    status: 200,
    description: "Get post by id",
    type: PostDto,
  })
  async getPostById(@Param("postId") postId: string) {
    return this.postsService.getPostById(postId);
  }

  @Get(":postId/replies")
  @ApiOkResponse({
    status: 200,
    description: "Get replies of post id",
    type: [PostDto],
  })
  async getRepliesOfPostId(@Param("postId") postId: string) {
    const post = await this.postsService.getPostById(postId);

    const posts = await this.postsService.getPostsByIds(post.replies.map((reply) => reply.toString()));
    await this.postsHelper.addParamsToPosts(posts);

    return posts;
  }

  @Post("/upload")
  // @ApiConsumes("multipart/form-data")
  @ApiCreatedResponse({
    description: "Adds new post",
    type: PostDto,
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "description" },
      { name: "createdBy" },
      { name: "video" },
      { name: "taggedUsers" },
      { name: "likes" },
      { name: "hashtags" },
    ])
  )
  async addPost(@UploadedFiles() filesToUpload, @Body() formDataFields: any) {
    try {
      const returnedPost = await this.validateAndAddNewPost(filesToUpload, formDataFields, false);

      setTimeout(() => {
        this.linkPredictionController.initModelTraining();
      }, 0);
      return returnedPost;
    } catch (error) {
      console.log(error);
    }
  }

  @Post(":postId/reply/upload")
  // @ApiConsumes("multipart/form-data")
  @ApiCreatedResponse({
    description: "Adds new post",
    type: PostDto,
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: "description" }, { name: "createdBy" }, { name: "video" }]))
  async addReplyToPost(@Param("postId") postId: string, @UploadedFiles() filesToUpload, @Body() formDataFields: any) {
    try {
      await this.postsValidator.getOrThrowErrorIfIdIsNotNotExist(postId);
      const returnedPost = await this.validateAndAddNewPost(filesToUpload, formDataFields, true);
      await this.postsService.addReplyToPost(postId, returnedPost._id);

      setTimeout(() => {
        this.linkPredictionController.initModelTraining();
      }, 0);
      return returnedPost;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post(":postId/hashtags")
  @ApiOkResponse({
    status: 200,
    description: "Add hashtag to post",
    type: [PostDto],
  })
  async addHashtagToPost(@Param("postId") postId: string, @Body() hashtags: string[]) {
    const post = await this.postsValidator.getOrThrowErrorIfIdIsNotNotExist(postId);
    const hashtagsIds = await this.hashtagsService.getOrCreateHashtags(hashtags);
    await this.postsService.addHashtagsToPost(
      postId,
      hashtagsIds.map((hashtagId) => Types.ObjectId(hashtagId))
    );
    post.hashtags = _.uniq([...post.hashtags, ...hashtagsIds].map((hashtagId) => hashtagId.toString()));
    return post;
  }

  private async validateAndAddNewPost(filesToUpload: any, formDataFields: any, isReply: boolean) {
    const parsedPost = this.postsParser.parsePostFileDataToPost(formDataFields, isReply);
    console.log("posted", parsedPost);

    await this.usersValidator.getOrThrowErrorIfIdIsNotNotExist(parsedPost.createdBy);
    await this.usersValidator.getOrThrowErrorIfOneOfEntityIdsIsNotExist(parsedPost.likes);
    await this.usersValidator.getOrThrowErrorIfOneOfEntityIdsIsNotExist(parsedPost.taggedUsers);
    parsedPost.hashtags = await this.hashtagsService.getOrCreateHashtags(parsedPost.hashtags);

    const locations = await this.filesService.uploadFile(filesToUpload.video[0].buffer);
    this.postsParser.addFilesFieldsToPost(parsedPost, locations);
    return await this.postsService.basicPostsService.createEntity(parsedPost);
  }

  @Get("hashtag/:hashtagId")
  @ApiOkResponse({
    status: 200,
    description: "Get challenges by given hashtag",
  })
  async getChallengesByHashtag(@Param("hashtagId") hashtagId: string) {
    const challenges = await this.postsService.findPostsByHashtag(hashtagId);
    await this.usersHelper.addCreatedUserToPosts(challenges);
    return challenges;
  }
}
