import { Controller, Post } from "@nestjs/common";
import { fstat } from "fs";
import { UsersService } from "src/users/users.service";
import { LinkPredictionParser } from "./linkPrediction.parser";
import { LinkPredictionService } from "./linkPrediction.service";
import { readFile, writeFile } from 'fs'
import { ChallengesService } from "src/challenges/challenges.service";

@Controller("LinkPrediction")
export class LinkPredictionController {
    constructor(private linkPredictionService: LinkPredictionService,
        private challengesService: ChallengesService,
        private linkPredictionParser: LinkPredictionParser) { }

    async initModelTraining() {
        const challenges = await this.challengesService.findAllChallenges();
        console.log("aaaa", challenges);
        const bipartiteGraph = this.linkPredictionParser.parseUsersAndChallengesToLinkPredictionFormat(challenges);

        console.log("bipartiteGraph", bipartiteGraph);

        readFile('read.txt', 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const str = bipartiteGraph.concat(`\n${data}`);
            writeFile('write.txt', str, err => {
                if (err) {
                    throw err;
                }
                this.linkPredictionService.initModelTraining(str);
            })
        });
    }
}
