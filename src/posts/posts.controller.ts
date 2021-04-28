import { Body, Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import { ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { HashtagsService } from 'src/Hashtag/hashtags.service';
import { UsersHelper } from 'src/users/users.helper.';
import { FilesService } from '../files/files.service';
import { LinkPredictionController } from '../linkPrediction/linkPrediction.controller';
import { UsersValidator } from '../users/users.validator';
import { PostDto } from './posts.model';
import { PostsParser } from './posts.parser';
import { PostsService } from "./posts.service";
import { PostsValidator } from './posts.validator';

@Controller("posts")
@ApiTags("Posts")
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsParser: PostsParser,
    private usersValidator: UsersValidator,
    private usersHelper: UsersHelper,
    private postsValidator: PostsValidator,
    private filesService: FilesService,
    private hashtagsService: HashtagsService,
    private linkPredictionController: LinkPredictionController
  ) { }


  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Get all posts",
    type: [PostDto],
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'size', type: Number, required: false })
  @ApiQuery({ name: 'uid', type: String, required: false })
  async getAllPosts(@Query("page") page, @Query("size") size, @Query("uid") userId) {
    const posts = await this.postsService.findPostsByPaging(+page, +size, userId);
    await this.usersHelper.addCreatedUserToPosts(posts);

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

    return await this.postsService.getPostsByIds(post.replies.map(reply => reply.toString()))
  }

  @Post("/upload")
  // @ApiConsumes("multipart/form-data")
  @ApiCreatedResponse({
    description: "Adds new post",
    type: PostDto,
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "description" }, { name: "createdBy" }, { name: "video" }, { name: "taggedUsers" }, { name: "likes" },
    { name: "hashtags" }])
  )
  async addPost(@UploadedFiles() filesToUpload, @Body() formDataFields: any) {
    try {
      const returnedPost = await this.validateAndAddNewPost(filesToUpload, formDataFields, false)

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
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "description" }, { name: "createdBy" }, { name: "video" }])
  )
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
    }
  }

  private async validateAndAddNewPost(filesToUpload: any, formDataFields: any, isReply: boolean) {
    const parsedPost = this.postsParser.parsePostFileDataToPost(formDataFields, isReply);
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

    return challenges;
  }
}
