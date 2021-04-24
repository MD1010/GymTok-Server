import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, isBoolean, IsDate, IsNumber, IsString, ValidateNested } from "class-validator";
import * as mongoose from "mongoose";
import { BasicEntityDto } from "../common/basicEntity.dto";
import { User } from "../users/user.model";
import { Challenge } from "../challenges/challenge.model";
import { Type } from "class-transformer";
import { Hashtag } from "src/Hashtag/hashtags.model";

export class PostDto extends BasicEntityDto {
  @ApiResponseProperty()
  _id?: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  createdBy: string;

  @ApiResponseProperty()
  @IsDate()
  publishDate?: Date;

  @ApiProperty()
  @IsString()
  videoURI: string;

  @ApiProperty()
  @IsString()
  gif: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => String)
  taggedUsers: string[];

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => String)
  replies: string[];

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => String)
  likes: string[];

  @ApiProperty()
  @IsBoolean()
  isReply: boolean;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => String)
  hashtags: string[];
}

@Schema()
export class Post extends mongoose.Document {
  @Prop()
  description: string;

  @Prop({})
  createdBy: mongoose.Types.ObjectId;

  @Prop({ default: new Date() })
  publishDate: Date;

  @Prop()
  videoURI: string;

  @Prop()
  gif: string;

  @Prop({ default: [] })
  taggedUsers: mongoose.Types.ObjectId[];

  @Prop({ default: [] })
  replies: mongoose.Types.ObjectId[];

  @Prop({ default: [] })
  likes: mongoose.Types.ObjectId[];

  @Prop()
  isReply: boolean;

  @Prop({ default: [] })
  hashtags: mongoose.Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
