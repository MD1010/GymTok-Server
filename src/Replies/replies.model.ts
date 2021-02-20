import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import * as mongoose from "mongoose";

import { BasicEntityDto } from "../common/basicEntity.dto";
import { Post } from "src/Posts/posts.model";
import { User } from "src/users/user.model";
import { Challenge } from "src/challenges/challenge.model";

export class ReplyDto extends BasicEntityDto {
  @ApiResponseProperty()
  _id: string;

  @ApiProperty()
  @IsString()
  createdBy: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  video: string;

  @ApiProperty()
  replierId: mongoose.Schema.Types.ObjectId;
}

@Schema()
export class Reply extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" })
  challengeId: Challenge;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Post" })
  postId: Post;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  replierId: User;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
