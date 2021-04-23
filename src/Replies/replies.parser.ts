import { Injectable, HttpService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Challenge } from "src/challenges/challenge.model";
import { Reply, ReplyDto } from "src/Replies/replies.model";
import { User } from "src/users/user.model";

@Injectable()
export class RepliesParser {
  getReplyPropertiesFileFormDataFields(formDataFields: any): ReplyDto {
    return {
      challengeId: formDataFields.challengeId,
      replierId: formDataFields.replierId,
      description: formDataFields.description,
      video: "",
      gif: "",
    };
  }
}
