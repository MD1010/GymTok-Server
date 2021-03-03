import { Controller, Post } from "@nestjs/common";
import { fstat } from "fs";
import { UsersService } from "src/users/users.service";
import { LinkPredictionParser } from "./linkPrediction.parser";
import { LinkPredictionService } from "./linkPrediction.service";
import { readFile, writeFile } from 'fs'
import { ChallengesService } from "src/challenges/challenges.service";
import { RepliesService } from "src/Replies/replies.service";

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


        // readFile('read.txt', 'utf8', (err, data) => {
        //     if (err) {
        //         throw err;
        //     }

        //     const str = bipartiteGraph.concat(`\n${data}`);
        //     writeFile('write.txt', str, err => {
        //         if (err) {
        //             throw err;
        //         }
        //         this.linkPredictionService.initModelTraining(str);
        //     })
        // });
    }
}
