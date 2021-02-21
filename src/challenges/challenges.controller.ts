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
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express/multer";
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "../users/users.service";
import { UsersValidator } from "../users/users.validator";
import { Challenge, ChallengeDto } from "./challenge.model";
import { ChallengesService } from "./challenges.service";
import { ChallengesValidator } from "./challenges.validator";

@Controller("challenges")
@ApiTags("Challenges")
export class ChallengesController {
  constructor(
    private challengesService: ChallengesService,
    private challengesValidator: ChallengesValidator,
    private usersValidator: UsersValidator,
    private usersService: UsersService
  ) {}

  @Get()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
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
  //@UseInterceptors(FilesInterceptor("file"))
  @UseInterceptors(FileFieldsInterceptor([{ name: "description" }, { name: "video" }, { name: "selectedFriends" }]))
  async addChallenge(@UploadedFiles() challengeFiles, @Body() fields: any) {
    console.log(fields);
    console.log(challengeFiles);
    // console.log(fields);
    // const response = [];
    //   const fileReponse = {
    //     originalname: file.originalname,
    //     encoding: file.encoding,
    //     mimetype: file.mimetype,
    //     id: file.id,
    //     filename: file.filename,
    //     metadata: file.metadata,
    //     bucketName: file.bucketName,
    //     chunkSize: file.chunkSize,
    //     size: file.size,
    //     md5: file.md5,
    //     uploadDate: file.uploadDate,
    //     contentType: file.contentType,
    // };
    // response.push(fileReponse);
    // console.log(Buffer.from(challengeFiles.video[0].buffer).toString("base64"));
    //console.log(challengeFiles.video[0]);

    // this.filesControoler.upload(challengeFiles)
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

    return usersIds;
  }
}
