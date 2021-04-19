import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";
import { Document } from "mongoose";
import { BasicEntityDto } from "../common/basicEntity.dto";
import { Reply } from "../Replies/replies.model";

import * as mongoose from "mongoose";
import { User } from "../users/user.model";
export class ChallengeDto extends BasicEntityDto {
  @ApiProperty()
  @IsString()
  createdBy: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  video: string;

  @ApiProperty()
  @IsArray()
  selectedFriends: string[];

  @ApiProperty()
  @IsArray()
  hashtags: string[];

  // @ApiProperty()
  // @IsString()
  // score: string;
}

@Schema()
export class Challenge extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  createdBy: User;

  @Prop()
  description: string;

  @Prop({ default: new Date() })
  creationTime: Date;

  @Prop()
  video: string;

  @Prop({ default: [] })
  likes: mongoose.Types.ObjectId[];

  @Prop({ default: [] })
  hashtags: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  selectedFriends: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }] })
  replies: Reply[];
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
