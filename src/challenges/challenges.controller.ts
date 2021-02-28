import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from "@nestjs/platform-express/multer";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { FilesService } from "src/files/files.service";
import { UsersService } from "../users/users.service";
import { UsersValidator } from "../users/users.validator";
import { Challenge, ChallengeDto } from "./challenge.model";
import { ChallengesService } from "./challenges.service";
import { ChallengesValidator } from "./challenges.validator";
import FormData from "form-data";
import { writeFileSync } from "fs";

@Controller("challenges")
@ApiTags("Challenges")
export class ChallengesController {
  constructor(
    private challengesService: ChallengesService,
    private challengesValidator: ChallengesValidator,
    private usersValidator: UsersValidator,
    private usersService: UsersService,
    private fileService: FilesService
  ) {}

  @Get()
  // @UseGuards(AuthGuard("jwt"))
  // @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: "Get all challenges",
    type: [ChallengeDto],
  })
  async getAllArtists() {
    return this.challengesService.findAllChallenges();
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
    FileFieldsInterceptor([
      { name: "description" },
      { name: "video" },
      { name: "selectedFriends" },
      { name: "userId" },
    ])
  )
  async addChallenge(@UploadedFiles() filesToUpload, @Body() fields: any) {
    console.log("here finished");
    try {
      console.log(
        filesToUpload,
        "................................................",
        fields
      );
      // const fileBuffer = Buffer.from(filesToUpload.video[0].buffer);
      let videoLocation = await this.fileService.uploadFile(
        filesToUpload.video[0].buffer
      );
      let challenge = this.challengesService.createChallengeObject(
        fields,
        videoLocation.data
      );
      // const path = `${__dirname}\\videos\\video.mp4`;
      // writeFileSync(path, Buffer.from(filesToUpload.video[0].buffer));

      await this.challengesService.addChallenge(challenge);
      console.log("check your db mother.. ");
    } catch (error) {
      console.log(error);
    }
  }

  @Post("recommend/:challengeId/users")
  @ApiOkResponse({
    status: 201,
    description:
      "Adds to the challenge id to the recommended challenges of the user ids",
    type: [String],
  })
  async addRecommendChallengeForUsers(
    @Param("challengeId") challengeId: string,
    @Body() usersIds: string[]
  ) {
    await this.challengesValidator.throwErrorIfIdIsNotNotExist(challengeId);
    const users = await this.usersValidator.getOrThrowErrorIfOneOfEntityIdsIsNotExist(
      usersIds
    );
    this.usersValidator.throwErrorIfRecommendedChallengeWasAcceptedForUsers(
      users,
      challengeId
    );

    await this.usersService.addRecommendChallengeToUsers(challengeId, usersIds);

    return usersIds;
  }

  @Post("accept/:challengeId/users")
  @ApiOkResponse({
    status: 201,
    description:
      "Adds to the challenge id to the accepted challenges of the user ids",
    type: [String],
  })
  async addAcceptChallengeForUsers(
    @Param("challengeId") challengeId: string,
    @Body() usersIds: string[]
  ) {
    await this.challengesValidator.throwErrorIfIdIsNotNotExist(challengeId);
    await this.usersValidator.getOrThrowErrorIfOneOfEntityIdsIsNotExist(
      usersIds
    );

    await this.usersService.addAcceptChallengeToUsers(challengeId, usersIds);

    return usersIds;
  }
}
