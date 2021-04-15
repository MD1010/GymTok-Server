import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { HashtagDto } from './hashtags.model';
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
  async getAllHashtags() {
    return this.hashtagsService.findAllHashtags();
  }
}
