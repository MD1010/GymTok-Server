import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Document } from "mongoose";
import { BasicEntityDto } from "../common/basicEntity.dto";
import * as mongoose from "mongoose";
import { User } from "src/users/user.model";

@Schema()
export class Post extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  createdBy: User;

  @Prop()
  description: string;

  @Prop({ default: new Date() })
  creationTime: Date;

  @Prop()
  video: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
