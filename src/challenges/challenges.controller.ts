import { Body, Controller, Get, Param, Post, Query, Req, Res, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express/multer";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { FilesService } from "../files/files.service";
import { LinkPredictionController } from "../linkPrediction/linkPrediction.controller";
import { ReplyDto } from "../Replies/replies.model";
import { RepliesService } from "../Replies/replies.service";
import { UsersHelper } from "../users/users.helper.";
import { resourceLimits } from "worker_threads";
import { UsersService } from "../users/users.service";
import { UsersValidator } from "../users/users.validator";
import { ChallengeDto } from "./challenge.model";
import { ChallengesService } from "./challenges.service";
import { ChallengesValidator } from "./challenges.validator";

@Controller("challenges")
@ApiTags("Challenges")
export class ChallengesController {
  constructor(
    private challengesService: ChallengesService,
    private challengesValidator: ChallengesValidator,
    private usersValidator: UsersValidator,
    private usersService: UsersService,
    private fileService: FilesService,
    private linkPredictionController: LinkPredictionController,
    private usersHelper: UsersHelper,
    private repliesService: RepliesService
  ) {}

  @Get()
  // @UseGuards(AuthGuard("jwt"))
  // @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: "Get all challenges",
    type: [ChallengeDto],
  })
  async getAllChallenges(@Query("page") page, @Query("size") size, @Query("uid") userId) {
    const challenges = await this.challengesService.findAllChallenges(+page, +size, userId);
    await this.usersHelper.addCreatedUserToChallenges(challenges);

    return challenges;
  }

  // @Post()
  // @ApiOkResponse({
  //   status: 201,
  //   description: "Adds new challenge",
  //   type: ChallengeDto,
  // })
  // async addChallenge(@Body() challenge: ChallengeDto) {
  //   return this.challengesService.addChallenge(challenge);
  // }

  @Post("upload")
  // @ApiConsumes("multipart/form-data")
  @ApiOkResponse({
    status: 201,
    description: "Adds new challenge",
    type: ChallengeDto,
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "description" }, { name: "video" }, { name: "selectedFriends" }, { name: "userId" }])
  )
  async addChallenge(@UploadedFiles() filesToUpload, @Body() fields: any) {
    console.log("here finished");
    try {
      const videoLocation = await this.fileService.uploadFile(filesToUpload.video[0].buffer);
      const challenge = this.challengesService.createChallengeObject(fields, videoLocation.data);
      await this.challengesService.addChallenge(challenge);

      setTimeout(() => {
        this.linkPredictionController.initModelTraining();
      }, 0);
      return 201;
    } catch (error) {
      console.log(error);
    }
  }

  @Post("recommend/:challengeId/users")
  @ApiOkResponse({
    status: 201,
    description: "Adds to the challenge id to the recommended challenges of the user ids",
    type: [String],
  })
  async addRecommendChallengeForUsers(@Param("challengeId") challengeId: string, @Body() usersIds: string[]) {
    await this.challengesValidator.throwErrorIfIdIsNotNotExist(challengeId);
    const users = await this.usersValidator.getOrThrowErrorIfOneOfEntityIdsIsNotExist(usersIds);
    this.usersValidator.throwErrorIfRecommendedChallengeWasAcceptedForUsers(users, challengeId);

    await this.usersService.addRecommendChallengeToUsers(challengeId, usersIds);

    return usersIds;
  }

  @Post("accept/:challengeId/users")
  @ApiOkResponse({
    status: 201,
    description: "Adds to the challenge id to the accepted challenges of the user ids",
    type: [String],
  })
  async addAcceptChallengeForUsers(@Param("challengeId") challengeId: string, @Body() usersIds: string[]) {
    await this.challengesValidator.throwErrorIfIdIsNotNotExist(challengeId);
    await this.usersValidator.getOrThrowErrorIfOneOfEntityIdsIsNotExist(usersIds);

    await this.usersService.addAcceptChallengeToUsers(challengeId, usersIds);

    setTimeout(() => {
      this.linkPredictionController.initModelTraining();
    }, 0);

    return usersIds;
  }

  @Get(":challengeId/replies")
  @ApiOkResponse({
    status: 200,
    description: "Get all replies of challenge id",
    type: [ReplyDto],
  })
  async getAllRepliesOfChallengeId(@Param("challengeId") challengeId: string) {
    await this.challengesValidator.throwErrorIfIdIsNotNotExist(challengeId);
    return this.repliesService.findAllRepliesOfChallengeId(challengeId);
  }
}
