import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "../users/users.service";
import { UsersValidator } from "../users/users.validator";
import { ChallengeDto as ChallengeDto } from "./challenge.model";
import { ChallengesService } from "./challenges.service";
import { ChallengesValidator } from "./challenges.validator";

@Controller("Challenges")
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
        return this.challengesService.findAll();
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

    @Post("recommend/:challengeId/Users")
    @ApiOkResponse({
        status: 201,
        description: "The users who have the challenge added to them",
        type: [String],
    })
    async addRecommendChallengeForUsers(@Param('challengeId') challengeId: string, @Body() usersIds: string[]) {
        await this.challengesValidator.throwErrorIfChallengeIdIsNotExist(challengeId);
        const users = await this.usersValidator.getOrThrowErrorIfOneOfUsersIdsIsNotExist(usersIds);
        this.usersValidator.throwErrorIfRecommendedChallengeWasAcceptedForUsers(users, challengeId);

        await this.usersService.addRecommendChallengeToUsers(challengeId, usersIds);

        return usersIds;
    }

    @Post("accept/:challengeId/Users")
    @ApiOkResponse({
        status: 201,
        description: "The users who have the challenge added to them",
        type: [String],
    })
    async addAcceptChallengeForUsers(@Param('challengeId') challengeId: string, @Body() usersIds: string[]) {
        await this.challengesValidator.throwErrorIfChallengeIdIsNotExist(challengeId);
        await this.usersValidator.getOrThrowErrorIfOneOfUsersIdsIsNotExist(usersIds);

        await this.usersService.addAcceptChallengeToUsers(challengeId, usersIds);

        return usersIds;
    }
}
