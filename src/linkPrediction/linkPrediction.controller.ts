import { Controller, Post } from "@nestjs/common";
import { fstat } from "fs";
import { UsersService } from "../users/users.service";
import { LinkPredictionParser } from "./linkPrediction.parser";
import { LinkPredictionService } from "./linkPrediction.service";
import { ChallengesService } from "../challenges/challenges.service";
import { RepliesService } from "../Replies/replies.service";
import { PostsService } from "src/posts/posts.service";
const { writeFile } = require('fs').promises

@Controller("LinkPrediction")
export class LinkPredictionController {
    constructor(private linkPredictionService: LinkPredictionService,
        private postsService: PostsService,
        private linkPredictionParser: LinkPredictionParser) { }

    async initModelTraining() {
        const posts = await this.postsService.findAllPosts();
        const bipartiteGraph = this.linkPredictionParser.postsToLinkPredictionFormat(posts);

        this.linkPredictionService.initModelTraining(bipartiteGraph);
    }
}
