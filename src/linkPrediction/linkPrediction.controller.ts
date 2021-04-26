import { Controller, Post } from "@nestjs/common";
import { LinkPredictionParser } from "./linkPrediction.parser";
import { LinkPredictionService } from "./linkPrediction.service";
import { PostsService } from "src/posts/posts.service";

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
