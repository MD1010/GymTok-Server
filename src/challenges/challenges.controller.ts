import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "src/users/users.service";
import { UsersValidator } from "src/users/users.validator";
import { Challenge, ChallengeDto } from "./challenge.model";
import { ChallengesService } from "./challenges.service";
import { ChallengesValidator } from "./challenges.validator";

@Controller("challenges")
@ApiTags("Challenges")
export class ChallengesController {
    constructor(private challengesService: ChallengesService,
        private challengesValidator: ChallengesValidator,
        private usersValidator: UsersValidator,
        private usersService: UsersService) { }

    @Get()
    @ApiOkResponse({
        status: 200,
        description: "Get all challenges",
        type: [ChallengeDto],
    })
    async getAllArtists() {
        return this.challengesService.findAllChallenges();
    }

    @Post()
    @ApiOkResponse({
        status: 201,
        description: "Adds new challenge",
        type: ChallengeDto,
    })
    async addChallenge(@Body() challenge: ChallengeDto) {
        return this.challengesService.addChallenge(challenge);
    }

    @Post("recommend/:challengeId/users")
    @ApiOkResponse({
        status: 201,
        description: "Adds to the challenge id to the recommended challenges of the user ids",
        type: [String],
    })
    async addRecommendChallengeForUsers(@Param('challengeId') challengeId: string, @Body() usersIds: string[]) {
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
    async addAcceptChallengeForUsers(@Param('challengeId') challengeId: string, @Body() usersIds: string[]) {
        await this.challengesValidator.throwErrorIfIdIsNotNotExist(challengeId);
        await this.usersValidator.getOrThrowErrorIfOneOfEntityIdsIsNotExist(usersIds);

        await this.usersService.addAcceptChallengeToUsers(challengeId, usersIds);

        return usersIds;
    }
}
