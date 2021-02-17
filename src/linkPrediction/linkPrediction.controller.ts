import { Controller, Post } from "@nestjs/common";
import { fstat } from "fs";
import { UsersService } from "src/users/users.service";
import { LinkPredictionParser } from "./linkPrediction.parser";
import { LinkPredictionService } from "./linkPrediction.service";
import { readFile, writeFile } from 'fs'

@Controller("LinkPrediction")
export class LinkPredictionController {
    constructor(private linkPredictionService: LinkPredictionService,
        private usersService: UsersService,
        private linkPredictionParser: LinkPredictionParser) { }

    async initModel() {
        const users = await this.usersService.findAllUsers();
        const bipartiteGraph = this.linkPredictionParser.parseUsersAndChallengesToLinkPredictionFormat(users);

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
