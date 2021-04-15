import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ChallengesValidator } from '../challenges/challenges.validator';
import { FilesService } from '../files/files.service';
import { LinkPredictionController } from '../linkPrediction/linkPrediction.controller';
import { UsersValidator } from '../users/users.validator';
import { Hashtag, HashtagDto } from './hashtags.model';
import { HashtagsService } from './hashtags.service';


@Controller("hashtags")
@ApiTags("Hashtags")
export class HashtagsController {
  constructor(private hashtagsService: HashtagsService) { }

  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Get all hashtags",
    type: [HashtagDto],
  })
  async getAllReplies() {
    return this.hashtagsService.findAllHashtags();
  }
}
