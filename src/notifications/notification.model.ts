import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsOptional, IsString } from "class-validator";
import * as mongoose from "mongoose";
import { User } from "src/users/user.model";
import { BasicEntityDto } from "../common/basicEntity.dto";

export class NotificationDto extends BasicEntityDto {
  @ApiResponseProperty()
  _id?: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  sender: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiResponseProperty()
  @IsOptional()
  @IsDate()
  date: Date;

  @ApiProperty()
  data: any;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readBy: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notifiedUsers: string[];
}

@Schema()
export class Notification extends mongoose.Document {
  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop()
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  sender: User;

  @Prop()
  body: string;

  @Prop({ type: Object })
  data: any;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: User.name, default: [] }])
  readBy: User[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: User.name, default: [] }])
  notifiedUsers: User[];
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
