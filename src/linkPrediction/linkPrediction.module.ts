import { HttpModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LinkPredictionController } from "./linkPrediction.controller";
import { LinkPredictionService } from "./linkPrediction.service";

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [LinkPredictionController],
  providers: [LinkPredictionService],
  exports: [LinkPredictionService]
})
export class LinkPredictionModule { }
