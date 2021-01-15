import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ChallengeDTO } from "./challenge.model";
import { ChallengesService } from "./challenges.service";

@Controller("Challenges")
@ApiTags("Challenges")
export class ChallengesController {
  constructor(private challengesService: ChallengesService) {}

  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Get all users",
    type: [ChallengeDTO],
  })
  async getAllArtists() {
    return this.challengesService.findAll();
  }
}
