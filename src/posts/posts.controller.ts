import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
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
