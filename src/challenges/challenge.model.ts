import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";
import { Document } from "mongoose";
import { BasicEntityDto } from "../common/basicEntity.dto";

import { Reply } from "src/Replies/replies.model";
import { Post } from "src/Posts/posts.model";

import * as mongoose from "mongoose";
export class ChallengeDto extends BasicEntityDto {
  @ApiResponseProperty()
  _id: string;

  @ApiProperty()
  @IsString()
  createdBy: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  score: string;
}

@Schema()
export class Challenge extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Post" })
  postId: Post;

  @Prop()
  score: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }] })
  replies: Reply[];
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
