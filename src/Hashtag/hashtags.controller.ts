import { Controller, Get, Post, Query } from '@nestjs/common';
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
  async getAllHashtags(@Query("searchTerm") searchTerm: string) {
    return this.hashtagsService.findAllHashtags(searchTerm);
  }
}
