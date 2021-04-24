import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express/multer";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ChallengesValidator } from "../challenges/challenges.validator";
import { FilesService } from "../files/files.service";
import { LinkPredictionController } from "../linkPrediction/linkPrediction.controller";
import { UsersValidator } from "../users/users.validator";
import { ReplyDto } from "./replies.model";
import { RepliesParser } from "./replies.parser";
import { RepliesService } from "./replies.service";

@Controller("replies")
@ApiTags("Replies")
export class RepliesController {
  constructor(
    private repliesService: RepliesService,
    private filesService: FilesService,
    private repliesParser: RepliesParser,
    private usersValidator: UsersValidator,
    private challengesValidator: ChallengesValidator,
    private linkPredictionController: LinkPredictionController
  ) {}

  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Get all replies",
    type: [ReplyDto],
  })
  async getAllReplies() {
    return this.repliesService.findAllReplies();
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
      await this.usersValidator.getOrThrowErrorIfIdIsNotNotExist(reply.replierId);
      await this.challengesValidator.getOrThrowErrorIfIdIsNotNotExist(reply.challengeId);
      const locations = await this.filesService.uploadFile(filesToUpload.video[0].buffer);
      reply.video = locations.videoID;
      reply.gif = locations.gifID;
      const returnedReply = await this.repliesService.basicRepliesService.createEntity(reply);

      setTimeout(() => {
        this.linkPredictionController.initModelTraining();
      }, 0);
      return returnedReply;
    } catch (error) {
      console.log(error);
    }
  }
}
