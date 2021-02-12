import { Controller, Post } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { LinkPredictionParser } from "./linkPrediction.parser";
import { LinkPredictionService } from "./linkPrediction.service";

@Controller("LinkPrediction")
export class LinkPredictionController {
    constructor(private linkPredictionService: LinkPredictionService,
        private usersService: UsersService,
        private linkPredictionParser: LinkPredictionParser) { }

    async initModel() {
        const users = await this.usersService.findAllUsers();
        const bipartiteGraph = this.linkPredictionParser.parseUsersAndChallengesToLinkPredictionFormat(users);

        this.linkPredictionService.initModelTraining();
    }
}
