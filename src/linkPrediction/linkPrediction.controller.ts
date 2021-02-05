import { Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LinkPredictionService } from "./linkPrediction.service";

@Controller("LinkPrediction")
@ApiTags("LinkPrediction")
export class LinkPredictionController {
    constructor(private linkPredictionService: LinkPredictionService) { }

    async initModel() {
        this.linkPredictionService.initModel();
    }
}
