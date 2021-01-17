import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";
import { Document } from "mongoose";
import { BasicDto } from "src/common/basic.dto";

export class UserDto extends BasicDto {
  @ApiResponseProperty()
  _id: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsArray()
  recommendedChallenges: string[];

  @ApiProperty()
  @IsArray()
  acceptedChallenges: string[];

  @ApiResponseProperty()
  totalScore: number;
}

@Schema()
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  fullName: string;

  @Prop()
  image: string;

  @Prop()
  recommendedChallenges: string[];

  @Prop()
  acceptedChallenges: string[];

  @Prop({ default: 0 })
  totalScore: number;
}

export const UserSchema = SchemaFactory.createForClass(User);