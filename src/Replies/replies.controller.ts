import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ChallengesValidator } from 'src/challenges/challenges.validator';
import { FilesService } from 'src/files/files.service';
import { UsersValidator } from 'src/users/users.validator';
import { ReplyDto } from './replies.model';
import { RepliesParser } from './replies.parser';
import { RepliesService } from "./replies.service";

@Controller("replies")
@ApiTags("Replies")
export class RepliesController {
  constructor(private usersService: RepliesService,
    private filesService: FilesService,
    private repliesParser: RepliesParser,
    private usersValidator: UsersValidator,
    private challengesValidator: ChallengesValidator
  ) { }

  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Get all replies",
    type: [ReplyDto],
  })
  async getAllReplies() {
    return this.usersService.findAllReplies();
  }

  @Post("/upload")
  // @ApiConsumes("multipart/form-data")
  @ApiOkResponse({
    status: 201,
    description: "Adds new reply",
    type: ReplyDto,
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "description" }, { name: "video" }, { name: "challengeId" }, { name: "replierId" }])
  )
  async addReply(@UploadedFiles() filesToUpload, @Body() fields: any) {
    try {
      const reply = this.repliesParser.getReplyPropertiesFileFormDataFields(fields);
      await this.usersValidator.throwErrorIfIdIsNotNotExist(reply.replierId);
      await this.challengesValidator.throwErrorIfIdIsNotNotExist(reply.challengeId);
      console.log("filesToUpload.video[0].buffer", filesToUpload.video[0].buffer);
      //const videoLocation = await this.filesService.uploadFile(filesToUpload.video[0].buffer);
      //reply.video = videoLocation.data;
      //await this.challengesService.addChallenge(challenge);

      // setTimeout(() => {
      //   this.linkPredictionController.initModelTraining();
      // }, 0);
      return 201;
    } catch (error) {
      console.log(error);
    }
  }
}
