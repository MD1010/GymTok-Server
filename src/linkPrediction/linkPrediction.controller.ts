import { Controller, Post } from "@nestjs/common";
import { fstat } from "fs";
import { UsersService } from "../users/users.service";
import { LinkPredictionParser } from "./linkPrediction.parser";
import { LinkPredictionService } from "./linkPrediction.service";
import { readFile, writeFile } from 'fs'
import { ChallengesService } from "../challenges/challenges.service";
import { RepliesService } from "../Replies/replies.service";

@Controller("LinkPrediction")
export class LinkPredictionController {
    constructor(private linkPredictionService: LinkPredictionService,
        private challengesService: ChallengesService,
        private repliesService: RepliesService,
        private linkPredictionParser: LinkPredictionParser) { }

    async initModelTraining() {
        const challenges = await this.challengesService.findAllChallenges();
        const replies = await this.repliesService.findAllReplies();
        const bipartiteGraph = this.linkPredictionParser.parseUsersAndChallengesToLinkPredictionFormat(challenges, replies);

        this.linkPredictionService.initModelTraining(bipartiteGraph);
    }
}
