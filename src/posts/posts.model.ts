import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNumber, IsString, ValidateNested } from "class-validator";
import * as mongoose from "mongoose";
import { BasicEntityDto } from "../common/basicEntity.dto";
import { User } from "../users/user.model";
import { Type } from "class-transformer";

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: User;

  @Prop({ default: Date.now })
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
