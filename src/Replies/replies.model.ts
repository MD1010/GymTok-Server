import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import * as mongoose from "mongoose";

import { BasicEntityDto } from "../common/basicEntity.dto";
import { User } from "../users/user.model";
import { Challenge } from "../challenges/challenge.model";

export class ReplyDto extends BasicEntityDto {
  @ApiResponseProperty()
  _id?: string;

  @ApiProperty()
  @IsString()
  challengeId: string;

  @ApiProperty()
  @IsString()
  replierId: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  video: string;
}

@Schema()
export class Reply extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" })
  challengeId: Challenge;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  replierId: User;

  @Prop({ default: new Date() })
  creationTime: Date;

  @Prop()
  description: string;

  @Prop()
  video: string;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
