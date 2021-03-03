import { forwardRef, Module } from "@nestjs/common";
import { RepliesService } from "./replies.service";
import { RepliesController } from "./replies.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Reply, ReplySchema } from "./replies.model";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reply.name, schema: ReplySchema }])
  ],
  controllers: [RepliesController],
  providers: [RepliesService],
  exports: [RepliesService]
})
export class RepliesModule { }
