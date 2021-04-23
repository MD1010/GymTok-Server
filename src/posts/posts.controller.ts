import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ChallengesValidator } from '../challenges/challenges.validator';
import { FilesService } from '../files/files.service';
import { LinkPredictionController } from '../linkPrediction/linkPrediction.controller';
import { UsersValidator } from '../users/users.validator';
import { PostDto } from './posts.model';
import { RepliesParser } from './posts.parser';
import { PostsService } from "./posts.service";

@Controller("posts")
@ApiTags("Posts")
export class PostsController {
  constructor(
    private postsService: PostsService
  ) { }

  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Get all posts",
    type: [PostDto],
  })
  async getAllPosts() {
    return this.postsService.findAllPosts();
  }

  @Get(":postId")
  @ApiOkResponse({
    status: 200,
    description: "Get all posts",
    type: PostDto,
  })
  async getPostById(@Param("postId") postId: string) {
    return this.postsService.getPostById(postId);
  }

  // @Post("recommend/:challengeId/users")
  // @ApiOkResponse({
  //   status: 201,
  //   description: "Adds to the challenge id to the recommended challenges of the user ids",
  //   type: [String],
  // })
  // async addRecommendChallengeForUsers(@Param("challengeId") challengeId: string, @Body() usersIds: string[]) {
  //   await this.challengesValidator.getOrThrowErrorIfIdIsNotNotExist(challengeId);
  //   const users = await this.usersValidator.getOrThrowErrorIfOneOfEntityIdsIsNotExist(usersIds);
  //   this.usersValidator.throwErrorIfRecommendedChallengeWasAcceptedForUsers(users, challengeId);

  //   await this.usersService.addRecommendChallengeToUsers(challengeId, usersIds);

  //   return usersIds;
  // }

  // @Post("/upload")
  // // @ApiConsumes("multipart/form-data")
  // @ApiOkResponse({
  //   status: 201,
  //   description: "Adds new reply",
  //   type: PostDto,
  // })
  // @UseInterceptors(
  //   FileFieldsInterceptor([{ name: "description" }, { name: "video" }, { name: "challengeId" }, { name: "replierId" }])
  // )
  // async addReply(@UploadedFiles() filesToUpload, @Body() fields: any) {
  //   try {
  //     const reply = this.repliesParser.getReplyPropertiesFileFormDataFields(fields);
  //     await this.usersValidator.getOrThrowErrorIfIdIsNotNotExist(reply.replierId);
  //     await this.challengesValidator.getOrThrowErrorIfIdIsNotNotExist(reply.challengeId);
  //     const videoLocation = await this.filesService.uploadFile(filesToUpload.video[0].buffer);
  //     reply.video = videoLocation.data;
  //     const returnedReply = await this.repliesService.basicRepliesService.createEntity(reply);

  //     setTimeout(() => {
  //       this.linkPredictionController.initModelTraining();
  //     }, 0);
  //     return returnedReply;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}
