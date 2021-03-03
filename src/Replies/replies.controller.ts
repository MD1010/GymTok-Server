import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ReplyDto } from './replies.model';
import { RepliesService } from "./replies.service";

@Controller("replies")
@ApiTags("Replies")
export class RepliesController {
  constructor(private usersService: RepliesService) { }

  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Get all users",
    type: [ReplyDto],
  })
  async getAllReplies() {
    return this.usersService.findAllReplies();
  }
}
