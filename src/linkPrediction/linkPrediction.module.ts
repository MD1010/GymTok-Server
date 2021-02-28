import { forwardRef, HttpModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "src/users/user.module";
import { LinkPredictionController } from "./linkPrediction.controller";
import { LinkPredictionHelper } from "./linkPrediction.helper";
import { LinkPredictionParser } from "./linkPrediction.parser";
import { LinkPredictionService } from "./linkPrediction.service";

@Module({
  imports: [ConfigModule, HttpModule, forwardRef(() => UserModule)],
  controllers: [LinkPredictionController],
  providers: [LinkPredictionService, LinkPredictionParser, LinkPredictionHelper, LinkPredictionController],
  exports: [LinkPredictionService, LinkPredictionHelper, LinkPredictionController]
})
export class LinkPredictionModule { }
