import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ChallengeDto as ChallengeDto } from "./challenge.model";
import { ChallengesService } from "./challenges.service";

@Controller("Challenges")
@ApiTags("Challenges")
export class ChallengesController {
    constructor(private challengesService: ChallengesService) { }

    @Get()
    @ApiOkResponse({
        status: 200,
        description: "Get all challenges",
        type: [ChallengeDto],
    })
    async getAllArtists() {
        return this.challengesService.findAll();
    }

    @Post()
    @ApiOkResponse({
        status: 201,
        description: "Adds new challenge",
        type: ChallengeDto,
    })
    async addChallenge(@Body() challenge: ChallengeDto) {
        //todo - dor!!!
    }

    @Post(":challengeId/Users")
    @ApiOkResponse({
        status: 201,
        description: "The users who have the challenge added to them",
        type: [String],
    })
    async addUser(@Body() usersIds: string[]) {
        //todo - dor!!!
    }
}
