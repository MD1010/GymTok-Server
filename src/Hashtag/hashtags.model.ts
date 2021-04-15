import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import * as mongoose from "mongoose";

import { BasicEntityDto } from "../common/basicEntity.dto";

export class HashtagDto extends BasicEntityDto {
  @ApiResponseProperty()
  _id?: string;

  @ApiProperty()
  @IsString()
  hashtag: string;
}

@Schema()
export class Hashtag extends mongoose.Document {
  @Prop()
  hashtag: string;
}

export const HashtagSchema = SchemaFactory.createForClass(Hashtag);
