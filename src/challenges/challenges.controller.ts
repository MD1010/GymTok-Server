import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Challenge as Challenge } from "./challenge.model";
import { ChallengesService } from "./challenges.service";

@Controller("Challenges")
@ApiTags("Challenges")
export class ChallengesController {
    constructor(private challengesService: ChallengesService) { }

    @Get()
    @ApiOkResponse({
        status: 200,
        description: "Get all challenges",
        type: [Challenge],
    })
    async getAllArtists() {
        return this.challengesService.findAll();
    }

    @Post()
    @ApiOkResponse({
        status: 201,
        description: "Adds new challenge",
        type: Challenge,
    })
    async addChallenge(@Body() challenge: Challenge) {
        return this.challengesService.addChallenge(challenge);
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
